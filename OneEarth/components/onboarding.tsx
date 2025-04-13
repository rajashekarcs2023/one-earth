"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const router = useRouter()

  const steps = [
    {
      title: "Our Earth Needs You",
      subtitle: "Welcome to One Earth 🌍",
      description: "Join a global community of Earth guardians protecting what we all share.",
      image: "/blue-green-earth.png",
      ctaText: "I'm Ready to Help",
      bgColor: "from-blue-900 to-emerald-800",
    },
    {
      title: "Be the Voice of Nature",
      subtitle: "See. Report. Inspire Change.",
      description: "Every report you make helps heal a wound on our planet. Your actions create ripples of change.",
      image: "/documenting-deforestation.png",
      icons: [
        { icon: "🗑️", label: "Dumping" },
        { icon: "🌲", label: "Deforestation" },
        { icon: "🌫️", label: "Air Pollution" },
        { icon: "🌊", label: "Water Pollution" },
      ],
      bgColor: "from-emerald-800 to-emerald-600",
    },
    {
      title: "Together We're Stronger",
      subtitle: "Verify. Connect. Protect.",
      description: "When you verify others' reports, you amplify their voice. Together, we create a powerful movement.",
      image: "/community-cleanup.png",
      checks: ["Verify issues you witness", "Connect with local guardians", "Track the healing of our Earth"],
      bgColor: "from-emerald-600 to-yellow-600",
    },
    {
      title: "The Earth is Waiting",
      subtitle: "Your Journey Begins Now",
      description: "Thousands are already watching over our home. Every action matters. Every voice counts.",
      image: "/mountain-forest-sunrise.png",
      ctaText: "Begin My Earth Journey",
      bgColor: "from-yellow-600 to-orange-600",
    },
  ]

  useEffect(() => {
    // Check if user has completed onboarding
    const hasOnboarded = localStorage.getItem("hasOnboarded")
    if (!hasOnboarded) {
      setShowOnboarding(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const completeOnboarding = () => {
    localStorage.setItem("hasOnboarded", "true")
    setShowOnboarding(false)
    router.push("/feed")
  }

  const handleSkip = () => {
    completeOnboarding()
  }

  if (!showOnboarding) {
    return null
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* Background with gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${currentStepData.bgColor} transition-all duration-700`} />

      {/* Skip button */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" size="sm" onClick={handleSkip} className="h-8 w-8 p-0 rounded-full text-white">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress indicators */}
      <div className="relative z-10 flex justify-center mt-4">
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 w-8 rounded-full transition-all duration-300 ${
                index === currentStep ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <Card className="bg-white/10 backdrop-blur-md border-none shadow-xl overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              <img
                src={currentStepData.image || "/placeholder.svg"}
                alt={currentStepData.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <p className="text-sm font-medium opacity-80">{currentStepData.subtitle}</p>
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
              </div>
            </div>
            <CardContent className="p-6 text-white bg-black/30 backdrop-blur-sm">
              <p className="mb-6 text-white/90">{currentStepData.description}</p>

              {currentStepData.icons && (
                <div className="flex justify-between items-center mb-6 bg-white/10 rounded-lg p-3">
                  {currentStepData.icons.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-xs text-white/80">{item.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {currentStepData.checks && (
                <div className="space-y-2 mb-6 bg-white/10 rounded-lg p-3">
                  {currentStepData.checks.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="mr-2 text-emerald-300">✓</div>
                      <div className="text-sm text-white/90">{item}</div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={handleNext}
                className="w-full bg-white text-emerald-800 hover:bg-white/90 transition-all duration-300 py-6 h-auto rounded-full"
              >
                {currentStepData.ctaText || "Continue My Journey"}
                {!currentStepData.ctaText && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
