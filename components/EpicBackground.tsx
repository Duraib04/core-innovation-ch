'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function EpicBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Planets */}
      <motion.div
        className="absolute top-10 right-20"
        animate={{
          rotate: [0, 360],
          y: [0, -30, 0],
        }}
        transition={{
          rotate: { duration: 60, repeat: Infinity, ease: "linear" },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="relative w-32 h-32">
          {/* Saturn */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-2xl shadow-yellow-500/50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-2 bg-gradient-to-r from-transparent via-yellow-200/30 to-transparent rounded-full rotate-[-20deg]" />
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-400/20 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-1/4 left-10"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        {/* Earth-like Planet */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-green-500 shadow-2xl shadow-blue-500/50" />
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/4"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 360],
        }}
        transition={{
          y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 50, repeat: Infinity, ease: "linear" }
        }}
      >
        {/* Purple Planet */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 shadow-2xl shadow-purple-500/50" />
        </div>
      </motion.div>

      {/* Spaceships */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`spaceship-${i}`}
          className="absolute"
          initial={{ x: -100, y: Math.random() * 300 + 100 }}
          animate={{
            x: ['-100px', 'calc(100vw + 100px)'],
            y: [
              Math.random() * 300 + 100,
              Math.random() * 300 + 150,
              Math.random() * 300 + 100
            ],
          }}
          transition={{
            x: { duration: 25 + i * 5, repeat: Infinity, ease: "linear" },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            delay: i * 8,
          }}
        >
          <div className="relative w-16 h-8">
            {/* Spaceship body */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 rounded-full shadow-lg shadow-blue-500/50" />
            <div className="absolute top-1 left-1 w-6 h-6 bg-cyan-400 rounded-full blur-sm animate-pulse" />
            {/* Exhaust */}
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-2 bg-gradient-to-r from-orange-500 to-transparent blur-sm"
              animate={{
                scaleX: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          </div>
        </motion.div>
      ))}

      {/* Dragons */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`dragon-${i}`}
          className="absolute text-6xl"
          initial={{ 
            x: i % 2 === 0 ? 'calc(100vw + 100px)' : '-100px',
            y: Math.random() * 200 + 50 
          }}
          animate={{
            x: i % 2 === 0 ? ['-100px'] : ['calc(100vw + 100px)'],
            y: [
              Math.random() * 200 + 50,
              Math.random() * 200 + 100,
              Math.random() * 200 + 50
            ],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            x: { duration: 30, repeat: Infinity, ease: "linear" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            delay: i * 15,
          }}
        >
          <motion.div
            animate={{
              filter: [
                'drop-shadow(0 0 10px rgba(255, 50, 50, 0.8))',
                'drop-shadow(0 0 20px rgba(255, 100, 50, 1))',
                'drop-shadow(0 0 10px rgba(255, 50, 50, 0.8))',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🐉
          </motion.div>
          {/* Fire breath */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-4 bg-gradient-to-r from-orange-500 to-transparent blur-sm"
            animate={{
              scaleX: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.div>
      ))}

      {/* Angels */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`angel-${i}`}
          className="absolute text-4xl"
          style={{
            left: `${20 + i * 20}%`,
            top: `${10 + i * 15}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            y: { duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 6 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <motion.div
            animate={{
              filter: [
                'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))',
                'drop-shadow(0 0 30px rgba(255, 215, 0, 1))',
                'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👼
          </motion.div>
          {/* Halo */}
          <motion.div
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-10 h-10 border-2 border-yellow-300 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      ))}

      {/* People/Astronauts */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`people-${i}`}
          className="absolute text-5xl"
          style={{
            left: `${30 + i * 25}%`,
            bottom: `${20 + i * 10}%`,
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            y: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <motion.div
            animate={{
              filter: [
                'drop-shadow(0 0 10px rgba(100, 200, 255, 0.6))',
                'drop-shadow(0 0 20px rgba(100, 200, 255, 1))',
                'drop-shadow(0 0 10px rgba(100, 200, 255, 0.6))',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧑‍🚀
          </motion.div>
          {/* Jetpack effect */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-b from-blue-400 to-transparent blur-md"
            animate={{
              scaleY: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </motion.div>
      ))}

      {/* Shooting Stars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${Math.random() * 50}%`,
            left: '-10px',
          }}
          animate={{
            x: ['0px', 'calc(100vw + 100px)'],
            y: ['0px', '200px'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 4,
            ease: "easeOut",
          }}
        >
          <div className="relative">
            <div className="absolute inset-0 w-1 h-1 bg-white rounded-full shadow-lg shadow-white" />
            <motion.div
              className="absolute top-0 left-0 w-20 h-0.5 bg-gradient-to-r from-white to-transparent blur-sm"
              style={{ transformOrigin: 'left center', rotate: '25deg' }}
            />
          </div>
        </motion.div>
      ))}

      {/* Comets */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`comet-${i}`}
          className="absolute"
          style={{
            top: `${20 + i * 30}%`,
          }}
          initial={{ x: 'calc(100vw + 100px)', y: -100 }}
          animate={{
            x: ['-200px'],
            y: ['100vh'],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: i * 20,
            ease: "linear",
          }}
        >
          <div className="relative">
            {/* Comet head */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow-lg shadow-cyan-500/50" />
            {/* Comet tail */}
            <motion.div
              className="absolute top-1/2 left-full -translate-y-1/2 w-40 h-2 bg-gradient-to-r from-cyan-400 via-blue-300 to-transparent blur-md"
              animate={{
                scaleX: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </div>
        </motion.div>
      ))}

      {/* Nebula effects */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
