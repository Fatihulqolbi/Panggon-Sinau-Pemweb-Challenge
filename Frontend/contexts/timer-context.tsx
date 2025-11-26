"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { pomodoroAPI } from "@/lib/api"

interface TimerContextType {
  mode: "focus" | "break"
  time: number
  isActive: boolean
  progress: number
  toggleTimer: () => void
  resetTimer: () => void
  switchMode: (newMode: "focus" | "break") => void
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export function TimerProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"focus" | "break">("focus")
  const [time, setTime] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [progress, setProgress] = useState(100)

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission()
      }
    }
  }, [])

  // Calculate progress for the circle
  useEffect(() => {
    const totalTime = mode === "focus" ? 25 * 60 : 5 * 60
    setProgress((time / totalTime) * 100)
  }, [time, mode])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0 && isActive) {
      // Log completed session to database
      const sessionDuration = mode === "focus" ? 25 : 5;
      pomodoroAPI.logSession({
        type: mode,
        duration: sessionDuration,
      }).catch(error => {
        console.error('Failed to log pomodoro session:', error);
      });

      // Play alarm sound
      if (typeof window !== 'undefined') {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 1)
      }
      
      // Timer finished - show notification
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          const title = mode === 'focus' ? 'Waktu Fokus Selesai!' : 'Waktu Break Selesai!'
          const body = mode === 'focus' 
            ? 'Saatnya istirahat 5 menit. Mainkan catur atau stretch sebentar!' 
            : 'Kembali fokus untuk 25 menit berikutnya. Semangat!'
          
          new Notification(title, {
            body,
            icon: '/icon.svg',
            badge: '/icon.svg',
          })
        }
      }
      
      // Switch modes when timer ends
      if (mode === "focus") {
        setMode("break")
        setTime(5 * 60) // 5 minute break
      } else {
        setMode("focus")
        setTime(25 * 60) // 25 minute focus
      }
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, time, mode])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTime(mode === "focus" ? 25 * 60 : 5 * 60)
  }

  const switchMode = (newMode: "focus" | "break") => {
    setMode(newMode)
    setIsActive(false)
    setTime(newMode === "focus" ? 25 * 60 : 5 * 60)
  }

  return (
    <TimerContext.Provider
      value={{
        mode,
        time,
        isActive,
        progress,
        toggleTimer,
        resetTimer,
        switchMode,
      }}
    >
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider")
  }
  return context
}
