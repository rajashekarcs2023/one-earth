import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import BottomNavigation from "@/components/bottom-navigation"
import { ThemeProvider } from "@/components/theme-provider"

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
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <main className="container mx-auto max-w-md px-4 pb-20">{children}</main>
          <BottomNavigation />
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'