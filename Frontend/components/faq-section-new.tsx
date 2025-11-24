"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"

export function FaqSection() {
  const faqs = [
    {
      question: "Apa itu Panggon Sinau?",
      answer: "Panggon Sinau adalah platform web gratis yang menggabungkan teknik Pomodoro untuk produktivitas dengan game catur sebagai refreshment saat break. Dirancang untuk membantu Anda belajar dan bekerja lebih efektif.",
    },
    {
      question: "Bagaimana cara kerja teknik Pomodoro?",
      answer: "Teknik Pomodoro membagi waktu kerja menjadi interval 25 menit (disebut Pomodoro) dengan break 5 menit di antaranya. Setelah 4 Pomodoro, Anda dapat mengambil break lebih panjang (15-30 menit). Ini membantu meningkatkan fokus dan mengurangi kelelahan mental.",
    },
    {
      question: "Apakah saya harus bermain catur saat break?",
      answer: "Tidak, bermain catur adalah opsional. Anda bisa memilih untuk beristirahat dengan cara lain. Namun, game catur dapat membantu refresh pikiran sambil tetap melatih kemampuan berpikir strategis Anda.",
    },
    {
      question: "Apakah saya bisa mengubah durasi timer?",
      answer: "Saat ini, timer diatur dengan standar Pomodoro: 25 menit fokus dan 5 menit break. Ini adalah durasi yang terbukti paling efektif berdasarkan penelitian.",
    },
    {
      question: "Apakah website ini gratis?",
      answer: "Ya, 100% gratis! Tidak ada biaya tersembunyi, tidak ada iklan yang mengganggu, dan tidak perlu registrasi. Langsung gunakan dan tingkatkan produktivitas Anda.",
    },
    {
      question: "Apakah data saya akan disimpan?",
      answer: "Tidak, semua data hanya tersimpan di browser Anda. Kami tidak menyimpan atau mengumpulkan data pribadi apapun. Privacy Anda adalah prioritas kami.",
    },
    {
      question: "Bagaimana cara mendapatkan notifikasi?",
      answer: "Saat pertama kali menggunakan timer, browser akan meminta izin untuk mengirim notifikasi. Klik 'Allow' untuk menerima notifikasi saat timer selesai. Ini membantu Anda tidak melewatkan waktu break atau fokus.",
    },
    {
      question: "Apakah bisa digunakan di HP?",
      answer: "Ya! Website ini fully responsive dan dapat digunakan di HP, tablet, dan desktop. Tampilan akan menyesuaikan dengan ukuran layar Anda untuk pengalaman terbaik.",
    },
  ]

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#31326F] dark:text-[#A8FBD3] mb-4">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum tentang Panggon Sinau
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-teal-100 dark:border-gray-700">
                <AccordionTrigger className="text-left text-gray-900 dark:text-[#A8FBD3] hover:text-[#4FB7B3] dark:hover:text-[#4FB7B3]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Punya pertanyaan lain? Jangan ragu untuk bertanya!
          </p>
        </div>
      </div>
    </section>
  )
}
