"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Target, Zap, Trophy } from "lucide-react"

export function AboutSection() {
  const features = [
    {
      icon: Brain,
      title: "Tingkatkan Fokus",
      description: "Teknik Pomodoro terbukti meningkatkan konsentrasi dan mengurangi kelelahan mental",
      color: "text-[#31326F] dark:text-[#A8FBD3]",
      bgColor: "bg-[#A8FBD3]/20 dark:bg-[#31326F]/20",
    },
    {
      icon: Target,
      title: "Capai Target",
      description: "Atur waktu kerja dan break dengan efektif untuk mencapai tujuan produktivitas Anda",
      color: "text-[#4FB7B3] dark:text-[#4FB7B3]",
      bgColor: "bg-[#4FB7B3]/20 dark:bg-[#4FB7B3]/10",
    },
    {
      icon: Zap,
      title: "Refresh Pikiran",
      description: "Game catur saat break membantu refresh pikiran dan meningkatkan kreativitas",
      color: "text-[#4FB7B3] dark:text-[#A8FBD3]",
      bgColor: "bg-teal-50 dark:bg-teal-900/20",
    },
    {
      icon: Trophy,
      title: "Produktif & Fun",
      description: "Kombinasi sempurna antara produktivitas dan hiburan yang edukatif",
      color: "text-[#6379AB] dark:text-[#6379AB]",
      bgColor: "bg-[#6379AB]/20 dark:bg-[#6379AB]/10",
    },
  ]

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#31326F] dark:text-[#A8FBD3] mb-4">
            Kenapa Panggon Sinau?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Platform yang menggabungkan produktivitas dengan refreshment untuk hasil kerja yang optimal
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-blue-200 hover-lift cursor-pointer transition-all duration-300"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-3`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl text-blue-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-500 to-sky-500 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">25/5</div>
              <div className="text-blue-100">Menit Fokus/Break</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Gratis Selamanya</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Unlimited</div>
              <div className="text-blue-100">Game Catur Tanpa Batas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
