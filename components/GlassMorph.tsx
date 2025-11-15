'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassMorphProps {
  children: ReactNode
  blur?: number
  opacity?: number
  className?: string
}

export default function GlassMorph({ 
  children, 
  blur = 20, 
  opacity = 0.1, 
  className = '' 
}: GlassMorphProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`relative group ${className}`}
    >
      {/* Glass Background */}
      <div 
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `rgba(255, 255, 255, ${opacity})`,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
      />

      {/* Shimmer Effect */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 5,
          }}
          style={{
            transform: 'skewX(-20deg)',
          }}
        />
      </div>

      {/* Inner Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* 3D Depth Shadow */}
      <div 
        className="absolute inset-0 rounded-2xl -z-10 translate-y-2 blur-xl opacity-50"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(34,211,238,0.3) 100%)',
        }}
      />
    </motion.div>
  )
}
