"use client"

import { useAuth } from "@/contexts/auth-context"
import { AuthPage } from "@/components/auth-page"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHome } from "@/components/dashboard-home"

export default function Home() {
  const { isAuthenticated } = useAuth()

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />
  }

  return (
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  )
}
