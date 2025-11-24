"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Clock, Target } from "lucide-react"

export default function StatistikPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Riwayat Statistik</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Pantau progress dan produktivitas Anda
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#4FB7B3]/20 dark:bg-[#4FB7B3]/10 rounded-lg">
                  <Clock className="h-6 w-6 text-[#4FB7B3]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Pomodoro</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 dark:bg-green-500/10 rounded-lg">
                  <Target className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Task Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 dark:bg-purple-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0h</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Waktu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 dark:bg-orange-500/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Streak Hari</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#4FB7B3]/20 dark:bg-[#4FB7B3]/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-[#4FB7B3]" />
              </div>
              <div>
                <CardTitle className="text-gray-900 dark:text-[#A8FBD3]">Grafik Produktivitas</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Visualisasi performa mingguan dan bulanan
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Fitur Statistik akan segera hadir!</p>
                <p className="text-sm mt-2">Anda akan dapat melihat grafik performa harian, mingguan, dan bulanan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
