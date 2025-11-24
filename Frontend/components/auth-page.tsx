"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { Button } from "@/components/ui/button"
import { BookOpen, Brain, Target, Zap } from "lucide-react"

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-[#A8FBD3] dark:from-gray-900 dark:to-[#31326F]/20 flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#4FB7B3] dark:bg-teal-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#6379AB] dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#31326F] dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8 text-center lg:text-left px-8">
          <div>
            <h1 className="text-6xl font-bold mb-4 text-[#31326F] dark:text-[#A8FBD3] drop-shadow-sm">
              Panggon Sinau
            </h1>
            <p className="text-xl text-gray-800 dark:text-gray-300 mb-6 font-medium">
              Platform Produktivitas dengan Pomodoro & Game Catur
            </p>
            <p className="text-gray-700 dark:text-gray-400">
              Tingkatkan fokus dan produktivitas Anda dengan metode Pomodoro yang terbukti efektif, 
              dan refresh pikiran dengan game catur saat istirahat.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
              <div className="p-2 bg-[#4FB7B3] rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Fokus Maksimal</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Teknik Pomodoro 25 menit untuk konsentrasi optimal
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
              <div className="p-2 bg-[#6379AB] rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Istirahat Produktif</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Game catur untuk melatih strategi dan logika
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
              <div className="p-2 bg-[#A8FBD3] rounded-lg">
                <BookOpen className="h-6 w-6 text-[#31326F]" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Kelola To-Do List</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Organisir tugas dan pantau progress Anda
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
              <div className="p-2 bg-[#31326F] rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifikasi & Alarm</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pengingat otomatis saat waktu fokus/break selesai
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex flex-col items-center">
          {isLogin ? <LoginForm /> : <RegisterForm />}
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
              {" "}
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#4FB7B3] dark:text-[#A8FBD3] hover:text-[#31326F] dark:hover:text-[#4FB7B3] font-semibold p-0 h-auto"
              >
                {isLogin ? "Daftar Sekarang" : "Login Di Sini"}
              </Button>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Branding */}
      <div className="lg:hidden absolute top-8 left-0 right-0 text-center px-4">
        <h1 className="text-4xl font-bold mb-2 text-[#31326F] dark:text-[#A8FBD3] drop-shadow-sm">
          Panggon Sinau
        </h1>
        <p className="text-sm text-gray-700 dark:text-gray-400 font-medium">
          Platform Produktivitas dengan Pomodoro & Catur
        </p>
      </div>
    </div>
  )
}
