'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI, setAuthToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran foto maksimal 5MB');
        return;
      }
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok!');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }

    setLoading(true);

    try {
      const registerFormData = new FormData();
      registerFormData.append('name', formData.name);
      registerFormData.append('email', formData.email);
      registerFormData.append('password', formData.password);
      
      if (profilePhoto) {
        registerFormData.append('profilePhoto', profilePhoto);
      }

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: registerFormData,
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Registrasi berhasil! Silakan login dengan akun Anda.');
        router.push('/login');
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message || 'Registrasi gagal. Email mungkin sudah terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('/lofi-boy-landscape-3840x2160-15195.jpg')" }}
      />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10" />

      <div className="bg-white/95 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-purple-200/20">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-purple-500 rounded-full p-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-purple-600 dark:text-purple-400 mb-2">
          Daftar Akun Baru
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Mulai perjalanan produktivitas Anda
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Photo Upload */}
          <div>
            <Label className="text-gray-700 dark:text-gray-200 font-medium">
              Foto Profile (Opsional)
            </Label>
            <div className="mt-2 flex items-center gap-4">
              <div className="relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="h-20 w-20 rounded-full object-cover border-2 border-purple-500"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                  <Upload className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {profilePhoto ? profilePhoto.name : 'Upload Foto'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Max 5MB (JPG, PNG, GIF)
            </p>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-200 font-medium">
              Nama Lengkap
            </Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="pl-10 h-12 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                placeholder="Fatihul Qolbi"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium">
              Email
            </Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-10 h-12 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                placeholder="fatihul@gmail.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-200 font-medium">
              Password
            </Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-10 h-12 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                placeholder="Minimal 6 karakter"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-200 font-medium">
              Konfirmasi Password
            </Label>
            <div className="relative mt-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10 h-12 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                placeholder="Ketik ulang password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-purple-500 hover:bg-purple-600 text-white font-semibold text-lg rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Sudah punya akun?{' '}
          <Link
            href="/login"
            className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 font-semibold hover:underline transition-colors"
          >
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
