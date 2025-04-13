"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Leaf, Droplet, Wind, Trash2, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EarthImpactProps {
  reportId: string
  reportType?: string
  severity: number
}

export default function EarthImpact({ reportId, reportType, severity }: EarthImpactProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedImpact, setSelectedImpact] = useState<string | null>(null)
  const [pledgeCount, setPledgeCount] = useState<number>(Math.floor(Math.random() * 25) + 5)
  const { toast } = useToast()

  // Get the appropriate icon based on report type
  const getImpactIcon = () => {
    switch (reportType?.toLowerCase()) {
      case "deforestation":
        return <Leaf className="h-5 w-5 text-emerald-600" />
      case "water pollution":
        return <Droplet className="h-5 w-5 text-blue-600" />
      case "air pollution":
        return <Wind className="h-5 w-5 text-sky-600" />
      case "dumping":
        return <Trash2 className="h-5 w-5 text-amber-600" />
      default:
        return <Leaf className="h-5 w-5 text-emerald-600" />
    }
  }

  // Calculate the impact level based on severity (1-5)
  const getImpactLevel = () => {
    const levels = ["Minimal", "Minor", "Moderate", "Significant", "Severe"]
    return levels[severity - 1] || "Moderate"
  }

  // Calculate the recovery time based on severity
  const getRecoveryTime = () => {
    const times = ["Days", "Weeks", "Months", "Years", "Decades"]
    return times[severity - 1] || "Months"
  }

  // Get impact areas based on report type
  const getImpactAreas = () => {
    const baseImpacts = ["Local Wildlife", "Human Health", "Ecosystem Balance"]

    switch (reportType?.toLowerCase()) {
      case "deforestation":
        return [...baseImpacts, "Carbon Capture", "Soil Erosion"]
      case "water pollution":
        return [...baseImpacts, "Water Quality", "Marine Life"]
      case "air pollution":
        return [...baseImpacts, "Air Quality", "Climate Change"]
      case "dumping":
        return [...baseImpacts, "Soil Quality", "Groundwater"]
      default:
        return baseImpacts
    }
  }

  const handlePledge = (impact: string) => {
    if (selectedImpact === impact) {
      setSelectedImpact(null)
      setPledgeCount(pledgeCount - 1)
      toast({
        title: "Pledge removed",
        description: "You've removed your pledge to help with this issue.",
      })
    } else {
      setSelectedImpact(impact)
      setPledgeCount(pledgeCount + 1)
      toast({
        title: "Thank you for your pledge!",
        description: "Your commitment to help makes a real difference.",
      })
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-white shadow-md hover:bg-emerald-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {getImpactIcon()}
        <span className="text-xs font-medium">Earth Impact</span>
        <span className="text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">{pledgeCount}</span>
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-20 w-72"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-sm">Environmental Impact</h3>
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800">
                  {getImpactLevel()} Impact
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Recovery Time:</span>
                  <span className="font-medium">{getRecoveryTime()}</span>
                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-red-500"
                    style={{ width: `${severity * 20}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium">Affected Areas:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getImpactAreas().map((impact, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className={`h-auto py-1 text-xs justify-start ${
                        selectedImpact === impact ? "border-emerald-500 bg-emerald-50" : ""
                      }`}
                      onClick={() => handlePledge(impact)}
                    >
                      {selectedImpact === impact ? <span className="mr-1 text-emerald-600">✓</span> : null}
                      {impact}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 p-2 rounded-md">
                <div className="flex items-center text-xs text-emerald-800">
                  <Users className="h-3 w-3 mr-1" />
                  <span className="font-medium">{pledgeCount} people</span>
                  <ArrowRight className="h-3 w-3 mx-1" />
                  <span>pledged to help</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 italic">
                Select an area to pledge your help in solving this issue
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
