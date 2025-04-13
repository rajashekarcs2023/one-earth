"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface EnhancedFabProps {
  onboardingComplete?: boolean
}

export default function EnhancedFab({ onboardingComplete = false }: EnhancedFabProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [hasShownInitialTooltip, setHasShownInitialTooltip] = useState(false)
  const router = useRouter()
  const tooltipRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Show tooltip automatically after onboarding (only once)
    if (onboardingComplete && !hasShownInitialTooltip) {
      setTimeout(() => {
        setShowTooltip(true)
        setHasShownInitialTooltip(true)

        // Hide tooltip after 5 seconds
        setTimeout(() => {
          setShowTooltip(false)
        }, 5000)
      }, 1500)
    }

    // Add event listeners for clicks outside the tooltip
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        fabRef.current &&
        !fabRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.addEventListener("mousedown", handleClickOutside)
    }
  }, [onboardingComplete, hasShownInitialTooltip])

  return (
    <div className="relative">
      <Button
        ref={fabRef}
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700 z-10"
        onClick={() => router.push("/report")}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed bottom-36 right-6 bg-white rounded-lg shadow-lg p-3 max-w-[200px] z-10 animate-fade-in"
        >
          <div className="relative">
            <p className="text-sm font-medium text-emerald-800">Speak Up for Earth 🌱</p>
            <div className="absolute -bottom-7 right-6 w-4 h-4 bg-white transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  )
}
