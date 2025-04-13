"use client"

import { Card, CardContent } from "@/components/ui/card"
import EarthEchoes from "@/components/earth-echoes"

export default function EchoesDemo() {
  return (
    <div className="py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-800">Earth Echoes Demo</h1>
        <p className="text-gray-600">A new way to engage with environmental issues</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">About Earth Echoes</h2>
          <p className="text-gray-700 mb-3">
            Earth Echoes is an innovative way for users to engage with environmental reports. Instead of simple
            reactions, users can indicate their assessment of an issue's severity, creating a collective community
            voice.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Slide to indicate your assessment of the issue's severity</li>
            <li>See the average severity rating from the community</li>
            <li>Watch as your input creates ripples that join with others</li>
            <li>The more people engage, the more "echoes" appear in the visualization</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Try Earth Echoes</h2>
          <Card className="overflow-hidden">
            <div className="relative">
              <img src="/scarred-landscape.png" alt="Deforestation" className="w-full h-48 object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <span className="mr-2 text-xl">🌲</span>
                    <h3 className="font-medium text-lg">Unauthorized tree cutting in protected area</h3>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Several acres of trees have been cut down in this protected forest area."
                </p>
                <EarthEchoes reportId="demo1" initialSeverity={5} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Another Example</h2>
          <Card className="overflow-hidden">
            <div className="relative">
              <img src="/polluted-riverbank.png" alt="Water Pollution" className="w-full h-48 object-cover" />
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <span className="mr-2 text-xl">🧪</span>
                    <h3 className="font-medium text-lg">Chemical discharge into river</h3>
                  </div>
                </div>
                <p className="text-gray-700 italic">"The water has an unusual color and smell. Fish are dying."</p>
                <EarthEchoes reportId="demo2" initialSeverity={3} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
