"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface DayStats {
  date: Date
  pomodoroCount: number
  tasksCompleted: number
  focusMinutes: number
}

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  // Mock data - nanti bisa diganti dengan data real dari localStorage/database
  const mockStats: DayStats[] = [
    {
      date: new Date(2025, 10, 20),
      pomodoroCount: 5,
      tasksCompleted: 8,
      focusMinutes: 125
    },
    {
      date: new Date(2025, 10, 21),
      pomodoroCount: 4,
      tasksCompleted: 6,
      focusMinutes: 100
    },
    {
      date: new Date(2025, 10, 22),
      pomodoroCount: 6,
      tasksCompleted: 10,
      focusMinutes: 150
    }
  ]

  const getStatsForDate = (date: Date): DayStats | undefined => {
    return mockStats.find(stat => 
      stat.date.toDateString() === date.toDateString()
    )
  }

  const selectedStats = getStatsForDate(selectedDate)

  const getTotalStats = () => {
    return {
      totalPomodoro: mockStats.reduce((sum, stat) => sum + stat.pomodoroCount, 0),
      totalTasks: mockStats.reduce((sum, stat) => sum + stat.tasksCompleted, 0),
      totalMinutes: mockStats.reduce((sum, stat) => sum + stat.focusMinutes, 0)
    }
  }

  const totals = getTotalStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Pantau riwayat produktivitas harian Anda
        </p>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#4FB7B3]/20 dark:bg-[#4FB7B3]/10 rounded-lg">
                <Clock className="h-6 w-6 text-[#4FB7B3]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totals.totalPomodoro}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Pomodoro</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#6379AB]/20 dark:bg-[#6379AB]/10 rounded-lg">
                <Target className="h-6 w-6 text-[#6379AB]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totals.totalTasks}</p>
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.floor(totals.totalMinutes / 60)}h {totals.totalMinutes % 60}m
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Focus Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#4FB7B3]/20 dark:bg-[#4FB7B3]/10 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-[#4FB7B3]" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 dark:text-[#A8FBD3]">
                    Kalender Produktivitas
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Klik tanggal untuk melihat detail
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border border-gray-200 dark:border-gray-700"
              modifiers={{
                productive: mockStats.map(stat => stat.date)
              }}
              modifiersClassNames={{
                productive: "bg-[#4FB7B3]/20 dark:bg-[#4FB7B3]/30 font-bold"
              }}
            />
            
            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#4FB7B3]/20 dark:bg-[#4FB7B3]/30 border border-[#4FB7B3]"></div>
                <span className="text-gray-600 dark:text-gray-400">Hari produktif</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"></div>
                <span className="text-gray-600 dark:text-gray-400">Hari biasa</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Details */}
        <Card className="lg:col-span-1 border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-[#A8FBD3]">
              Detail Harian
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              {selectedDate.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedStats ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#4FB7B3]/10 dark:bg-[#4FB7B3]/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#4FB7B3]" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pomodoro
                      </span>
                    </div>
                    <Badge className="bg-[#4FB7B3] text-white">
                      {selectedStats.pomodoroCount} sesi
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#6379AB]/10 dark:bg-[#6379AB]/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-[#6379AB]" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tasks
                      </span>
                    </div>
                    <Badge className="bg-[#6379AB] text-white">
                      {selectedStats.tasksCompleted} selesai
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-500/10 dark:bg-purple-500/5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Focus Time
                      </span>
                    </div>
                    <Badge className="bg-purple-500 text-white">
                      {selectedStats.focusMinutes} menit
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Produktivitas</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#4FB7B3] to-[#6379AB] h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((selectedStats.pomodoroCount / 8) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round((selectedStats.pomodoroCount / 8) * 100)}% dari target harian (8 pomodoro)
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-gray-400 dark:text-gray-600 opacity-50" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Belum ada aktivitas di hari ini
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Mulai sesi Pomodoro untuk tracking produktivitas
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend */}
      <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-[#A8FBD3]">Tren Mingguan</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Grafik produktivitas 7 hari terakhir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-end justify-between gap-2">
            {mockStats.map((stat, index) => {
              const maxPomodoro = Math.max(...mockStats.map(s => s.pomodoroCount))
              const height = (stat.pomodoroCount / maxPomodoro) * 100
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-[#4FB7B3] to-[#6379AB] rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%`, minHeight: '20px' }}
                  ></div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{stat.pomodoroCount}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.date.toLocaleDateString('id-ID', { weekday: 'short' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
