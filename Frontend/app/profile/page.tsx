"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola informasi akun Anda
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4FB7B3] to-[#6379AB] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <CardTitle className="text-2xl text-gray-900 dark:text-[#A8FBD3]">{user?.name}</CardTitle>
                <CardDescription className="dark:text-gray-400 text-base">{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-gray-900 dark:text-gray-200">Nama Lengkap</Label>
                  <Input
                    id="name"
                    defaultValue={user?.name}
                    className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-900 dark:text-gray-200">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email}
                    className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="bg-[#4FB7B3] hover:bg-[#31326F] dark:bg-[#4FB7B3] dark:hover:bg-[#6379AB]">
                  <Settings className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
                <Button variant="outline" className="border-gray-300 dark:border-gray-600">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#4FB7B3]/20 dark:bg-[#4FB7B3]/10 rounded-lg">
                  <User className="h-5 w-5 text-[#4FB7B3]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Free User</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/20 dark:bg-purple-500/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Nov 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/20 dark:bg-green-500/10 rounded-lg">
                  <Mail className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email Status</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Verified</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
