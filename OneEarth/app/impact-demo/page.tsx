"use client"

import { Card, CardContent } from "@/components/ui/card"
import EarthImpact from "@/components/earth-impact"

export default function ImpactDemo() {
  return (
    <div className="py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-800">Earth Impact Demo</h1>
        <p className="text-gray-600">A meaningful way to engage with environmental issues</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">About Earth Impact</h2>
          <p className="text-gray-700 mb-3">
            Instead of simple emoji reactions, Earth Impact provides meaningful context about environmental issues and
            allows users to pledge their help in specific areas.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>See the severity and recovery time for each environmental issue</li>
            <li>Understand which specific areas are affected (wildlife, human health, etc.)</li>
            <li>Pledge to help with specific aspects of the problem</li>
            <li>See how many others have pledged to help</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Deforestation Example</h2>
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
                <div className="flex justify-start">
                  <EarthImpact reportId="demo1" reportType="Deforestation" severity={5} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Water Pollution Example</h2>
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
                <div className="flex justify-start">
                  <EarthImpact reportId="demo2" reportType="Water Pollution" severity={4} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
