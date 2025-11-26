"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Clock, Target, Flame } from "lucide-react"
import { pomodoroAPI, todosAPI } from "@/lib/api"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

interface DailyStats {
  date: string
  day: string
  pomodoros: number
  tasks: number
  totalMinutes: number
  hasActivity: boolean
}

export default function StatistikPage() {
  const [stats, setStats] = useState({
    totalPomodoros: 0,
    tasksCompleted: 0,
    totalTime: 0,
    streak: 0,
  })
  const [loading, setLoading] = useState(true)
  const [dailyData, setDailyData] = useState<DailyStats[]>([])

  useEffect(() => {
    fetchStats()
  }, [])

  const calculateStreak = (sessions: any[]) => {
    if (!sessions || sessions.length === 0) return 0
    
    // Sort sessions by date (newest first)
    const sortedDates = sessions
      .map(s => new Date(s.completedAt || s.createdAt))
      .sort((a, b) => b.getTime() - a.getTime())
    
    if (sortedDates.length === 0) return 0
    
    let streak = 0
    let currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)
    
    // Check if there's activity today or yesterday
    const lastActivity = new Date(sortedDates[0])
    lastActivity.setHours(0, 0, 0, 0)
    
    const daysDiff = Math.floor((currentDate.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff > 1) return 0 // Streak broken
    
    // Count consecutive days
    const uniqueDates = Array.from(new Set(
      sortedDates.map(d => {
        const date = new Date(d)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      })
    )).sort((a, b) => b - a)
    
    streak = 1
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = (uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24)
      if (diff === 1) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Fetch all pomodoro sessions
      const pomodoroData = await pomodoroAPI.getSessions()
      const sessions = pomodoroData.sessions || []
      
      // Fetch all todos
      const todosData = await todosAPI.getAll()
      const todos = todosData.todos || []
      
      // Calculate total stats
      const focusSessions = sessions.filter((s: any) => s.type === 'focus')
      const completedTodos = todos.filter((t: any) => t.status === 'completed')
      const totalMinutes = focusSessions.reduce((acc: number, s: any) => acc + (s.duration || 0), 0)
      const streak = calculateStreak(sessions)
      
      setStats({
        totalPomodoros: focusSessions.length,
        tasksCompleted: completedTodos.length,
        totalTime: Math.round(totalMinutes / 60 * 10) / 10, // Hours with 1 decimal
        streak: streak,
      })

      // Generate last 7 days data
      const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
      const dailyStats: DailyStats[] = []
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)
        
        const nextDate = new Date(date)
        nextDate.setDate(nextDate.getDate() + 1)
        
        // Count pomodoros for this day
        const dayPomodoros = sessions.filter((s: any) => {
          const sDate = new Date(s.completedAt || s.createdAt)
          return sDate >= date && sDate < nextDate && s.type === 'focus'
        })
        
        // Count completed tasks for this day
        const dayTasks = todos.filter((t: any) => {
          const tDate = new Date(t.updatedAt)
          return tDate >= date && tDate < nextDate && t.status === 'completed'
        })
        
        const totalMinutes = dayPomodoros.reduce((acc: number, s: any) => acc + (s.duration || 0), 0)
        
        dailyStats.push({
          date: date.toISOString().split('T')[0],
          day: days[date.getDay()],
          pomodoros: dayPomodoros.length,
          tasks: dayTasks.length,
          totalMinutes: totalMinutes,
          hasActivity: dayPomodoros.length > 0 || dayTasks.length > 0
        })
      }
      
      setDailyData(dailyStats)
      
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <DashboardLayout>
      {/* Background Video */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.4)" }}
        >
          <source src="/tokyo-rain-reflections.960x540.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-purple-900/50 to-blue-900/60 backdrop-blur-[2px]" />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Riwayat Statistik</h1>
          <p className="text-blue-200 mt-1">
            Pantau progress dan produktivitas Anda
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md border-blue-200/30 dark:border-blue-800/30 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 dark:bg-blue-500/10 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {loading ? "..." : stats.totalPomodoros}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Pomodoro</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md border-green-200/30 dark:border-green-800/30 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 dark:bg-green-500/10 rounded-lg">
                  <Target className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {loading ? "..." : stats.tasksCompleted}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Task Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md border-purple-200/30 dark:border-purple-800/30 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 dark:bg-purple-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {loading ? "..." : `${stats.totalTime}h`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Waktu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md border-orange-200/30 dark:border-orange-800/30 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 dark:bg-orange-500/10 rounded-lg">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {loading ? "..." : stats.streak}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Streak Hari</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Activity Chart */}
        <Card className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md border-blue-200/30 dark:border-blue-800/30 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 dark:bg-blue-500/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-blue-600 dark:text-blue-400">Produktivitas Mingguan</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Pomodoro dan Tasks yang diselesaikan per hari
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.3} />
                  <XAxis dataKey="day" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F1F5F9'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="pomodoros" fill="#3B82F6" name="Pomodoro" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="tasks" fill="#10B981" name="Tasks" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Time Trend */}
          <Card className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md border-purple-200/30 dark:border-purple-800/30 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 dark:bg-purple-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <CardTitle className="text-purple-600 dark:text-purple-400">Trend Waktu Fokus</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Total menit per hari (7 hari terakhir)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.3} />
                    <XAxis dataKey="day" stroke="#64748B" />
                    <YAxis stroke="#64748B" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E293B', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: '#F1F5F9'
                      }}
                      formatter={(value: number) => [`${value} menit`, 'Waktu Fokus']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="totalMinutes" 
                      stroke="#A855F7" 
                      strokeWidth={3}
                      dot={{ fill: '#A855F7', r: 4 }}
                      name="Waktu (menit)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Streak Calendar */}
          <Card className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md border-orange-200/30 dark:border-orange-800/30 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500/20 dark:bg-orange-500/10 rounded-lg">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-orange-600 dark:text-orange-400">Aktivitas Harian</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Hari dengan aktivitas produktif
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {dailyData.map((day, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{day.day}</div>
                        <div 
                          className={`h-16 rounded-lg flex flex-col items-center justify-center transition-all ${
                            day.hasActivity 
                              ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-lg scale-105' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          {day.hasActivity && (
                            <>
                              <Flame className="h-5 w-5 text-white mb-1" />
                              <span className="text-xs font-bold text-white">{day.pomodoros + day.tasks}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Streak saat ini: <span className="font-bold text-orange-600 dark:text-orange-400 text-lg">{stats.streak} hari 🔥</span>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
