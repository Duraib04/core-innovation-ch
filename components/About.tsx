'use client'

import { motion } from 'framer-motion'
import Card3D from './Card3D'
import GlassMorph from './GlassMorph'

export default function About() {
  const skills = [
    { name: 'Web Development', level: 95, icon: '🌐' },
    { name: 'Mobile Apps', level: 90, icon: '📱' },
    { name: 'UI/UX Design', level: 88, icon: '🎨' },
    { name: 'Cloud Solutions', level: 92, icon: '☁️' },
    { name: 'AI/ML Integration', level: 85, icon: '🤖' },
    { name: 'E-commerce', level: 93, icon: '🛒' },
  ]

  return (
    <section id="about" className="min-h-screen py-20 px-6 relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" />

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

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group"
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

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-xl border border-primary/20 hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{skill.icon}</span>
                    <span className="font-semibold text-lg">{skill.name}</span>
                  </div>
                  <span className="text-primary font-bold">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { number: '3+', label: 'Projects Completed' },
            { number: '100%', label: 'Client Satisfaction' },
            { number: '1+', label: 'Years Experience' },
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
