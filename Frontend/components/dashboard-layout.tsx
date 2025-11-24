"use client"

import { ReactNode } from "react"
import { HorizontalNav } from "./horizontal-nav"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#A8FBD3]/10 dark:bg-gray-950">
      <HorizontalNav />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
