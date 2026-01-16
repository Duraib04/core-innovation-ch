'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashIntro() {
  const [show, setShow] = useState(false)
  const [canDismiss, setCanDismiss] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    // Only show on first visit in this session
    try {
      const played = sessionStorage.getItem('logoIntroPlayed')
      if (!played) {
        setShow(true)
        // Safety timeout: allow dismiss if video fails
        const t = setTimeout(() => setCanDismiss(true), 6000)
        return () => clearTimeout(t)
      }
    } catch (e) {
      // If sessionStorage is unavailable, still attempt to show once
      setShow(true)
    }
  }, [])

  const handleEnded = () => {
    try { sessionStorage.setItem('logoIntroPlayed', '1') } catch {}
    setShow(false)
  }

  const handleSkip = () => {
    try { sessionStorage.setItem('logoIntroPlayed', '1') } catch {}
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black"
        >
          {/* Centered video */}
          <div className="w-full h-full flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              className="w-full max-w-4xl"
            >
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-primary/30 shadow-lg shadow-primary/20">
                <video
                  ref={videoRef}
                  src="/images/intro%20video.mp4"
                  autoPlay
                  muted
                  playsInline
                  onEnded={handleEnded}
                  className="w-full h-full"
                  controls={false}
                />
              </div>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleSkip}
                  className={`px-4 py-2 rounded-full border text-sm transition-colors ${canDismiss ? 'border-gray-500 text-gray-300 hover:bg-gray-800' : 'border-gray-700 text-gray-600 cursor-not-allowed'}`}
                  disabled={!canDismiss}
                >
                  Skip
                </button>
                <span className="text-xs text-gray-500">Intro plays once per session</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
