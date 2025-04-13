"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

interface Reaction {
  emoji: string
  label: string
  count: number
  selected?: boolean
}

interface VerticalReactionsProps {
  reportId: string
  initialReactions?: Reaction[]
}

export default function VerticalReactions({ reportId, initialReactions }: VerticalReactionsProps) {
  // Default reactions if none provided
  const defaultReactions: Reaction[] = [
    { emoji: "💚", label: "Care", count: Math.floor(Math.random() * 15) },
    { emoji: "😡", label: "Angry", count: Math.floor(Math.random() * 10) },
    { emoji: "😢", label: "Sad", count: Math.floor(Math.random() * 8) },
    { emoji: "👏", label: "Thanks", count: Math.floor(Math.random() * 12) },
    { emoji: "💪", label: "Support", count: Math.floor(Math.random() * 9) },
  ]

  const [reactions, setReactions] = useState<Reaction[]>(initialReactions || defaultReactions)
  const [isExpanded, setIsExpanded] = useState(false)
  const { toast } = useToast()

  const handleReaction = (index: number) => {
    const newReactions = [...reactions]

    // If already selected, deselect it
    if (newReactions[index].selected) {
      newReactions[index].selected = false
      newReactions[index].count -= 1
    } else {
      // Deselect any previously selected reaction
      newReactions.forEach((reaction, i) => {
        if (reaction.selected && i !== index) {
          reaction.selected = false
          reaction.count -= 1
        }
      })

      // Select the new reaction
      newReactions[index].selected = true
      newReactions[index].count += 1
    }

    setReactions(newReactions)

    // Show toast for the reaction
    if (newReactions[index].selected) {
      toast({
        title: `You reacted with ${newReactions[index].emoji}`,
        description: `Your reaction has been added to this report.`,
        duration: 2000,
      })
    }
  }

  return (
    <div className="absolute -right-3 top-1/3 transform -translate-y-1/2 z-10">
      <div className="bg-white rounded-full shadow-md p-1.5 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="text-lg">{isExpanded ? "×" : "💭"}</div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex flex-col gap-2"
          >
            {reactions.map((reaction, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative bg-white rounded-full shadow-md p-1.5 cursor-pointer ${
                  reaction.selected ? "ring-2 ring-emerald-500" : ""
                }`}
                onClick={() => handleReaction(index)}
              >
                <div className="text-lg">{reaction.emoji}</div>
                {reaction.count > 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-gray-100 text-gray-700 text-xs rounded-full px-1 min-w-[18px] text-center">
                    {reaction.count}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
