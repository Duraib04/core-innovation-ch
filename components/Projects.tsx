'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink, FiStar } from 'react-icons/fi'

export default function Projects() {
  const projects = [
    {
      title: 'Helpio4 — Digital Health Ecosystem',
      description: 'A voice-enabled AI assistant connecting doctors, patients and medical shops. Firebase-powered backend for secure verification, data intelligence and communication flow.',
      image: 'https://images.unsplash.com/photo-1586773860416-70f0f1f1b0b8?w=1200&q=80',
      tags: ['Voice AI', 'Firebase', 'Healthcare', 'Realtime'],
      github: '#',
      demo: '#',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      title: 'Smart IoT Industry Ecosystem',
      description: 'Connected industrial IoT environment enabling real-time monitoring, predictive maintenance and energy optimization via AI analytics and sensor integration.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
      tags: ['IoT', 'AI', 'Sensors', 'Edge'],
      github: '#',
      demo: '#',
      color: 'from-green-500 to-teal-500',
    },
    {
      title: 'IoT Smart Lift Guard',
      description: 'Wi‑Fi enabled lift access system using ESP32 portal and password-gated activation for secure, wireless access control.',
      image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1200&q=80',
      tags: ['ESP32', 'WiFi', 'Access Control', 'Embedded'],
      github: '#',
      demo: '#',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Smart Home Gas Monitoring',
      description: 'AI-driven gas detection and automatic ventilation control with voice commands and IoT automation for home safety.',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
      tags: ['AI', 'Home IoT', 'Safety', 'Voice'],
      github: '#',
      demo: '#',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'IoT Smart Door Lock (RFID)',
      description: 'RFID-based door access system with real-time monitoring, access logging and remote dashboard control with AI alerts.',
      image: 'https://images.unsplash.com/photo-1505685296765-3a2736de412f?w=1200&q=80',
      tags: ['RFID', 'Security', 'Dashboard', 'IoT'],
      github: '#',
      demo: '#',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Billing System (Java)',
      description: 'Java-based billing system featuring automated invoice generation, product tracking and secure transaction storage.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
      tags: ['Java', 'Billing', 'Backend', 'Security'],
      github: '#',
      demo: '#',
      color: 'from-gray-500 to-gray-700',
    },
    {
      title: 'Responsive Portfolio Website',
      description: 'Personal portfolio built with React, Node.js and TypeScript featuring dynamic UI, animations and optimized deployment.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
      tags: ['React', 'TypeScript', 'Next.js', 'Design'],
      github: '#',
      demo: '#',
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'IoT Smart Water Planting',
      description: 'Automated water-planting solution with sensors and AI for optimized irrigation and plant health monitoring.',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80',
      tags: ['Agritech', 'IoT', 'Sensors', 'AI'],
      github: '#',
      demo: '#',
      color: 'from-emerald-500 to-green-500',
    },
    {
      title: 'IoT Smart Night Lamp',
      description: 'Smart night lamp with IoT controls, ambient sensing and customizable scenes via mobile/web app.',
      image: 'https://images.unsplash.com/photo-1505691723518-36a56a7f2f8f?w=1200&q=80',
      tags: ['IoT', 'Lighting', 'Mobile', 'Embedded'],
      github: '#',
      demo: '#',
      color: 'from-yellow-400 to-orange-500',
    },
  ]

  return (
    <section id="projects" className="min-h-screen py-20 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 glow">
            Featured <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Projects</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore my portfolio of innovative solutions that blend creativity with cutting-edge technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-primary/20 hover:border-primary/50 transition-all"
            >
              {/* Image container with hover effect */}
              <div className="relative h-48 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
                
                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <FiStar className="text-yellow-300" />
                  <span className="text-sm font-semibold">Featured</span>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <motion.span
                      key={tagIndex}
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/30"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-4">
                  <motion.a
                    href={project.github}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiGithub />
                    Code
                  </motion.a>
                  <motion.a
                    href={project.demo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all"
                  >
                    <FiExternalLink />
                    Live Demo
                  </motion.a>
                </div>
              </div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-x" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-secondary to-primary animate-gradient-x" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-full text-lg font-semibold glow-strong"
          >
            View All Projects
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
