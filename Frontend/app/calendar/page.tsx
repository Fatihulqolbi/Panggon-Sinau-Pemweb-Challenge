"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useState, useMemo } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Calendar,
  X,
  Trash2,
  Edit,
} from "lucide-react"

export default function CalendarPage() {
  const [isLoaded] = useState(true)

  const [currentView, setCurrentView] = useState("week")
  const [currentMonth, setCurrentMonth] = useState(2) // March = 2 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025)
  const [currentDate, setCurrentDate] = useState("March 5")
  const [selectedDay, setSelectedDay] = useState(8) // Start with day 8
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [draggedEvent, setDraggedEvent] = useState<any>(null)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([
    {
      id: 1,
      title: "Team Meeting",
      startTime: "09:00",
      endTime: "10:00",
      color: "bg-blue-500",
      day: 1,
      description: "Weekly team sync-up",
      location: "Conference Room A",
      attendees: ["John Doe", "Jane Smith", "Bob Johnson"],
      organizer: "Alice Brown",
    },
    {
      id: 2,
      title: "Lunch with Sarah",
      startTime: "12:30",
      endTime: "13:30",
      color: "bg-green-500",
      day: 1,
      description: "Discuss project timeline",
      location: "Cafe Nero",
      attendees: ["Sarah Lee"],
      organizer: "You",
    },
    {
      id: 3,
      title: "Project Review",
      startTime: "14:00",
      endTime: "15:30",
      color: "bg-purple-500",
      day: 3,
      description: "Q2 project progress review",
      location: "Meeting Room 3",
      attendees: ["Team Alpha", "Stakeholders"],
      organizer: "Project Manager",
    },
    {
      id: 4,
      title: "Client Call",
      startTime: "10:00",
      endTime: "11:00",
      color: "bg-yellow-500",
      day: 2,
      description: "Quarterly review with major client",
      location: "Zoom Meeting",
      attendees: ["Client Team", "Sales Team"],
      organizer: "Account Manager",
    },
    {
      id: 5,
      title: "Team Brainstorm",
      startTime: "13:00",
      endTime: "14:30",
      color: "bg-indigo-500",
      day: 4,
      description: "Ideation session for new product features",
      location: "Creative Space",
      attendees: ["Product Team", "Design Team"],
      organizer: "Product Owner",
    },
    {
      id: 6,
      title: "Product Demo",
      startTime: "11:00",
      endTime: "12:00",
      color: "bg-pink-500",
      day: 5,
      description: "Showcase new features to stakeholders",
      location: "Demo Room",
      attendees: ["Stakeholders", "Dev Team"],
      organizer: "Tech Lead",
    },
  ])
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    location: "",
    day: 1,
    date: new Date().getDate(), // Actual date number
    month: 2, // March
    year: 2025,
    category: "My Calendar",
  })

  const categories = [
    { name: "My Calendar", color: "bg-blue-500" },
    { name: "Work", color: "bg-green-500" },
    { name: "Personal", color: "bg-purple-500" },
    { name: "Family", color: "bg-orange-500" },
  ]

  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"]

  const getMonthName = () => `${monthNames[currentMonth]} ${currentYear}`

  const getDaysInMonth = () => {
    return new Date(currentYear, currentMonth + 1, 0).getDate()
  }

  const getFirstDayOfMonth = () => {
    return new Date(currentYear, currentMonth, 1).getDay()
  }

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const selectDate = (day: number) => {
    setSelectedDay(day)
    setCurrentDate(`${monthNames[currentMonth]} ${day}`)
    
    // Update newEvent default date when selecting a date
    setNewEvent(prev => ({
      ...prev,
      date: day,
      month: currentMonth,
      year: currentYear
    }))
  }

  const selectMonth = (monthIndex: number) => {
    setCurrentMonth(monthIndex)
    setShowMonthPicker(false)
  }

  const selectYear = (year: number) => {
    setCurrentYear(year)
    setShowYearPicker(false)
  }

  const getYearRange = () => {
    const years = []
    for (let i = currentYear - 5; i <= currentYear + 10; i++) {
      years.push(i)
    }
    return years
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
  }

  const handleCreateEvent = () => {
    if (!newEvent.title) return
    
    const selectedCategory = categories.find(c => c.name === newEvent.category)
    const eventColor = selectedCategory?.color || "bg-blue-500"
    
    // Get the day of week for the selected date
    const selectedDate = new Date(newEvent.year, newEvent.month, newEvent.date)
    const dayOfWeek = selectedDate.getDay() + 1 // 1 = Sunday, 2 = Monday, etc.
    
    const event = {
      id: events.length + 1,
      ...newEvent,
      day: dayOfWeek,
      color: eventColor,
      attendees: ["You"],
      organizer: "You",
    }
    
    setEvents([...events, event])
    setShowCreateModal(false)
    setNewEvent({
      title: "",
      startTime: "09:00",
      endTime: "10:00",
      description: "",
      location: "",
      day: 1,
      date: selectedDay,
      month: currentMonth,
      year: currentYear,
      category: "My Calendar",
    })
  }

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId))
    setSelectedEvent(null)
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent({
      ...event,
      category: event.category || "My Calendar"
    })
    setShowEditModal(true)
    setSelectedEvent(null)
  }

  const handleUpdateEvent = () => {
    if (!editingEvent.title) return
    
    const selectedCategory = categories.find(c => c.name === editingEvent.category)
    const eventColor = selectedCategory?.color || "bg-blue-500"
    
    // Calculate day of week based on the date
    const eventDate = new Date(editingEvent.year || currentYear, editingEvent.month || currentMonth, editingEvent.date || selectedDay)
    const dayOfWeek = eventDate.getDay() + 1
    
    const updatedEvents = events.map(ev => 
      ev.id === editingEvent.id 
        ? { ...editingEvent, color: eventColor, day: dayOfWeek }
        : ev
    )
    
    setEvents(updatedEvents)
    setShowEditModal(false)
    setEditingEvent(null)
  }

  const handleDragStart = (event: any, e: React.DragEvent) => {
    setDraggedEvent(event)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (dayIndex: number, e: React.DragEvent) => {
    e.preventDefault()
    if (draggedEvent) {
      const weekDatesArray = getWeekDates()
      const targetDate = weekDatesArray[dayIndex]
      
      const updatedEvents = events.map(ev => 
        ev.id === draggedEvent.id 
          ? { 
              ...ev, 
              day: dayIndex + 1,
              date: targetDate,
              month: currentMonth,
              year: currentYear
            }
          : ev
      )
      setEvents(updatedEvents)
      setDraggedEvent(null)
    }
  }

  // Sample calendar days for the week view
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  const timeSlots = Array.from({ length: 24 }, (_, i) => i) // 00:00 - 23:00

  // Helper function to calculate event position and height
  const calculateEventStyle = (startTime: string, endTime: string) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    const top = start * 60 // 60px per hour
    const height = (end - start) * 60
    return { top: `${top}px`, height: `${height}px` }
  }

  // Calculate week dates based on selected day
  const getWeekDates = () => {
    const selectedDate = new Date(currentYear, currentMonth, selectedDay)
    const dayOfWeek = selectedDate.getDay()
    
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDay - dayOfWeek)
    
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      dates.push(date.getDate())
    }
    return dates
  }

  const weekDates = getWeekDates()

  // Get events based on current view and selected date
  const getDisplayedEvents = () => {
    if (currentView === "day") {
      // Filter events for the selected day
      const selectedDate = new Date(currentYear, currentMonth, selectedDay)
      const dayOfWeek = selectedDate.getDay() + 1
      
      // Only show events that match the exact date
      return events.filter(e => 
        e.date === selectedDay && 
        e.month === currentMonth && 
        e.year === currentYear
      )
    } else if (currentView === "week") {
      // Show events for the current week
      return events.filter(e => {
        if (e.month !== currentMonth || e.year !== currentYear) return false
        return weekDates.includes(e.date)
      })
    } else {
      return events.filter(e => e.month === currentMonth && e.year === currentYear)
    }
  }

  const displayedEvents = getDisplayedEvents()

  // Sample calendar for mini calendar
  const daysInMonth = getDaysInMonth()
  const firstDayOffset = getFirstDayOfMonth()
  const miniCalendarDays = Array.from({ length: daysInMonth + firstDayOffset }, (_, i) =>
    i < firstDayOffset ? null : i - firstDayOffset + 1,
  )

  // Sample my calendars - using categories
  const myCalendars = categories

  return (
    <DashboardLayout>
      <div className="w-full -mx-4 -my-6 h-[calc(100vh-4rem)]">
        <div className="h-full flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {/* Sidebar */}
          <div className="w-full lg:w-64 h-auto lg:h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b lg:border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col justify-between shadow-lg">
            <div>
              <button 
                onClick={() => {
                  setNewEvent({
                    ...newEvent,
                    date: selectedDay,
                    month: currentMonth,
                    year: currentYear,
                  })
                  setShowCreateModal(true)
                }}
                className="mb-6 flex items-center justify-center gap-2 rounded-full bg-blue-500 hover:bg-blue-600 px-4 py-3 text-white w-full transition-colors shadow-md"
              >
                <Plus className="h-5 w-5" />
                <span>Create</span>
              </button>

              {/* Mini Calendar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <button 
                      onClick={() => setShowMonthPicker(!showMonthPicker)}
                      className="text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"
                    >
                      {monthNames[currentMonth]}
                    </button>
                    <button
                      onClick={() => setShowYearPicker(!showYearPicker)}
                      className="text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors ml-1"
                    >
                      {currentYear}
                    </button>
                    
                    {/* Month Picker Dropdown */}
                    {showMonthPicker && (
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 p-2 grid grid-cols-3 gap-1 w-48">
                        {monthNames.map((month, i) => (
                          <button
                            key={i}
                            onClick={() => selectMonth(i)}
                            className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                              i === currentMonth
                                ? "bg-blue-500 text-white"
                                : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            {month.substring(0, 3)}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Year Picker Dropdown */}
                    {showYearPicker && (
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 p-2 max-h-64 overflow-y-auto w-32">
                        {getYearRange().map((year) => (
                          <button
                            key={year}
                            onClick={() => selectYear(year)}
                            className={`w-full px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                              year === currentYear
                                ? "bg-blue-500 text-white"
                                : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={previousMonth}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-900 dark:text-white" />
                    </button>
                    <button 
                      onClick={nextMonth}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-900 dark:text-white" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i} className="text-xs text-gray-600 dark:text-gray-400 font-medium py-1">
                      {day}
                    </div>
                  ))}

                  {miniCalendarDays.map((day, i) => (
                    <div
                      key={i}
                      onClick={() => day && selectDate(day)}
                      className={`text-xs rounded-full w-7 h-7 flex items-center justify-center transition-colors ${
                        day === selectedDay 
                          ? "bg-blue-500 text-white font-bold cursor-pointer" 
                          : day 
                            ? "text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                            : "invisible"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {/* My Calendars */}
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-3">My calendars</h3>
                <div className="space-y-2">
                  {myCalendars.map((cal, i) => (
                    <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors">
                      <div className={`w-3 h-3 rounded-sm ${cal.color}`}></div>
                      <span className="text-gray-900 dark:text-white text-sm">{cal.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Plus Button */}
            <button 
              onClick={() => {
                setNewEvent({
                  ...newEvent,
                  date: selectedDay,
                  month: currentMonth,
                  year: currentYear,
                })
                setShowCreateModal(true)
              }}
              className="mt-6 hidden lg:flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-600 p-4 text-white w-14 h-14 shadow-lg transition-all hover:scale-105"
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>

          {/* Calendar View */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Calendar Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 gap-3">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <button className="px-3 sm:px-4 py-2 text-sm sm:text-base text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-md font-medium">
                  Today
                </button>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button className="p-2 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{currentDate}</h2>
              </div>

              <div className="flex items-center gap-2 rounded-lg p-1 bg-gray-100 dark:bg-gray-700">
                <button
                  onClick={() => setCurrentView("day")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === "day" 
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" 
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setCurrentView("week")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === "week" 
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" 
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setCurrentView("month")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currentView === "month" 
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" 
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Month
                </button>
              </div>
            </div>

            {/* Week/Day View */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 lg:p-6">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl min-h-full">
                {currentView === "week" ? (
                  <>
                    {/* Week Header */}
                    <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 sticky top-0 z-10">
                      <div className="p-2 sm:p-3 text-center"></div>
                      {weekDays.map((day, i) => (
                        <div key={i} className="p-2 sm:p-3 text-center border-l border-gray-200 dark:border-gray-700">
                          <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">{day}</div>
                          <div
                            className={`text-lg sm:text-2xl font-bold mt-1 transition-all ${
                              weekDates[i] === 5 
                                ? "bg-blue-500 rounded-full w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center mx-auto text-white shadow-lg" 
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {weekDates[i]}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Time Grid */}
                    <div className="grid grid-cols-8 relative">
                      {/* Time Labels */}
                      <div className="text-gray-600 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-900/30 sticky left-0 z-10">
                        {timeSlots.map((time, i) => (
                          <div key={i} className="h-12 sm:h-16 border-b border-gray-100 dark:border-gray-700 pr-2 text-right text-[10px] sm:text-sm font-medium flex items-start pt-1">
                            {String(time).padStart(2, '0')}:00
                          </div>
                        ))}
                      </div>

                      {/* Days Columns */}
                      {Array.from({ length: 7 }).map((_, dayIndex) => (
                        <div 
                          key={dayIndex} 
                          className="border-l border-gray-200 dark:border-gray-700 relative bg-white/20 dark:bg-gray-800/20 transition-colors hover:bg-blue-50/30 dark:hover:bg-blue-900/10"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(dayIndex, e)}
                        >
                          {timeSlots.map((_, timeIndex) => (
                            <div key={timeIndex} className="h-12 sm:h-16 border-b border-gray-100 dark:border-gray-700"></div>
                          ))}

                          {/* Events */}
                          {displayedEvents
                            .filter((event) => {
                              const weekDatesArray = getWeekDates()
                              return event.date === weekDatesArray[dayIndex]
                            })
                            .map((event, i) => {
                              const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                              return (
                                <div
                                  key={i}
                                  draggable
                                  onDragStart={(e) => handleDragStart(event, e)}
                                  className={`absolute ${event.color} rounded-lg p-1 sm:p-2 text-white text-[10px] sm:text-xs shadow-xl cursor-move transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-2xl hover:z-10 ${draggedEvent?.id === event.id ? 'opacity-50' : ''}`}
                                  style={{
                                    ...eventStyle,
                                    left: "4px",
                                    right: "4px",
                                  }}
                                  onClick={() => handleEventClick(event)}
                                >
                                  <div className="font-bold text-[11px] sm:text-sm">{event.title}</div>
                                  <div className="opacity-90 text-[9px] sm:text-[11px] mt-0.5">{`${event.startTime} - ${event.endTime}`}</div>
                                </div>
                              )
                            })}
                        </div>
                      ))}
                    </div>
                  </>
                ) : currentView === "day" ? (
                  <>
                    {/* Day Header */}
                    <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 sticky top-0 z-10">
                      <div className="p-2 sm:p-3 text-center"></div>
                      <div className="p-2 sm:p-3 text-center border-l border-gray-200 dark:border-gray-700">
                        <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase">
                          {weekDays[new Date(currentYear, currentMonth, selectedDay).getDay()]}
                        </div>
                        <div className="bg-blue-500 rounded-full w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center mx-auto text-white shadow-lg text-lg sm:text-2xl font-bold mt-1">
                          {selectedDay}
                        </div>
                      </div>
                    </div>

                    {/* Time Grid for Day View */}
                    <div className="grid grid-cols-2 relative">
                      <div className="text-gray-600 dark:text-gray-400 bg-gray-50/30 dark:bg-gray-900/30">
                        {timeSlots.map((time, i) => (
                          <div key={i} className="h-16 border-b border-gray-100 dark:border-gray-700 pr-3 text-right text-sm font-medium flex items-start pt-1">
                            {String(time).padStart(2, '0')}:00
                          </div>
                        ))}
                      </div>

                      <div 
                        className="border-l border-gray-200 dark:border-gray-700 relative bg-white/20 dark:bg-gray-800/20 transition-colors hover:bg-blue-50/30 dark:hover:bg-blue-900/10"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(0, e)}
                      >
                        {timeSlots.map((_, timeIndex) => (
                          <div key={timeIndex} className="h-16 border-b border-gray-100 dark:border-gray-700"></div>
                        ))}

                        {displayedEvents.map((event, i) => {
                          const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                          return (
                            <div
                              key={i}
                              draggable
                              onDragStart={(e) => handleDragStart(event, e)}
                              className={`absolute ${event.color} rounded-lg p-3 text-white text-sm shadow-xl cursor-move transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-2xl hover:z-10 ${draggedEvent?.id === event.id ? 'opacity-50' : ''}`}
                              style={{
                                ...eventStyle,
                                left: "8px",
                                right: "8px",
                              }}
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="font-bold text-base">{event.title}</div>
                              <div className="opacity-90 text-xs mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                    <p className="text-lg">Month view - Coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

          {/* Create Event Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Create Event</h3>
                  <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((cat, i) => (
                        <option key={i} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Event title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={newEvent.startTime}
                        onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                      <input
                        type="time"
                        value={newEvent.endTime}
                        onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={`${newEvent.year}-${String(newEvent.month + 1).padStart(2, '0')}-${String(newEvent.date).padStart(2, '0')}`}
                      onChange={(e) => {
                        const date = new Date(e.target.value)
                        setNewEvent({ 
                          ...newEvent, 
                          date: date.getDate(),
                          month: date.getMonth(),
                          year: date.getFullYear()
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Location"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Description"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateEvent}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Event Detail Modal */}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className={`${selectedEvent.color} rounded-xl shadow-2xl max-w-md w-full p-6 relative`}>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
                
                <h3 className="text-2xl font-bold mb-4 text-white pr-8">{selectedEvent.title}</h3>
                <div className="space-y-3 text-white">
                  <p className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    {`${selectedEvent.startTime} - ${selectedEvent.endTime}`}
                  </p>
                  <p className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    {selectedEvent.location}
                  </p>
                  <p className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    {`${weekDays[selectedEvent.day - 1]}, ${weekDates[selectedEvent.day - 1]} ${getMonthName()}`}
                  </p>
                  {selectedEvent.category && (
                    <p className="flex items-center">
                      <span className={`mr-2 h-3 w-3 rounded-sm ${categories.find(c => c.name === selectedEvent.category)?.color || 'bg-gray-500'}`}></span>
                      <span><strong>Category:</strong> {selectedEvent.category}</span>
                    </p>
                  )}
                  <p className="flex items-start">
                    <Users className="mr-2 h-5 w-5 mt-1" />
                    <span>
                      <strong>Attendees:</strong>
                      <br />
                      {selectedEvent.attendees.join(", ") || "No attendees"}
                    </span>
                  </p>
                  <p>
                    <strong>Organizer:</strong> {selectedEvent.organizer}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedEvent.description}
                  </p>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors font-medium border border-white/30"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Close
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg"
                    onClick={() => handleEditEvent(selectedEvent)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-lg"
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Event Modal */}
          {showEditModal && editingEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Event</h3>
                  <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={editingEvent.category}
                      onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map((cat, i) => (
                        <option key={i} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Event title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={editingEvent.startTime}
                        onChange={(e) => setEditingEvent({ ...editingEvent, startTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                      <input
                        type="time"
                        value={editingEvent.endTime}
                        onChange={(e) => setEditingEvent({ ...editingEvent, endTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={`${editingEvent.year || currentYear}-${String((editingEvent.month ?? currentMonth) + 1).padStart(2, '0')}-${String(editingEvent.date || selectedDay).padStart(2, '0')}`}
                      onChange={(e) => {
                        const date = new Date(e.target.value)
                        setEditingEvent({ 
                          ...editingEvent, 
                          date: date.getDate(),
                          month: date.getMonth(),
                          year: date.getFullYear()
                        })
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={editingEvent.location}
                      onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Location"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      value={editingEvent.description}
                      onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Description"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateEvent}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </DashboardLayout>
  )
}
