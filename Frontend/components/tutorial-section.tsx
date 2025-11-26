"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TutorialSection() {
  const steps = [
    {
      number: "1",
      title: "Pilih Mode Fokus",
      description: "Klik tombol 'Mode Fokus' untuk memulai sesi produktivitas Anda",
      tips: "Siapkan task list sebelum memulai timer",
    },
    {
      number: "2",
      title: "Mulai Pomodoro Timer",
      description: "Tekan tombol play dan fokus bekerja selama 25 menit tanpa gangguan",
      tips: "Matikan notifikasi HP dan media sosial",
    },
    {
      number: "3",
      title: "Nikmati Break Time",
      description: "Setelah 25 menit, beristirahat 5 menit dengan bermain catur",
      tips: "Jangan skip break! Otak butuh refreshment",
    },
    {
      number: "4",
      title: "Ulangi & Capai Target",
      description: "Lakukan 4 siklus Pomodoro, lalu istirahat panjang 15-30 menit",
      tips: "Catat progres harian untuk motivasi",
    },
  ]

  return (
    <section className="py-16 bg-[#A8FBD3]/20 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-[#4FB7B3] text-white mb-4">Cara Menggunakan</Badge>
          <h2 className="text-4xl font-bold text-[#31326F] dark:text-[#A8FBD3] mb-4">
            Mudah dan Simpel!
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Ikuti 4 langkah sederhana untuk meningkatkan produktivitas Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="relative border-teal-200 dark:border-teal-800 hover-lift bg-white dark:bg-slate-900/60 backdrop-blur-sm"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#4FB7B3] dark:bg-[#6379AB] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {step.number}
              </div>
              <CardHeader className="pt-8">
                <CardTitle className="text-xl text-[#31326F] dark:text-[#A8FBD3]">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {step.description}
                </p>
                <div className="bg-teal-50 dark:bg-teal-900/20 border-l-4 border-[#4FB7B3] p-3 rounded">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Tips: </span>
                    {step.tips}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-3xl mx-auto border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-slate-900/60 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-[#31326F] dark:text-[#A8FBD3] mb-4">
                Teknik Pomodoro
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Teknik Pomodoro adalah metode manajemen waktu yang dikembangkan oleh Francesco Cirillo 
                pada akhir 1980-an. Teknik ini menggunakan timer untuk membagi pekerjaan menjadi interval, 
                biasanya 25 menit, dipisahkan oleh istirahat singkat.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Badge variant="secondary" className="bg-[#4FB7B3] text-white">
                  Meningkatkan Fokus
                </Badge>
                <Badge variant="secondary" className="bg-[#6379AB] text-white">
                  Mengurangi Burnout
                </Badge>
                <Badge variant="secondary" className="bg-[#31326F] text-white">
                  Produktivitas Maksimal
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
