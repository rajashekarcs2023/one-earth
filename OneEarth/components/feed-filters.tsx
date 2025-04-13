"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Filter, SlidersHorizontal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FeedFiltersProps {
  onFilterChange: (filters: {
    types: string[]
    reporterSeverity: number[]
    communitySeverity: string[]
    status: string[]
  }) => void
}

export default function FeedFilters({ onFilterChange }: FeedFiltersProps) {
  const [open, setOpen] = useState(false)
  const [activeTypes, setActiveTypes] = useState<string[]>([])
  const [activeReporterSeverity, setActiveReporterSeverity] = useState<number[]>([])
  const [activeCommunitySeverity, setActiveCommunitySeverity] = useState<string[]>([])
  const [activeStatus, setActiveStatus] = useState<string[]>([])

  const types = [
    { id: "Dumping", emoji: "🗑️", label: "Dumping" },
    { id: "Deforestation", emoji: "🌲", label: "Deforestation" },
    { id: "Water Pollution", emoji: "🧪", label: "Water Pollution" },
    { id: "Air Pollution", emoji: "🔥", label: "Air Pollution" },
  ]

  const reporterSeverityLevels = [1, 2, 3, 4, 5]

  const communitySeverityLevels = [
    { id: "Minor", color: "bg-green-100 text-green-800", label: "Minor" },
    { id: "Moderate", color: "bg-green-100 text-green-800", label: "Moderate" },
    { id: "Significant", color: "bg-yellow-100 text-yellow-800", label: "Significant" },
    { id: "Severe", color: "bg-orange-100 text-orange-800", label: "Severe" },
    { id: "Critical", color: "bg-red-100 text-red-800", label: "Critical" },
  ]

  const statusOptions = [
    { id: "Verified", color: "bg-purple-100 text-purple-800", label: "Verified" },
    { id: "Resolved", color: "bg-green-100 text-green-800", label: "Resolved" },
    { id: "Pending", color: "bg-gray-100 text-gray-800", label: "Pending" },
  ]

  const toggleType = (typeId: string) => {
    setActiveTypes((prev) => (prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]))
  }

  const toggleReporterSeverity = (level: number) => {
    setActiveReporterSeverity((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const toggleCommunitySeverity = (level: string) => {
    setActiveCommunitySeverity((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const toggleStatus = (status: string) => {
    setActiveStatus((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const applyFilters = () => {
    onFilterChange({
      types: activeTypes,
      reporterSeverity: activeReporterSeverity,
      communitySeverity: activeCommunitySeverity,
      status: activeStatus,
    })
    setOpen(false)
  }

  const clearFilters = () => {
    setActiveTypes([])
    setActiveReporterSeverity([])
    setActiveCommunitySeverity([])
    setActiveStatus([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {(activeTypes.length > 0 ||
            activeReporterSeverity.length > 0 ||
            activeCommunitySeverity.length > 0 ||
            activeStatus.length > 0) && (
            <span className="ml-1 bg-emerald-100 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {activeTypes.length +
                activeReporterSeverity.length +
                activeCommunitySeverity.length +
                activeStatus.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filter Reports
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="type" className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="type">Type</TabsTrigger>
            <TabsTrigger value="reporter">Reporter</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="type" className="space-y-4 py-4">
            <h3 className="text-sm font-medium">Report Type</h3>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type.id}
                  variant="outline"
                  size="sm"
                  className={`flex items-center ${
                    activeTypes.includes(type.id) ? "bg-emerald-50 border-emerald-600 text-emerald-800" : ""
                  }`}
                  onClick={() => toggleType(type.id)}
                >
                  <span className="mr-1">{type.emoji}</span>
                  {type.label}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reporter" className="space-y-4 py-4">
            <h3 className="text-sm font-medium">Reporter's Severity Assessment</h3>
            <div className="flex flex-wrap gap-2">
              {reporterSeverityLevels.map((level) => (
                <Button
                  key={level}
                  variant="outline"
                  size="sm"
                  className={`${
                    activeReporterSeverity.includes(level) ? "bg-emerald-50 border-emerald-600 text-emerald-800" : ""
                  }`}
                  onClick={() => toggleReporterSeverity(level)}
                >
                  Level {level}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-4 py-4">
            <h3 className="text-sm font-medium">Community Assessment</h3>
            <div className="flex flex-wrap gap-2">
              {communitySeverityLevels.map((level) => (
                <Button
                  key={level.id}
                  variant="outline"
                  size="sm"
                  className={`${
                    activeCommunitySeverity.includes(level.id)
                      ? "bg-emerald-50 border-emerald-600 text-emerald-800"
                      : level.color
                  }`}
                  onClick={() => toggleCommunitySeverity(level.id)}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4 py-4">
            <h3 className="text-sm font-medium">Report Status</h3>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status.id}
                  variant="outline"
                  size="sm"
                  className={`${
                    activeStatus.includes(status.id)
                      ? "bg-emerald-50 border-emerald-600 text-emerald-800"
                      : status.color
                  }`}
                  onClick={() => toggleStatus(status.id)}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={clearFilters}>
            Clear All
          </Button>
          <Button onClick={applyFilters} className="bg-emerald-600 hover:bg-emerald-700">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
