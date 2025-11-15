'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Card3D from './Card3D'
import GlassMorph from './GlassMorph'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showContent, setShowContent] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth mouse tracking
  const springConfig = { damping: 25, stiffness: 150 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  // Parallax effect
  const x1 = useTransform(smoothMouseX, [0, dimensions.width], [-50, 50])
  const y1 = useTransform(smoothMouseY, [0, dimensions.height], [-50, 50])
  const x2 = useTransform(smoothMouseX, [0, dimensions.width], [-25, 25])
  const y2 = useTransform(smoothMouseY, [0, dimensions.height], [-25, 25])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
      const handleResize = () => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight })
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    // Startup animation delay
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      dx: number
      dy: number
      size: number
      color: string
    }> = []

    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4']

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.dx
        particle.y += particle.dy

        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / 150})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Advanced Background with Parallax */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-cyan-900/30 animate-gradient-x"></div>
        {/* Layer 1: Deep Background */}
        <motion.div 
          className="absolute inset-0"
          style={{ x: x1, y: y1 }}
        >
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`layer1-${i}`}
              className="absolute rounded-full blur-3xl"
              style={{
                width: Math.random() * 400 + 200,
                height: Math.random() * 400 + 200,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, ${
                  ['rgba(99,102,241,0.4)', 'rgba(139,92,246,0.4)', 'rgba(34,211,238,0.4)'][i % 3]
                } 0%, transparent 70%)`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Layer 2: Mid Ground with Parallax */}
        <motion.div 
          className="absolute inset-0"
          style={{ x: x2, y: y2 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`layer2-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-primary/20 to-accent/20 blur-xl"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Layer 3: Foreground Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: '0 0 10px 2px rgba(255,255,255,0.5)',
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -100],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-5"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 glow"
            initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            animate={showContent ? { scale: 1, opacity: 1, rotateY: 0 } : {}}
            transition={{ duration: 1.2, type: 'spring', bounce: 0.4 }}
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              Innovation
            </motion.span>{' '}
            <br />
            Meets Excellence
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Discover cutting-edge projects and premium products crafted with passion and precision
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
          >
            <Card3D>
              <motion.button
                onClick={() => {
                  const element = document.getElementById('projects')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(99, 102, 241, 0.8)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-full text-lg font-semibold glow-strong relative overflow-hidden"
              >
                <span className="relative z-10">Explore Projects</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.button>
            </Card3D>

            <GlassMorph blur={15} opacity={0.15} className="rounded-full">
              <motion.button
                onClick={() => {
                  const element = document.getElementById('products')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white/30 rounded-full text-lg font-semibold backdrop-blur-sm"
              >
                View Products
              </motion.button>
            </GlassMorph>

            <Card3D>
              <motion.a
                href="/custom-project"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all relative overflow-hidden"
              >
                <span className="relative z-10">🎯 Request Custom Project</span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    scale: [1, 1.5],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              </motion.a>
            </Card3D>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl text-primary"
          >
            ↓
          </motion.div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl"
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </section>
  )
}
