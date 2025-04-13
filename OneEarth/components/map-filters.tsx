"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface FilterProps {
  onFilterChange: (filters: string[]) => void
}

export default function MapFilters({ onFilterChange }: FilterProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const filters = [
    { id: "Dumping", emoji: "🗑️", label: "Dumping" },
    { id: "Deforestation", emoji: "🌲", label: "Deforestation" },
    { id: "Water Pollution", emoji: "✓", label: "Water Pollution" },
    { id: "Air Pollution", emoji: "🔥", label: "Air Pollution" },
  ]

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) => {
      const newFilters = prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]

      onFilterChange(newFilters)
      return newFilters
    })
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant="outline"
          className={`rounded-full px-4 py-2 h-auto flex items-center ${
            activeFilters.includes(filter.id)
              ? "bg-emerald-50 border-emerald-600 text-emerald-800"
              : "bg-white text-gray-700"
          }`}
          onClick={() => toggleFilter(filter.id)}
        >
          <span className="mr-2">{filter.emoji}</span>
          {filter.label}
        </Button>
      ))}
    </div>
  )
}
