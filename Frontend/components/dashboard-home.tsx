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
  Gamepad2
} from "lucide-react"
import { useTimer } from "@/contexts/timer-context"

export function DashboardHome() {
  const { mode } = useTimer()
  const [showChess, setShowChess] = useState(false)

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <Card className="border-none bg-gradient-to-r from-[#4FB7B3] to-[#6379AB] text-white shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl">Selamat Datang di Panggon Sinau!</CardTitle>
          <CardDescription className="text-white/90 text-base">
            Tingkatkan produktivitas Anda dengan teknik Pomodoro dan refresh pikiran dengan game catur
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Mode Selector */}
      <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Pilih Mode Kerja
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Fokus 25 menit atau Break dengan game catur
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={() => setShowChess(false)}
                className={`${
                  !showChess
                    ? "bg-[#4FB7B3] hover:bg-[#31326F] text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                <Clock className="mr-2 h-5 w-5" />
                Mode Fokus
              </Button>
              <Button
                size="lg"
                onClick={() => setShowChess(true)}
                className={`${
                  showChess
                    ? "bg-[#6379AB] hover:bg-[#31326F] text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
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
            {/* Todo List */}
            <div className="lg:col-span-1">
              <TodoList />
            </div>

            {/* Pomodoro Timer */}
            <div className="lg:col-span-1">
              <PomodoroTimer />
            </div>

            {/* Spotify Player */}
            <div className="lg:col-span-1">
              <SpotifyPlayer />
            </div>
          </div>

          {/* Motivational Quote */}
          <MotivationalQuotes />

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#4FB7B3]/20 dark:bg-[#4FB7B3]/10 rounded-lg">
                    <Clock className="h-6 w-6 text-[#4FB7B3]" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900 dark:text-[#A8FBD3]">Pomodoro Timer</CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Teknik fokus 25 menit
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Tingkatkan produktivitas dengan interval fokus terstruktur. Bekerja 25 menit, istirahat 5 menit.
                </p>
                <Button variant="outline" className="w-full border-teal-200 dark:border-gray-600">
                  Pelajari Lebih Lanjut
                </Button>
              </CardContent>
            </Card>

            <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#6379AB]/20 dark:bg-[#6379AB]/10 rounded-lg">
                    <Gamepad2 className="h-6 w-6 text-[#6379AB]" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900 dark:text-[#A8FBD3]">Game Catur</CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      Refresh pikiran saat break
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Asah strategi dan refresh pikiran dengan bermain catur. Perfect untuk break time yang produktif.
                </p>
                <Button 
                  onClick={() => setShowChess(true)}
                  variant="outline" 
                  className="w-full border-teal-200 dark:border-gray-600"
                >
                  Mulai Bermain
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="bg-[#6379AB] dark:bg-[#6379AB]/90 text-white">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Gamepad2 className="h-6 w-6" />
              Game Catur - Waktu Break
            </CardTitle>
            <CardDescription className="text-blue-100">
              Refresh pikiran Anda dengan bermain catur melawan AI
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-8 dark:bg-gray-800">
            <ChessGame />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
