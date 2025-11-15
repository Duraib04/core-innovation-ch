'use client'

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'

interface Card3DProps {
  children: React.ReactNode
  className?: string
}

export default function Card3D({ children, className = '' }: Card3DProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glareX, setGlareX] = useState(50)
  const [glareY, setGlareY] = useState(50)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation (increased for more dramatic effect)
    const rotX = ((y - centerY) / centerY) * -15
    const rotY = ((x - centerX) / centerX) * 15

    setRotateX(rotX)
    setRotateY(rotY)
    setGlareX((x / rect.width) * 100)
    setGlareY((y / rect.height) * 100)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setGlareX(50)
    setGlareY(50)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {/* Main Card */}
      <div className="relative" style={{ transform: "translateZ(50px)" }}>
        {children}
      </div>

      {/* Realistic Glare Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
          mixBlendMode: "overlay",
        }}
        animate={{
          opacity: rotateX !== 0 || rotateY !== 0 ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Realistic Shadow */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-2xl blur-2xl"
        animate={{
          x: rotateY * 2,
          y: rotateX * 2,
        }}
        style={{
          background: "rgba(0,0,0,0.5)",
          transform: "translateZ(-50px)",
        }}
      />

      {/* Edge Lighting */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: `linear-gradient(${Math.atan2(rotateX, rotateY) * (180 / Math.PI) + 90}deg, 
              rgba(99,102,241,0.5) 0%, 
              transparent 30%, 
              transparent 70%, 
              rgba(34,211,238,0.5) 100%)`,
          }}
          style={{ mixBlendMode: "screen" }}
        />
      </div>
    </motion.div>
  )
}
