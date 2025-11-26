"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PomodoroTimer } from "./pomodoro-timer"
import { TodoList } from "./todo-list"
import { SpotifyPlayer } from "./spotify-player"
import { MotivationalQuotes } from "./motivational-quotes"
import ChessGame from "./chess-game"
import { 
  Clock, 
  CheckCircle2,
  Gamepad2
} from "lucide-react"
import { useTimer } from "@/contexts/timer-context"

export function DashboardHome() {
  const { mode } = useTimer()
  const [showChess, setShowChess] = useState(false)

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('/lofi-bedroom-night-3840x2160-15300.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Content with spacing */}
      <div className="space-y-6 relative z-10">
      {/* Welcome Hero */}
      <Card className="border-none bg-purple-600 text-white shadow-2xl backdrop-blur-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl">Selamat Datang di Panggon Sinau!</CardTitle>
          <CardDescription className="text-white/90 text-base">
            Tingkatkan produktivitas Anda dengan teknik Pomodoro dan refresh pikiran dengan game catur
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Mode Selector */}
      <Card className="border-purple-300/30 dark:border-purple-700/30 bg-white/90 dark:bg-slate-900/70 backdrop-blur-md shadow-xl">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Pilih Mode Kerja
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Fokus 25 menit atau Break dengan game catur
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={() => setShowChess(false)}
                className={`transition-all duration-300 ${
                  !showChess
                    ? "bg-purple-500 hover:bg-purple-600 text-white shadow-lg scale-105"
                    : "bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-300/80 dark:hover:bg-gray-600/80"
                }`}
              >
                <Clock className="mr-2 h-5 w-5" />
                Mode Fokus
              </Button>
              <Button
                size="lg"
                onClick={() => setShowChess(true)}
                className={`transition-all duration-300 ${
                  showChess
                    ? "bg-pink-500 hover:bg-pink-600 text-white shadow-lg scale-105"
                    : "bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-300/80 dark:hover:bg-gray-600/80"
                }`}
              >
                <Gamepad2 className="mr-2 h-5 w-5" />
                Mode Break
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      {!showChess ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <TodoList />
            </div>
            <div>
              <PomodoroTimer />
            </div>
            <div>
              <SpotifyPlayer />
            </div>
          </div>

          {/* Motivational Quote */}
          <MotivationalQuotes />

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-purple-300/30 dark:border-purple-700/30 bg-white/90 dark:bg-slate-900/70 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Pomodoro Timer</CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Teknik fokus 25 menit
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-200 mb-4">
                  Tingkatkan produktivitas dengan interval fokus terstruktur. Bekerja 25 menit, istirahat 5 menit.
                </p>
                <Button variant="outline" className="w-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                  Pelajari Lebih Lanjut
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-300/30 dark:border-purple-700/30 bg-white/90 dark:bg-slate-900/70 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <CheckCircle2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900 dark:text-white">Game Catur</CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Refresh pikiran saat break
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-200 mb-4">
                  Asah strategi dan refresh pikiran dengan bermain catur. Perfect untuk break time yang produktif.
                </p>
                <Button 
                  onClick={() => setShowChess(true)}
                  variant="outline" 
                  className="w-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                >
                  Mulai Bermain
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="border-purple-300/30 dark:border-purple-700/30 bg-white/90 dark:bg-slate-900/70 backdrop-blur-md shadow-2xl">
          <CardHeader className="bg-purple-600 text-white">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Gamepad2 className="h-6 w-6" />
              Game Catur - Waktu Break
            </CardTitle>
            <CardDescription className="text-purple-100">
              Refresh pikiran Anda dengan bermain catur melawan AI
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-8">
            <ChessGame />
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  )
}
