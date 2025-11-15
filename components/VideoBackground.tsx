'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoBackgroundProps {
  opacity?: number
  className?: string
}

export default function VideoBackground({ 
  opacity = 0.2, 
  className = '' 
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <video
        ref={videoRef}
        autoPlay={isVisible}
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ opacity }}
      >
        {isVisible && (
          <source 
            src="https://cdn.pixabay.com/video/2022/04/19/114761-700719864_large.mp4" 
            type="video/mp4" 
          />
        )}
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
    </div>
  )
}
