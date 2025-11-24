"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NulisPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panggon Nulis</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Tempat untuk menulis catatan dan jurnal belajar Anda
          </p>
        </div>

        <Card className="border-teal-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 dark:bg-purple-500/10 rounded-lg">
                <PenTool className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-gray-900 dark:text-[#A8FBD3]">Editor Catatan</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Tulis dan simpan catatan pembelajaran Anda
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="mb-4">Fitur Panggon Nulis akan segera hadir!</p>
                <p className="text-sm mb-6">Anda akan dapat menulis catatan dengan rich text editor</p>
                <Button className="bg-purple-500 hover:bg-purple-600">
                  Mulai Menulis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
