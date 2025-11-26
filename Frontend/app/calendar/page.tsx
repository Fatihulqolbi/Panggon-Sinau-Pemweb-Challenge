"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  X,
  Trash2,
  Edit,
} from "lucide-react"
import { eventsAPI, Event } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const CATEGORIES = [
  { value: "my-calendar", label: "My Calendar", color: "bg-blue-500" },
  { value: "work", label: "Work", color: "bg-green-500" },
  { value: "personal", label: "Personal", color: "bg-purple-500" },
  { value: "family", label: "Family", color: "bg-orange-500" },
]

export default function CalendarPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "09:00",
    endTime: "10:00",
    date: "",
    location: "",
    category: "my-calendar",
  })

  useEffect(() => {
    fetchEvents()
  }, [currentMonth, currentYear])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await eventsAPI.getAll(currentYear, currentMonth)
      if (response.success) {
        setEvents(response.events)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async () => {
    try {
      const [year, month, day] = formData.date.split("-").map(Number)
      const eventData = {
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        category: formData.category,
        date: day,
        month: month - 1, // JS months are 0-indexed
        year,
      }

      console.log("Creating event with data:", eventData)
      const response = await eventsAPI.create(eventData)
      console.log("Create response:", response)
      if (response.success) {
        await fetchEvents()
        setShowCreateModal(false)
        resetForm()
      }
    } catch (error: any) {
      console.error("Error creating event:", error)
      alert(`Failed to create event: ${error.message || 'Unknown error'}`)
    }
  }

  const handleUpdateEvent = async () => {
    if (!selectedEvent || !selectedEvent._id) return
    try {
      const [year, month, day] = formData.date.split("-").map(Number)
      const eventData = {
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        category: formData.category,
        date: day,
        month: month - 1,
        year,
      }

      const response = await eventsAPI.update(selectedEvent._id, eventData)
      if (response.success) {
        await fetchEvents()
        setShowEditModal(false)
        setSelectedEvent(null)
        resetForm()
      }
    } catch (error) {
      console.error("Error updating event:", error)
      alert("Failed to update event. Please try again.")
    }
  }

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !selectedEvent._id) return
    try {
      const response = await eventsAPI.delete(selectedEvent._id)
      if (response.success) {
        await fetchEvents()
        setSelectedEvent(null)
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      alert("Failed to delete event. Please try again.")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startTime: "09:00",
      endTime: "10:00",
      date: "",
      location: "",
      category: "my-calendar",
    })
  }

  const openCreateModal = () => {
    resetForm()
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    setFormData((prev) => ({ ...prev, date: dateStr }))
    setShowCreateModal(true)
  }

  const openEditModal = (event: Event) => {
    setSelectedEvent(event)
    const dateStr = `${event.year}-${String(event.month + 1).padStart(2, "0")}-${String(event.date).padStart(2, "0")}`
    setFormData({
      title: event.title,
      description: event.description || "",
      startTime: event.startTime,
      endTime: event.endTime,
      date: dateStr,
      location: event.location || "",
      category: event.category,
    })
    setShowEditModal(true)
  }

  const getDaysInMonth = () => {
    return new Date(currentYear, currentMonth + 1, 0).getDate()
  }

  const getFirstDayOfMonth = () => {
    return new Date(currentYear, currentMonth, 1).getDay()
  }

  const getEventsForDay = (day: number) => {
    return events.filter((e) => e.date === day && e.month === currentMonth && e.year === currentYear)
  }

  const getCategoryColor = (category: string) => {
    return CATEGORIES.find((c) => c.value === category)?.color || "bg-gray-500"
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth()
    const firstDay = getFirstDayOfMonth()
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day)
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
      const isSelected = day === selectedDay

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDay(day)}
          className={`h-24 border border-purple-200/30 dark:border-purple-800/30 p-2 cursor-pointer transition-all hover:bg-purple-50/50 dark:hover:bg-purple-900/20 ${
            isSelected ? "bg-purple-100/50 dark:bg-purple-900/30 ring-2 ring-purple-500" : ""
          } ${isToday ? "bg-purple-50/30 dark:bg-purple-900/20" : ""}`}
        >
          <div className={`text-sm font-semibold mb-1 ${isToday ? "text-purple-600 dark:text-purple-400" : "text-gray-700 dark:text-gray-300"}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event._id}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedEvent(event)
                }}
                className={`text-xs px-1.5 py-0.5 rounded text-white truncate ${getCategoryColor(event.category)} hover:opacity-80 transition-opacity`}
              >
                {event.startTime} {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      )
    }

    return days
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
          style={{ filter: "brightness(0.6)" }}
        >
          <source src="/lofi-coffee-shop.960x540.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-purple-800/50 to-purple-900/60 backdrop-blur-[2px]" />
      </div>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Calendar</h1>
            <p className="text-purple-200 mt-1">Manage your schedule and events</p>
          </div>
          <Button
            onClick={openCreateModal}
            className="bg-purple-500 hover:bg-purple-600 text-white shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Calendar Container */}
        <div className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md rounded-xl shadow-2xl border border-purple-200/20">
          {/* Calendar Header */}
          <div className="p-6 border-b border-purple-200/30 dark:border-purple-800/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={prevMonth}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <Button
                  onClick={nextMonth}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Mini Calendar Legend */}
            <div className="flex gap-4 flex-wrap">
              {CATEGORIES.map((cat) => (
                <div key={cat.value} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold text-purple-600 dark:text-purple-400 py-2">
                  {day}
                </div>
              ))}
              {/* Calendar days */}
              {renderCalendar()}
            </div>
          </div>
        </div>

        {/* Day Events List */}
        {selectedDay && (
          <div className="bg-white/95 dark:bg-slate-900/70 backdrop-blur-md rounded-xl shadow-2xl border border-purple-200/20 p-6">
            <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-4">
              Events for {monthNames[currentMonth]} {selectedDay}, {currentYear}
            </h3>
            <div className="space-y-3">
              {getEventsForDay(selectedDay).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No events scheduled</p>
              ) : (
                getEventsForDay(selectedDay).map((event) => (
                  <div
                    key={event._id}
                    onClick={() => setSelectedEvent(event)}
                    className="p-4 rounded-lg border-2 border-purple-200/40 dark:border-purple-800/40 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(event.category)}`} />
                          <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {event.startTime} - {event.endTime}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-md border border-purple-200/20">
            <div className="flex items-center justify-between p-6 border-b border-purple-200/30 dark:border-purple-800/30">
              <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">Create Event</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-200">Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-purple-200 dark:border-purple-800 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Event title"
                  className="mt-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-200">Start Time</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="mt-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-200">End Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="mt-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Location"
                  className="mt-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description"
                  rows={3}
                  className="mt-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                />
              </div>
            </div>
            <div className="p-6 border-t border-purple-200/30 dark:border-purple-800/30 flex gap-3">
              <Button
                onClick={() => setShowCreateModal(false)}
                variant="outline"
                className="flex-1 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateEvent}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                disabled={!formData.title || !formData.date}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-md border border-purple-200/20">
            <div className="flex items-center justify-between p-6 border-b border-purple-200/30 dark:border-purple-800/30">
              <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">Edit Event</h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedEvent(null)
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-gray-700 dark:text-gray-200">Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-purple-200 dark:border-purple-800 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:border-purple-500 focus:ring-purple-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Event title"
                  className="mt-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-200">Start Time</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="mt-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                  />
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-gray-200">End Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="mt-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Location"
                  className="mt-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-200">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description"
                  rows={3}
                  className="mt-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 focus:ring-purple-500 bg-white/80 dark:bg-gray-800/80"
                />
              </div>
            </div>
            <div className="p-6 border-t border-purple-200/30 dark:border-purple-800/30 flex gap-3">
              <Button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedEvent(null)
                }}
                variant="outline"
                className="flex-1 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateEvent}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                disabled={!formData.title || !formData.date}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && !showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-2xl w-full max-w-md text-white">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold">{selectedEvent.title}</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>
                    {selectedEvent.startTime} - {selectedEvent.endTime}
                  </span>
                </div>

                {selectedEvent.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{selectedEvent.location}</span>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-sm font-semibold mb-1">Category:</p>
                  <p>{CATEGORIES.find((c) => c.value === selectedEvent.category)?.label}</p>
                </div>

                {selectedEvent.description && (
                  <div className="pt-2">
                    <p className="text-sm font-semibold mb-1">Description:</p>
                    <p className="text-white/90">{selectedEvent.description}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => setSelectedEvent(null)}
                  variant="secondary"
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  Close
                </Button>
                <Button
                  onClick={() => openEditModal(selectedEvent)}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleDeleteEvent}
                  variant="secondary"
                  className="bg-red-500/80 hover:bg-red-600 text-white border-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
