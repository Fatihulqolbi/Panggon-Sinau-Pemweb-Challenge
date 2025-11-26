"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, LogIn } from "lucide-react"

export function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const success = await login(email, password)
    
    if (!success) {
      setError("Email atau password salah!")
    }
    
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md bg-white/95 dark:bg-slate-900/80 backdrop-blur-md border-teal-200 dark:border-teal-800 shadow-2xl">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto w-16 h-16 bg-[#4FB7B3] rounded-full flex items-center justify-center mb-2">
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold text-[#31326F] dark:text-[#A8FBD3]">
          Selamat Datang Kembali!
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Login untuk melanjutkan ke Panggon Sinau
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="nama@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#4FB7B3] hover:bg-[#31326F] text-white font-semibold py-6 text-lg transition-colors"
            disabled={loading}
          >
            {loading ? "Loading..." : "Masuk"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
