import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import BottomNavigation from "@/components/bottom-navigation"
import { ThemeProvider } from "@/components/theme-provider"
import Onboarding from "@/components/onboarding"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "One Earth",
  description: "Our EARTH, Our Responsibility",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <html lang="en" className="light" style={{ colorScheme: "light" }}>
        <body className={`${inter.className} min-h-screen bg-gray-50`}>
          <Onboarding />
          <main className="container mx-auto max-w-md px-4 pb-20">{children}</main>
          <BottomNavigation />
        </body>
      </html>
    </ThemeProvider>
  )
}


import './globals.css'