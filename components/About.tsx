'use client'

import { motion } from 'framer-motion'
import Card3D from './Card3D'
import GlassMorph from './GlassMorph'
import VideoBackground from './VideoBackground'

export default function About() {
  // Dynamic stats calculation
  const careerStartDate = new Date('2024-07-01') // Set your actual career start date here
  const projectsStartDate = new Date('2024-07-01') // Set your first project date here
  const today = new Date()
  
  // Calculate years of experience with one decimal
  const yearsExperience = ((today.getTime() - careerStartDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)
  
  // Calculate approximate projects (you can adjust the rate: projects per month)
  const monthsActive = Math.floor((today.getTime() - projectsStartDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
  const projectsCompleted = Math.max(3, Math.floor(monthsActive * 0.5)) // Adjust 0.5 to your average projects per month

  return (
    <section className="min-h-screen py-20 px-6 relative overflow-hidden">
      <VideoBackground opacity={0.2} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 glow">
            About <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            I&apos;m Durai, a passionate innovator dedicated to creating exceptional digital experiences
            that push the boundaries of what&apos;s possible.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group mb-20 max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-primary/20">
            <h3 className="text-3xl font-bold mb-4 glow">My Mission</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              To deliver cutting-edge solutions that combine stunning design with powerful functionality.
              Every project is crafted with meticulous attention to detail and a commitment to excellence.
            </p>
            <p className="text-gray-300 leading-relaxed">
              With years of experience in the industry, I specialize in transforming ideas into
              reality through innovative technology and creative problem-solving.
            </p>
          </div>
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { number: `${projectsCompleted}+`, label: 'Projects Completed' },
            { number: '100%', label: 'Client Satisfaction' },
            { number: `${yearsExperience}+`, label: 'Years Experience' },
            { number: '24/7', label: 'Support Available' },
          ].map((stat, index) => (
            <Card3D key={index} className="h-full">
              <GlassMorph blur={20} opacity={0.1} className="h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.6,
                    type: "spring",
                    bounce: 0.5
                  }}
                  className="p-8 text-center relative overflow-hidden group h-full flex flex-col justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <motion.div 
                    className="text-5xl font-bold mb-2 glow relative z-10"
                    animate={{
                      textShadow: [
                        '0 0 20px rgba(99, 102, 241, 0.8)',
                        '0 0 40px rgba(139, 92, 246, 0.8)',
                        '0 0 20px rgba(99, 102, 241, 0.8)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-gray-300 relative z-10 font-medium">{stat.label}</div>
                  
                  {/* Floating particles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-primary rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [-20, -40],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </motion.div>
              </GlassMorph>
            </Card3D>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
