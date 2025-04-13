"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, MapPin, Globe, User } from "lucide-react"

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="container mx-auto max-w-md flex justify-around">
        <Link
          href="/feed"
          className={`flex flex-col items-center py-3 px-4 ${
            pathname === "/feed" ? "text-emerald-600" : "text-gray-600"
          }`}
        >
          <Activity size={20} />
          <span className="text-xs mt-1">🌍 Feed</span>
        </Link>
        <Link
          href="/"
          className={`flex flex-col items-center py-3 px-4 ${pathname === "/" ? "text-emerald-600" : "text-gray-600"}`}
        >
          <MapPin size={20} />
          <span className="text-xs mt-1">📷 Report</span>
        </Link>
        <Link
          href="/map"
          className={`flex flex-col items-center py-3 px-4 ${
            pathname === "/map" ? "text-emerald-600" : "text-gray-600"
          }`}
        >
          <Globe size={20} />
          <span className="text-xs mt-1">🗺️ Live Map</span>
        </Link>
        <Link
          href="/my-earth"
          className={`flex flex-col items-center py-3 px-4 ${
            pathname === "/my-earth" ? "text-emerald-600" : "text-gray-600"
          }`}
        >
          <User size={20} />
          <span className="text-xs mt-1">👤 My Earth</span>
        </Link>
      </div>
    </div>
  )
}
