"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Quote } from "lucide-react"

export function MotivationalQuotes() {
  const quotes = [
    {
      text: "Otak manusia yang sedang jatuh cinta cuma dipenuhi dengan masalah yang tidak logis",
      author: "Senku Ishigami",
      anime: "Dr. Stone",
    },
    {
      text: "Lebih mudah menghancurkan mimpi daripada mewujudkannya",
      author: "Gin Ichimaru",
      anime: "Bleach",
    },
    {
      text: "Jika kamu tidak suka takdirmu, jangan terima saja. Lawan balik dan ubahlah!",
      author: "Naruto Uzumaki",
      anime: "Naruto",
    },
    {
      text: "Kesempatan tidak datang dua kali, jangan biarkan dia pergi",
      author: "Monkey D. Luffy",
      anime: "One Piece",
    },
    {
      text: "Kehilangan bukanlah akhir, itu adalah awal dari sesuatu yang baru",
      author: "Edward Elric",
      anime: "Fullmetal Alchemist",
    },
  ]

  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 10000) // Change quote every 10 seconds

    return () => clearInterval(interval)
  }, [quotes.length])

  return (
    <Card className="border-purple-200 dark:border-gray-700 bg-purple-50 dark:bg-gray-800 p-6 shadow-lg">
      <div className="flex gap-4">
        <Quote className="h-8 w-8 text-purple-500 dark:text-purple-400 flex-shrink-0" />
        <div className="flex-1">
          <blockquote className="text-gray-800 dark:text-gray-200 font-medium mb-3 leading-relaxed">
            "{quotes[currentQuote].text}"
          </blockquote>
          <div className="flex justify-between items-center">
            <cite className="text-sm text-purple-700 dark:text-purple-400 not-italic font-semibold">
              — {quotes[currentQuote].author}
            </cite>
            <span className="text-xs text-purple-500 dark:text-purple-400">
              {quotes[currentQuote].anime}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-1 mt-4 justify-center">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuote(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentQuote
                ? "w-8 bg-purple-500 dark:bg-purple-400"
                : "w-1.5 bg-purple-200 dark:bg-gray-600 hover:bg-purple-300 dark:hover:bg-gray-500"
            }`}
            aria-label={`Go to quote ${index + 1}`}
          />
        ))}
      </div>
    </Card>
  )
}
