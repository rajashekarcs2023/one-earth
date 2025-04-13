"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Info } from "lucide-react"
import { createPortal } from "react-dom"

interface EarthEchoesProps {
  reportId: string
  initialSeverity?: number
  onUserAssessment?: (severity: number) => void
}

export default function EarthEchoes({ reportId, initialSeverity = 3, onUserAssessment }: EarthEchoesProps) {
  const [userSeverity, setUserSeverity] = useState<number | null>(null)
  const [engagementCount, setEngagementCount] = useState(Math.floor(Math.random() * 50) + 10)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const infoButtonRef = useRef<HTMLButtonElement>(null)
  const { toast } = useToast()
  const [showLevelTooltips, setShowLevelTooltips] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  })
  const levelRefs = useRef<{ [key: number]: HTMLDivElement | null }>({
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
  })
  const [isMounted, setIsMounted] = useState(false)

  // Mount state for client-side rendering
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Get background color based on severity - with increased contrast
  const getBackgroundColor = (severity: number) => {
    if (severity <= 1) return "bg-green-100"
    if (severity <= 2) return "bg-green-100"
    if (severity <= 3) return "bg-yellow-100"
    if (severity <= 4) return "bg-orange-100"
    return "bg-red-100"
  }

  // Get border color based on severity - with increased contrast
  const getBorderColor = (severity: number) => {
    if (severity <= 1) return "border-green-500"
    if (severity <= 2) return "border-green-500"
    if (severity <= 3) return "border-yellow-500"
    if (severity <= 4) return "border-orange-500"
    return "border-red-500"
  }

  const handleSeverityChange = (value: number[]) => {
    const severity = value[0]
    setUserSeverity(severity)
    setIsAnimating(true)
    setEngagementCount(engagementCount + 1)

    // Call the callback if provided
    if (onUserAssessment) {
      onUserAssessment(severity)
    }

    setTimeout(() => {
      setIsAnimating(false)
    }, 1000)

    toast({
      title: "Your echo has been heard",
      description: `You've assessed this issue as ${getSeverityLabel(severity)} (${severity}/5)`,
      duration: 3000,
    })
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 1) return "bg-green-600"
    if (severity <= 2) return "bg-green-500"
    if (severity <= 3) return "bg-yellow-500"
    if (severity <= 4) return "bg-orange-500"
    return "bg-red-600"
  }

  const getSeverityLabel = (severity: number) => {
    if (severity <= 1) return "Minor"
    if (severity <= 2) return "Moderate"
    if (severity <= 3) return "Significant"
    if (severity <= 4) return "Severe"
    return "Critical"
  }

  const getSeverityDescription = (severity: number) => {
    switch (Math.round(severity)) {
      case 1:
        return "Localized impact with natural recovery likely within weeks. Minimal ecosystem disruption."
      case 2:
        return "Limited area affected with recovery possible within months. Some wildlife displacement."
      case 3:
        return "Significant ecosystem disruption affecting multiple species. Recovery may take 1-2 years."
      case 4:
        return "Severe damage to habitat with long-term consequences. Recovery requires 3-5 years and intervention."
      case 5:
        return "Critical ecosystem damage with potential permanent loss. May affect endangered species or vital resources."
      default:
        return "Impact assessment unavailable."
    }
  }

  // Calculate the number of echo rings to show based on engagement count
  const getEchoRings = () => {
    if (engagementCount < 20) return 2
    if (engagementCount < 50) return 3
    if (engagementCount < 100) return 4
    return 5
  }

  // Determine which severity to use for colors
  const displaySeverity = userSeverity !== null ? userSeverity : initialSeverity

  const handleLevelTooltipMouseEnter = useCallback((level: number) => {
    setShowLevelTooltips((prev) => ({ ...prev, [level]: true }))
  }, [])

  const handleLevelTooltipMouseLeave = useCallback((level: number) => {
    setShowLevelTooltips((prev) => ({ ...prev, [level]: false }))
  }, [])

  const setLevelRef = useCallback((el: HTMLDivElement | null, level: number) => {
    levelRefs.current[level] = el
  }, [])

  // Function to render tooltip with portal
  const renderTooltip = (
    content: React.ReactNode,
    targetRef: React.RefObject<HTMLElement>,
    position: { top?: string; bottom?: string; left?: string; right?: string; transform?: string },
    level?: number,
  ) => {
    if (!isMounted || !targetRef.current) return null

    const rect = targetRef.current.getBoundingClientRect()
    const tooltipStyle: React.CSSProperties = {
      position: "fixed",
      zIndex: 9999,
      ...position,
    }

    // Calculate absolute positions based on the target element
    if (position.top === "above") {
      tooltipStyle.top = `${rect.top - 10}px`
      tooltipStyle.transform = "translateY(-100%)"
    } else if (position.bottom === "below") {
      tooltipStyle.top = `${rect.bottom + 10}px`
    }

    // Special handling for the leftmost tooltip (Minor)
    if (position.left === "center" && level === 1) {
      // This is the "Minor" tooltip at the left edge
      tooltipStyle.left = "20px" // Fixed position from left edge
      tooltipStyle.transform = tooltipStyle.transform || ""
    } else if (position.left === "center") {
      tooltipStyle.left = `${rect.left + rect.width / 2}px`
      tooltipStyle.transform = `${tooltipStyle.transform || ""} translateX(-50%)`.trim()
    } else if (position.left) {
      tooltipStyle.left = `${rect.left + Number.parseInt(position.left)}px`
    }

    return createPortal(
      <div className="bg-white p-2 rounded-md shadow-lg border" style={tooltipStyle}>
        {content}
        <div
          className="absolute w-3 h-3 bg-white transform rotate-45"
          style={{
            bottom: position.top === "above" ? "-6px" : "auto",
            top: position.bottom === "below" ? "-6px" : "auto",
            left:
              position.left === "center" && level !== 1
                ? "50%"
                : position.left
                  ? `calc(${position.left} + 5px)`
                  : level === 1
                    ? "20px"
                    : "auto",
            transform: position.left === "center" && level !== 1 ? "translateX(-50%)" : "none",
          }}
        ></div>
      </div>,
      document.body,
    )
  }

  return (
    <div
      className={`w-full space-y-3 p-3 rounded-lg relative overflow-visible border transition-colors duration-300 ${getBackgroundColor(
        displaySeverity,
      )} ${getBorderColor(displaySeverity)}`}
    >
      {/* Echo visualization */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {Array.from({ length: getEchoRings() }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${getSeverityColor(displaySeverity)} opacity-10`}
            initial={{ width: 20, height: 20 }}
            animate={{
              width: isAnimating ? [20, 300 + i * 50] : 20 + i * 40,
              height: isAnimating ? [20, 300 + i * 50] : 20 + i * 40,
              opacity: isAnimating ? [0.3, 0] : 0.1 - i * 0.02,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              repeat: isAnimating ? 0 : Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              repeatDelay: 1,
            }}
          />
        ))}
      </div>

      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center">
          <h3 className="text-sm font-medium">Earth Echoes</h3>
          <div className="relative">
            <button
              ref={infoButtonRef}
              className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <Info className="h-3 w-3" />
            </button>

            {showTooltip &&
              infoButtonRef.current &&
              isMounted &&
              renderTooltip(
                <>
                  <p className="text-xs">
                    Earth Echoes uses environmental science criteria to assess impact severity based on:
                  </p>
                  <ul className="text-xs list-disc pl-4 mt-1">
                    <li>Ecosystem recovery time</li>
                    <li>Geographic scope of impact</li>
                    <li>Effect on biodiversity</li>
                    <li>Threat to protected species</li>
                    <li>Human health implications</li>
                  </ul>
                </>,
                infoButtonRef,
                { top: "above", left: "5" },
                undefined,
              )}
          </div>
        </div>
        <div className="text-xs bg-white px-2 py-1 rounded-full shadow-sm flex items-center">
          <span className="mr-1">👥</span>
          <span>{engagementCount}</span>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between mb-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div key={level} className="relative">
              <div
                ref={(el) => setLevelRef(el, level)}
                className="text-xs text-gray-500 cursor-help"
                onMouseEnter={() => handleLevelTooltipMouseEnter(level)}
                onMouseLeave={() => handleLevelTooltipMouseLeave(level)}
              >
                {level === 1 ? "Minor" : level === 3 ? "Significant" : level === 5 ? "Critical" : ""}
              </div>

              {showLevelTooltips[level] &&
                levelRefs.current[level] &&
                isMounted &&
                renderTooltip(
                  <>
                    <p className="text-xs font-medium">{getSeverityLabel(level)}</p>
                    <p className="text-xs mt-1">{getSeverityDescription(level)}</p>
                  </>,
                  { current: levelRefs.current[level] },
                  { top: "above", left: "center" },
                  level,
                )}
            </div>
          ))}
        </div>
        <Slider
          defaultValue={[userSeverity || initialSeverity]}
          min={1}
          max={5}
          step={1}
          onValueChange={handleSeverityChange}
          className="py-1"
        />
      </div>

      <div className="text-xs text-center text-gray-500 relative z-10">
        {userSeverity
          ? "Your voice has been added to the community assessment"
          : "Slide to share your assessment of this issue's severity"}
      </div>
    </div>
  )
}
