"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const globalSpotlightData = [
  {
    title: "🌐 COP29 Climate Summit",
    subtitle: "Nov 12–24, 2025 · Dubai",
    description:
      "Leaders from 190+ countries gather to discuss climate adaptation goals and global net-zero frameworks.",
    cta: "Learn More",
  },
  {
    title: "🌡️ New IPCC Report Released",
    subtitle: "UN Panel on Climate Risk",
    description:
      "Explore the latest findings on climate thresholds, regional vulnerabilities, and predictions through 2050.",
    cta: "Read Summary",
  },
]

const eventsData = [
  {
    title: "🧹 Beach Cleanup Day",
    subtitle: "Santa Monica · Apr 18, 10 AM",
    description:
      "Join 100+ volunteers for a community-driven beach cleanup effort in partnership with Surfrider Foundation.",
    cta: "Join Event",
  },
  {
    title: "🌳 Tree Planting Sprint",
    subtitle: "Golden Gate Park · Apr 20",
    description: "Help plant 500 native saplings across the park with local ecological groups.",
    cta: "Sign Up",
  },
]

const campaignsData = [
  {
    title: "📦 Disaster Relief for Cyclone Madiha",
    subtitle: "UNICEF + Local NGOs · Ongoing",
    description: "Support food, shelter and clean water efforts for thousands affected by floods in Mozambique.",
    cta: "Donate Now",
  },
  {
    title: "🧑‍🔬 Support Clean Tech Innovators",
    subtitle: "ClimateAction.org · Crowdfunding Goal: $250K",
    description: "Back 10 underfunded renewable energy startups tackling energy poverty in Asia and Africa.",
    cta: "Support Now",
  },
]

const learnTopics = [
  {
    title: "🌾 What is Regenerative Agriculture?",
    subtitle: "Sustainable Farming",
    description: "A system that restores soil and sequesters carbon through natural processes.",
    cta: "Explore",
  },
  {
    title: "💳 Understanding Carbon Credit Scams",
    subtitle: "Climate Finance",
    description: "Learn how some companies greenwash emissions through unverified carbon offsets.",
    cta: "Read More",
  },
  {
    title: "🏙️ Zoning Laws & Climate Resilience",
    subtitle: "Urban Planning",
    description: "How your city's zoning rules impact environmental sustainability and climate adaptation.",
    cta: "Learn More",
  },
]

export default function EarthSpace() {
  const [tab, setTab] = useState("spotlight")

  const renderCard = (item: any, index: number) => (
    <Card key={index} className="p-4 shadow-sm mb-4">
      <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
      <p className="text-sm text-gray-500 mb-1">{item.subtitle}</p>
      <p className="text-sm text-gray-700 mb-3">{item.description}</p>
      <Button variant="outline">{item.cta}</Button>
    </Card>
  )

  return (
    <div className="py-6 space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-800">
          EarthSpace <span className="text-emerald-600">🌿</span>
        </h1>
        <p className="text-gray-600">Stay informed. Stay inspired. Stay involved.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-4 w-full mb-4">
          <TabsTrigger value="spotlight">🌍 Spotlight</TabsTrigger>
          <TabsTrigger value="events">📍 Events</TabsTrigger>
          <TabsTrigger value="campaigns">🤝 Campaigns</TabsTrigger>
          <TabsTrigger value="learn">📚 Learn</TabsTrigger>
        </TabsList>

        <TabsContent value="spotlight">{globalSpotlightData.map(renderCard)}</TabsContent>
        <TabsContent value="events">{eventsData.map(renderCard)}</TabsContent>
        <TabsContent value="campaigns">{campaignsData.map(renderCard)}</TabsContent>
        <TabsContent value="learn">{learnTopics.map(renderCard)}</TabsContent>
      </Tabs>
    </div>
  )
}
