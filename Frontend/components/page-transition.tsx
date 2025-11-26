"use client"

import { ReactNode, useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { LoadingScreen } from "./loading-screen"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const prevPathnameRef = useRef(pathname)

  useEffect(() => {
    // Always show loading screen
    setIsLoading(true)
    console.log('🔄 Loading screen SHOWN for path:', pathname)
    
    const timer = setTimeout(() => {
      setIsLoading(false)
      console.log('✅ Loading screen HIDDEN for path:', pathname)
      prevPathnameRef.current = pathname
    }, 2000)

    return () => clearTimeout(timer)
  }, [pathname])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  )
}
