'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

export default function ParallaxScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Smooth spring physics
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  
  const y1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -200]), springConfig)
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -400]), springConfig)
  const y3 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -600]), springConfig)
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5])

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Layer 1 - Background */}
      <motion.div
        style={{ y: y1, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-cyan-900/30" />
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`bg-${i}`}
            className="absolute rounded-full blur-3xl"
            style={{
              width: Math.random() * 400 + 200,
              height: Math.random() * 400 + 200,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                ['rgba(99,102,241,0.3)', 'rgba(139,92,246,0.3)', 'rgba(34,211,238,0.3)'][Math.floor(Math.random() * 3)]
              } 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Layer 2 - Mid */}
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`mid-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
          </motion.div>
        ))}
      </motion.div>

      {/* Layer 3 - Foreground */}
      <motion.div
        style={{ y: y3, scale }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`fg-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
