"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import VerticalReactions from "@/components/vertical-reactions"
import VerticalReactionsTop from "@/components/vertical-reactions-top"

export default function ReactionDemo() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  return (
    <div className="py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-800">Reaction Bar Demo</h1>
        <p className="text-gray-600">Choose which vertical reaction bar position you prefer</p>
      </div>

      <div className="space-y-8">
        {/* Middle-right option */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Option 1: Middle-Right Position</h2>
          <div className="relative">
            <Card className="overflow-hidden relative">
              <VerticalReactions reportId="demo1" />

              <div className="relative">
                <img src="/roadside-trash.png" alt="Demo report" className="w-full h-48 object-cover" />
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <span className="mr-2 text-xl">🗑️</span>
                      <h3 className="font-medium text-lg">Illegal dumping near water body</h3>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "Large pile of construction waste dumped near the river. It's been here for at least a week."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Button
            onClick={() => setSelectedOption("middle")}
            variant={selectedOption === "middle" ? "default" : "outline"}
            className={selectedOption === "middle" ? "bg-emerald-600" : ""}
          >
            Select Middle-Right Position
          </Button>
        </div>

        {/* Top-right option */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Option 2: Top-Right Position</h2>
          <div className="relative">
            <Card className="overflow-hidden relative">
              <VerticalReactionsTop reportId="demo2" />

              <div className="relative">
                <img src="/industrial-smokestacks.png" alt="Demo report" className="w-full h-48 object-cover" />
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <span className="mr-2 text-xl">🔥</span>
                      <h3 className="font-medium text-lg">Factory emitting excessive smoke</h3>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "This factory has been releasing dark smoke every morning for the past month."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Button
            onClick={() => setSelectedOption("top")}
            variant={selectedOption === "top" ? "default" : "outline"}
            className={selectedOption === "top" ? "bg-emerald-600" : ""}
          >
            Select Top-Right Position
          </Button>
        </div>

        {selectedOption && (
          <div className="bg-emerald-50 p-4 rounded-lg">
            <h3 className="font-medium text-emerald-800">
              Your selection: {selectedOption === "middle" ? "Middle-Right" : "Top-Right"} Position
            </h3>
            <p className="text-sm text-emerald-700 mt-2">
              This position offers a good balance between visibility and aesthetics. The reaction bar is easily
              accessible without interfering with the main content.
            </p>
            <Button
              className="mt-4 bg-emerald-600"
              onClick={() => {
                // In a real app, this would save the preference
                alert(
                  `Your preference for ${selectedOption === "middle" ? "Middle-Right" : "Top-Right"} position has been saved!`,
                )
              }}
            >
              Confirm Selection
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
