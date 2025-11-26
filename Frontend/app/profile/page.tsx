"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Calendar, Settings, Upload } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { getAuthToken } from "@/lib/api"

export default function ProfilePage() {
  const { user: authUser } = useAuth()
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setUserData(data.user)
        setFormData({
          name: data.user.name,
          email: data.user.email
        })
        
        // Load profile photo if exists
        if (data.user._id) {
          setPhotoPreview(`http://localhost:5000/api/auth/profile-photo/${data.user._id}`)
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran foto maksimal 5MB')
        return
      }
      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = getAuthToken()
      const updateFormData = new FormData()
      updateFormData.append('name', formData.name)
      updateFormData.append('email', formData.email)
      
      if (profilePhoto) {
        updateFormData.append('profilePhoto', profilePhoto)
      }

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: updateFormData
      })

      const data = await response.json()
      if (data.success) {
        alert('Profile berhasil diupdate!')
        fetchUserData()
        setProfilePhoto(null)
      } else {
        alert('Gagal update profile')
      }
    } catch (error) {
      console.error('Update error:', error)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const memberSince = userData?.createdAt 
    ? new Date(userData.createdAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
    : 'Nov 2025'

  return (
    <DashboardLayout>
      {/* Background Image */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/anime-style-clouds.jpg')",
            filter: "brightness(0.5)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900/60 via-indigo-900/50 to-sky-900/60 backdrop-blur-[2px]" />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Profile</h1>
          <p className="text-sky-200 mt-1">
            Kelola informasi akun Anda
          </p>
        </div>

        {/* Profile Card */}
        <Card className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md border-sky-200/30 dark:border-sky-800/30 shadow-xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-sky-500 shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const fallback = document.getElementById('fallback-avatar');
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    id="fallback-avatar"
                    className={`w-24 h-24 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg ${photoPreview ? 'hidden' : 'flex'}`}
                  >
                    {formData.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                    <Upload className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-sky-600 dark:text-sky-400">{formData.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{formData.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Member sejak {memberSince}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-semibold">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 border-sky-200 dark:border-sky-800 focus:border-sky-500 focus:ring-sky-500 bg-white/80 dark:bg-gray-800/80"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-semibold">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 border-sky-200 dark:border-sky-800 focus:border-sky-500 focus:ring-sky-500 bg-white/80 dark:bg-gray-800/80"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-sky-500 hover:bg-sky-600 text-white"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setFormData({
                      name: userData?.name || '',
                      email: userData?.email || ''
                    })
                    setProfilePhoto(null)
                    if (userData?._id) {
                      setPhotoPreview(`http://localhost:5000/api/auth/profile-photo/${userData._id}`)
                    }
                  }}
                  className="border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md border-sky-200/30 dark:border-sky-800/30 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-500/20 dark:bg-sky-500/10 rounded-lg">
                  <User className="h-5 w-5 text-sky-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Free User</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md border-indigo-200/30 dark:border-indigo-800/30 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{memberSince}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md border-green-200/30 dark:border-green-800/30 shadow-xl">
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
