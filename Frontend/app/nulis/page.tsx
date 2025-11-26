"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import { Plus, Save, Trash2, Edit, X, BookOpen, Clock, Image as ImageIcon, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { notesAPI, Note, getAuthToken } from "@/lib/api"

const CATEGORIES = [
  { value: "Study", label: "Study", color: "bg-blue-500" },
  { value: "Work", label: "Work", color: "bg-green-500" },
  { value: "Personal", label: "Personal", color: "bg-purple-500" },
  { value: "Ideas", label: "Ideas", color: "bg-yellow-500" },
  { value: "Other", label: "Other", color: "bg-gray-500" },
] as const;

// Component to load image with authentication
function NoteImage({ noteId, imageIndex, alt, className, onClick }: { 
  noteId: string; 
  imageIndex: number; 
  alt: string; 
  className?: string;
  onClick?: () => void;
}) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch(
          `http://localhost:5000/api/notes/${noteId}/images/${imageIndex}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load image');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
        setLoading(false);
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
        setLoading(false);
      }
    };

    loadImage();

    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [noteId, imageIndex]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-200 dark:bg-gray-700`}>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-200 dark:bg-gray-700`}>
        <ImageIcon className="h-12 w-12 text-gray-400" />
      </div>
    );
  }

  return <img src={imageSrc} alt={alt} className={className} onClick={onClick} />;
}

export default function NulisPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])

  // Form state
  const [formData, setFormData] = useState<Partial<Note>>({
    title: "",
    subtitle: "",
    content: "",
    category: "Other",
  })

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const response = await notesAPI.getAll()
      if (response.success) {
        setNotes(response.notes)
      }
    } catch (error) {
      console.error("Error fetching notes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async () => {
    try {
      const response = await notesAPI.create(formData, selectedImages)
      if (response.success) {
        await fetchNotes()
        setShowEditor(false)
        resetForm()
      }
    } catch (error: any) {
      console.error("Error creating note:", error)
      alert(`Failed to create note: ${error.message || 'Unknown error'}`)
    }
  }

  const handleUpdateNote = async () => {
    if (!selectedNote) return
    try {
      const response = await notesAPI.update(selectedNote._id!, formData, selectedImages, true)
      if (response.success) {
        await fetchNotes()
        setShowEditor(false)
        setIsEditing(false)
        setSelectedNote(null)
        resetForm()
      }
    } catch (error: any) {
      console.error("Error updating note:", error)
      alert(`Failed to update note: ${error.message || 'Unknown error'}`)
    }
  }

  const handleDeleteNote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return
    try {
      const response = await notesAPI.delete(id)
      if (response.success) {
        await fetchNotes()
        setSelectedNote(null)
      }
    } catch (error) {
      console.error("Error deleting note:", error)
      alert("Failed to delete note")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      content: "",
      category: "Other",
    })
    setSelectedImages([])
    setImagePreview([])
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 5 images
    const newFiles = files.slice(0, 5 - selectedImages.length)
    setSelectedImages([...selectedImages, ...newFiles])

    // Create preview URLs
    const previews = newFiles.map(file => URL.createObjectURL(file))
    setImagePreview([...imagePreview, ...previews])
  }

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreview.filter((_, i) => i !== index)
    setSelectedImages(newImages)
    setImagePreview(newPreviews)
  }

  const openCreateEditor = () => {
    resetForm()
    setIsEditing(false)
    setShowEditor(true)
  }

  const openEditEditor = (note: Note) => {
    setSelectedNote(note)
    setFormData({
      title: note.title,
      subtitle: note.subtitle || "",
      content: note.content,
      category: note.category,
    })
    setIsEditing(true)
    setShowEditor(true)
  }

  const openNoteDetail = (note: Note) => {
    setSelectedNote(note)
  }

  const getCategoryColor = (category: string) => {
    return CATEGORIES.find((c) => c.value === category)?.color || "bg-gray-500"
  }

  const getCategoryLabel = (category: string) => {
    return CATEGORIES.find((c) => c.value === category)?.label || "📝 Other"
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <DashboardLayout>
      {/* Background Video */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.5)" }}
        >
          <source src="/cozy-room.960x540.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/60 via-orange-800/50 to-orange-900/60 backdrop-blur-[2px]" />
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Panggon Nulis</h1>
            <p className="text-orange-200 mt-1">Write your thoughts and ideas</p>
          </div>
          <Button
            onClick={openCreateEditor}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        {/* Notes Grid */}
        {!selectedNote && !showEditor && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                <p className="text-white mt-4">Loading notes...</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-16 w-16 text-orange-300/50 mx-auto mb-4" />
                <p className="text-white text-lg">No notes yet. Start writing!</p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note._id}
                  onClick={() => openNoteDetail(note)}
                  className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md rounded-xl p-6 border-2 border-orange-200/30 dark:border-orange-800/30 hover:border-orange-500 cursor-pointer transition-all hover:scale-105 shadow-xl group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(note.category)}`}>
                      {getCategoryLabel(note.category)}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditEditor(note)
                        }}
                        className="p-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteNote(note._id)
                        }}
                        className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-2 line-clamp-2">
                    {note.title}
                  </h3>
                  {note.subtitle && (
                    <p className="text-sm text-orange-500 dark:text-orange-300 mb-3 line-clamp-1">
                      {note.subtitle}
                    </p>
                  )}
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                    {note.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    {note.updatedAt && formatDate(note.updatedAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Note Detail View */}
        {selectedNote && !showEditor && (
          <div className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md rounded-xl shadow-2xl border border-orange-200/20 overflow-hidden">
            <div className="p-8 md:p-12 max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${getCategoryColor(selectedNote.category)}`}>
                  {getCategoryLabel(selectedNote.category)}
                </span>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-orange-600 dark:text-orange-400 mb-4">
                {selectedNote.title}
              </h1>

              {selectedNote.subtitle && (
                <h2 className="text-xl md:text-2xl text-orange-500 dark:text-orange-300 mb-6">
                  {selectedNote.subtitle}
                </h2>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {selectedNote.updatedAt && `Updated ${formatDate(selectedNote.updatedAt)}`}
                </div>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedNote.content}
                </p>

                {/* Display Images */}
                {selectedNote.images && selectedNote.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    {selectedNote.images.map((_, index) => (
                      <div key={index} className="relative group">
                        <NoteImage
                          noteId={selectedNote._id!}
                          imageIndex={index}
                          alt={`Documentation ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg border-2 border-orange-200 dark:border-orange-800 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            // Open in new tab using blob URL
                            const token = getAuthToken();
                            fetch(`http://localhost:5000/api/notes/${selectedNote._id}/images/${index}`, {
                              headers: { 'Authorization': `Bearer ${token}` }
                            })
                            .then(res => res.blob())
                            .then(blob => {
                              const url = URL.createObjectURL(blob);
                              window.open(url, '_blank');
                            });
                          }}
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                          <ImageIcon className="h-3 w-3 inline mr-1" />
                          {index + 1} of {selectedNote.images.length}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => openEditEditor(selectedNote)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Note
                </Button>
                <Button
                  onClick={() => handleDeleteNote(selectedNote._id)}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Note
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Editor View */}
        {showEditor && (
          <div className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md rounded-xl shadow-2xl border border-orange-200/20 overflow-hidden">
            <div className="p-8 md:p-12 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {isEditing ? "Edit Note" : "Create New Note"}
                </h2>
                <button
                  onClick={() => {
                    setShowEditor(false)
                    setIsEditing(false)
                    setSelectedNote(null)
                    resetForm()
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <Label className="text-gray-700 dark:text-gray-200 font-semibold">Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full mt-2 px-4 py-3 border-2 border-orange-200 dark:border-orange-800 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-orange-500 transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <Label className="text-gray-700 dark:text-gray-200 font-semibold">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter your note title..."
                    className="mt-2 text-2xl font-bold border-2 border-orange-200 dark:border-orange-800 focus:border-orange-500 focus:ring-orange-500 bg-white/80 dark:bg-gray-800/80 h-14"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <Label className="text-gray-700 dark:text-gray-200 font-semibold">Subtitle (Optional)</Label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Add a subtitle or summary..."
                    className="mt-2 text-lg border-2 border-orange-200 dark:border-orange-800 focus:border-orange-500 focus:ring-orange-500 bg-white/80 dark:bg-gray-800/80 h-12"
                  />
                </div>

                {/* Content */}
                <div>
                  <Label className="text-gray-700 dark:text-gray-200 font-semibold">Content</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Start writing your content..."
                    rows={16}
                    className="mt-2 border-2 border-orange-200 dark:border-orange-800 focus:border-orange-500 focus:ring-orange-500 bg-white/80 dark:bg-gray-800/80 text-base leading-relaxed resize-none"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {formData.content.length} characters
                  </p>
                </div>

                {/* Image Upload (Optional) */}
                <div>
                  <Label className="text-gray-700 dark:text-gray-200 font-semibold">
                    Images (Optional) - Max 5 images
                  </Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center w-full h-32 px-4 border-2 border-orange-300 dark:border-orange-700 border-dashed rounded-lg cursor-pointer bg-orange-50/50 dark:bg-orange-900/10 hover:bg-orange-100/70 dark:hover:bg-orange-900/20 transition-colors">
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-orange-500 dark:text-orange-400 mb-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Click to upload documentation images
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          PNG, JPG, GIF up to 5MB each
                        </span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={selectedImages.length >= 5}
                      />
                    </label>

                    {/* Image Previews */}
                    {imagePreview.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {imagePreview.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-orange-200 dark:border-orange-800"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Existing Images from Database */}
                    {isEditing && selectedNote?.images && selectedNote.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Existing images (will be kept when adding new ones):
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedNote.images.map((_, index) => (
                            <div key={index} className="relative">
                              <NoteImage
                                noteId={selectedNote._id!}
                                imageIndex={index}
                                alt={`Existing ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border-2 border-orange-200 dark:border-orange-800"
                              />
                              <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs rounded">
                                Saved
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={isEditing ? handleUpdateNote : handleCreateNote}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white h-12 text-lg"
                  disabled={!formData.title || !formData.content}
                >
                  <Save className="h-5 w-5 mr-2" />
                  {isEditing ? "Update Note" : "Save Note"}
                </Button>
                <Button
                  onClick={() => {
                    setShowEditor(false)
                    setIsEditing(false)
                    setSelectedNote(null)
                    resetForm()
                  }}
                  variant="outline"
                  className="border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 h-12"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
