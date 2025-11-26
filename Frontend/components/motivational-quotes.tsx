"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Quote, Plus, Trash2, Upload, ChevronLeft, ChevronRight, Edit, Loader2 } from "lucide-react"

interface QuoteType {
  _id: string
  text: string
  author: string
  photo?: {
    contentType: string
  }
  createdAt: string
}

function QuoteImage({ quoteId }: { quoteId: string }) {
  const [imageSrc, setImageSrc] = useState<string>("")

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${quoteId}/photo`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.ok) {
          const blob = await response.blob()
          const url = URL.createObjectURL(blob)
          setImageSrc(url)
        }
      } catch (error) {
        console.error("Failed to load image:", error)
      }
    }

    fetchImage()

    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc)
      }
    }
  }, [quoteId])

  if (!imageSrc) {
    return (
      <div className="w-full aspect-[3/4] max-h-[400px] rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800 flex items-center justify-center">
        <Quote className="h-24 w-24 text-white/30" />
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-[3/4] max-h-[400px] rounded-lg overflow-hidden shadow-xl bg-white dark:bg-slate-900/60 group transition-transform duration-300 hover:scale-105">
      <img
        src={imageSrc}
        alt="Quote"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}

export function MotivationalQuotes() {
  const [quotes, setQuotes] = useState<QuoteType[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuote, setEditingQuote] = useState<QuoteType | null>(null)
  const [formData, setFormData] = useState({
    text: "",
    author: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    fetchQuotes()
  }, [])

  useEffect(() => {
    // Auto-rotate quotes every 10 seconds
    if (quotes.length > 0) {
      const interval = setInterval(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % quotes.length)
          setIsTransitioning(false)
        }, 300)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [quotes.length])

  const fetchQuotes = async () => {
    try {
      const token = localStorage.getItem("token")
      
      if (!token) {
        window.location.href = '/login'
        return
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Token expired, redirecting to login')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
          return
        }
        throw new Error("Failed to fetch quotes")
      }

      const data = await response.json()
      setQuotes(data.quotes || [])
    } catch (error) {
      console.error("Failed to fetch quotes:", error)
      setQuotes([])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      const formDataToSend = new FormData()
      
      formDataToSend.append("text", formData.text)
      formDataToSend.append("author", formData.author)
      
      if (selectedFile) {
        formDataToSend.append("photo", selectedFile)
      }

      const url = editingQuote 
        ? `${process.env.NEXT_PUBLIC_API_URL}/quotes/${editingQuote._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/quotes`

      const response = await fetch(url, {
        method: editingQuote ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (!response.ok) {
        throw new Error("Failed to save quote")
      }

      // Reset form
      setFormData({ text: "", author: "" })
      setSelectedFile(null)
      setPreviewUrl("")
      setEditingQuote(null)
      setIsDialogOpen(false)
      
      // Refresh quotes
      fetchQuotes()
    } catch (error) {
      console.error("Failed to save quote:", error)
      alert("Gagal menyimpan quote. Silakan coba lagi.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus quote ini?")) return

    try {
      const token = localStorage.getItem("token")
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to delete quote")
      }

      fetchQuotes()
      if (currentIndex >= quotes.length - 1) {
        setCurrentIndex(0)
      }
    } catch (error) {
      console.error("Failed to delete quote:", error)
      alert("Gagal menghapus quote. Silakan coba lagi.")
    }
  }

  const handleEdit = (quote: QuoteType) => {
    setEditingQuote(quote)
    setFormData({
      text: quote.text,
      author: quote.author
    })
    
    // Set preview URL to existing photo if available
    if (quote.photo) {
      const token = localStorage.getItem("token")
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${quote._id}/photo`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob)
          setPreviewUrl(url)
        })
        .catch(err => console.error("Failed to load existing photo:", err))
    }
    
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingQuote(null)
    setFormData({ text: "", author: "" })
    setSelectedFile(null)
    setPreviewUrl("")
  }

  // If no quotes, show add button
  if (quotes.length === 0) {
    return (
      <Card className="border-purple-200 dark:border-purple-700/50 bg-purple-50 dark:bg-slate-900/60 p-6 animate-fadeIn backdrop-blur-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 group">
            <Quote className="h-6 w-6 text-purple-500 dark:text-purple-400 animate-bounce" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quote Motivasi</h3>
          </div>
          <Button 
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah Quote Pertama
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tambah Quote Motivasi</DialogTitle>
                <DialogDescription>
                  Tambahkan quote inspiratif dengan foto untuk memotivasi diri
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="text">Quote / Kutipan</Label>
                  <Textarea
                    id="text"
                    placeholder="Masukkan quote inspiratif..."
                    value={formData.text}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, text: e.target.value })}
                    required
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="author">Penulis / Sumber</Label>
                  <Input
                    id="author"
                    placeholder="Nama penulis atau sumber quote"
                    value={formData.author}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, author: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="photo">Foto (Opsional)</Label>
                  <div className="mt-2">
                    <label
                      htmlFor="photo"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                    >
                      {previewUrl ? (
                        <div className="relative w-full h-full">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Klik untuk upload foto
                          </p>
                        </div>
                      )}
                    </label>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Batal
                  </Button>
                  <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                    {editingQuote ? "Update Quote" : "Simpan Quote"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    )
  }

  const currentQuote = quotes[currentIndex]

  return (
    <Card className="border-purple-200 dark:border-purple-700/50 bg-purple-50 dark:bg-slate-900/60 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 group">
          <Quote className="h-6 w-6 text-purple-500 dark:text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quote Motivasi</h3>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white hover:scale-105 transition-all duration-300 hover:shadow-lg"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah Quote Pertama
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingQuote ? "Edit Quote Motivasi" : "Tambah Quote Motivasi"}</DialogTitle>
                <DialogDescription>
                  {editingQuote ? "Ubah quote inspiratif" : "Tambahkan quote inspiratif dengan foto untuk memotivasi diri"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="text">Quote / Kutipan</Label>
                  <Textarea
                    id="text"
                    placeholder="Masukkan quote inspiratif..."
                    value={formData.text}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, text: e.target.value })}
                    required
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="author">Penulis / Sumber</Label>
                  <Input
                    id="author"
                    placeholder="Nama penulis atau sumber quote"
                    value={formData.author}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, author: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="photo">Foto (Opsional)</Label>
                  <div className="mt-2">
                    <label
                      htmlFor="photo"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
                    >
                      {previewUrl ? (
                        <div className="relative w-full h-full">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Klik untuk upload foto
                          </p>
                        </div>
                      )}
                    </label>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      setFormData({ text: "", author: "" })
                      setSelectedFile(null)
                      setPreviewUrl("")
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
                    Simpan Quote
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(currentQuote._id)}
            className="border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Layout: Quote Kiri, Foto Kanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Quote Text - Kiri */}
        <div className={`order-2 md:order-1 transition-all duration-500 ${
          isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}>
          <div className="relative">
            <Quote className="h-12 w-12 text-purple-200 dark:text-purple-800 absolute -top-6 -left-4 animate-pulse" />
            <blockquote className="text-gray-800 dark:text-gray-200 font-medium text-lg mb-4 leading-relaxed relative z-10">
              "{currentQuote.text}"
            </blockquote>
          </div>
          <cite className="text-purple-700 dark:text-purple-400 not-italic font-semibold flex items-center gap-2">
            <div className="h-1 w-8 bg-purple-500 rounded-full"></div>
            {currentQuote.author}
          </cite>
        </div>

        {/* Photo - Kanan */}
        <div className={`order-1 md:order-2 transition-all duration-500 ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}>
          {currentQuote.photo ? (
            <QuoteImage quoteId={currentQuote._id} />
          ) : (
            <div className="w-full aspect-[3/4] max-h-[400px] rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800 flex items-center justify-center">
              <Quote className="h-24 w-24 text-white/30" />
            </div>
          )}
        </div>
      </div>

      {/* Edit and Delete buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleEdit(currentQuote)}
          className="border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900 group transition-all duration-300 hover:scale-105"
        >
          <Edit className="h-4 w-4 mr-1 group-hover:rotate-12 transition-transform" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleDelete(currentQuote._id)}
          className="border-red-300 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900 text-red-600 dark:text-red-400 group transition-all duration-300 hover:scale-105"
        >
          <Trash2 className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
          Hapus
        </Button>
      </div>

      {/* Navigation Dots */}
      {quotes.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length)
                setIsTransitioning(false)
              }, 300)
            }}
            className="h-8 w-8 p-0 group hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          </Button>

          <div className="flex gap-1">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsTransitioning(true)
                  setTimeout(() => {
                    setCurrentIndex(index)
                    setIsTransitioning(false)
                  }, 300)
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-purple-500 w-8"
                    : "bg-gray-300 dark:bg-gray-600 w-1.5 hover:bg-purple-300 hover:w-4"
                }`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % quotes.length)
                setIsTransitioning(false)
              }, 300)
            }}
            className="h-8 w-8 p-0 group hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all"
          >
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </Card>
  )
}
