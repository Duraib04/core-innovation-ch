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

      <div className="w-full px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 glow">
            About <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">DD-SHOP</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your trusted source for <strong>IoT products</strong>, <strong>ready-made projects</strong>, <strong>software solutions</strong>, and <strong>custom development services</strong>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative group mb-20 max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-primary/20">
            <h3 className="text-3xl font-bold mb-6 glow">What We Offer</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-3xl">🛒</span>
                <div>
                  <h4 className="text-xl font-bold text-primary mb-2">IoT Products for Sale</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Browse our collection of ready-to-use IoT devices, smart home products, ESP32/Arduino-based solutions, and industry-grade automation hardware. Buy quality IoT products with reliable support.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-3xl">📦</span>
                <div>
                  <h4 className="text-xl font-bold text-secondary mb-2">Ready-Made Projects</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Complete IoT project solutions for home automation, Industry 4.0, RFID systems, gas monitoring, and smart devices. Plug-and-play projects with full documentation and support.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-3xl">⚙️</span>
                <div>
                  <h4 className="text-xl font-bold text-accent mb-2">Custom Development Services</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Need something specific? We design and build custom IoT hardware and software tailored to your exact requirements. From concept to deployment, we bring your ideas to life.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-3xl">💻</span>
                <div>
                  <h4 className="text-xl font-bold text-primary mb-2">Software Development</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Professional web development, mobile applications, e-commerce solutions, and cloud integration. Modern tech stack with seamless user experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20 max-w-5xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-emerald-400/30">
            <h3 className="text-3xl font-bold mb-4 text-emerald-300">Government Registration & Trust</h3>
            <p className="text-gray-200 leading-relaxed mb-4">
              DD IOT SOLUTIONS is officially registered under the Government of India MSME/Udyam program.
            </p>
            <div className="space-y-2 text-gray-300">
              <p><span className="text-white font-semibold">Legal Business Name:</span> DD IOT SOLUTIONS</p>
              <p><span className="text-white font-semibold">MSME/Udyam Registration Number:</span> UDYAM-TN-04-0124631</p>
              <p><span className="text-white font-semibold">Founder & IoT Engineer:</span> DURAI B</p>
            </div>
            <a
              href="/certificates/DD-IOT-SOLUTION-GOVT-CERTIFICATE.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center mt-6 px-5 py-3 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/30 transition-colors"
            >
              View Government Registration Certificate (PDF)
            </a>
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
