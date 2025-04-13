"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, Camera, Globe, User, Leaf } from "lucide-react"

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 backdrop-blur-lg bg-opacity-100">
      <div className="container mx-auto max-w-md grid grid-cols-5">
        <Link
          href="/feed"
          className={`flex flex-col items-center justify-center py-3 ${pathname === "/feed" ? "text-emerald-600" : "text-gray-600"}`}
        >
          <Activity size={20} />
          <span className="text-xs mt-1">Feed</span>
        </Link>

        <Link
          href="/map"
          className={`flex flex-col items-center justify-center py-3 ${pathname === "/map" ? "text-emerald-600" : "text-gray-600"}`}
        >
          <Globe size={20} />
          <span className="text-xs mt-1">Map</span>
        </Link>

        {/* Center Report button - now aligned with other icons */}
        <Link
          href="/report"
          className={`flex flex-col items-center justify-center py-3 ${pathname === "/report" ? "text-emerald-600" : "text-gray-600"}`}
        >
          <div className="bg-emerald-600 rounded-full p-2 flex items-center justify-center">
            <Camera size={16} className="text-white" />
          </div>
          <span className="text-xs mt-1">Report</span>
        </Link>

        <Link
          href="/earth-space"
          className={`flex flex-col items-center justify-center py-3 ${
            pathname === "/earth-space" ? "text-emerald-600" : "text-gray-600"
          }`}
        >
          <Leaf size={20} />
          <span className="text-xs mt-1">EarthSpace</span>
        </Link>

        <Link
          href="/my-earth"
          className={`flex flex-col items-center justify-center py-3 ${
            pathname === "/my-earth" ? "text-emerald-600" : "text-gray-600"
          }`}
        >
          <User size={20} />
          <span className="text-xs mt-1">My Earth</span>
        </Link>
      </div>
    </div>
  )
}
