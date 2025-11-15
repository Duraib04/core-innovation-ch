'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [showContactMenu, setShowContactMenu] = useState(false)

  const handleWhatsApp = () => {
    const phoneNumber = '916369704741' // Your number without + or spaces
    const message = encodeURIComponent('Hi! I am interested in your products/services.')
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  const handleMessenger = () => {
    // Replace with your Facebook Page ID or username
    window.open('https://m.me/durai.b.473058323', '_blank')
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      
      const sections = ['home', 'about', 'projects', 'products', 'contact']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.contact-menu-container')) {
        setShowContactMenu(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Projects', id: 'projects' },
    { name: 'Products', id: 'products' },
    { name: 'Contact', id: 'contact' },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-lg shadow-lg shadow-primary/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold glow cursor-pointer"
          >
            DURAI
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  activeSection === item.id ? 'text-primary' : 'text-gray-300'
                }`}
              >
                {item.name}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Let's Talk Button with Dropdown */}
          <div className="relative contact-menu-container">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowContactMenu(!showContactMenu)}
              className="px-6 py-2 bg-gradient-to-r from-primary via-secondary to-accent rounded-full font-semibold glow-strong"
            >
              Let&apos;s Talk
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showContactMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-900 border border-primary/30 rounded-lg shadow-xl overflow-hidden z-50"
                >
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                    onClick={() => {
                      handleWhatsApp()
                      setShowContactMenu(false)
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:text-green-400 transition-colors"
                  >
                    <FaWhatsapp className="text-xl text-green-500" />
                    <span>WhatsApp</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    onClick={() => {
                      handleMessenger()
                      setShowContactMenu(false)
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 text-left hover:text-blue-400 transition-colors border-t border-gray-800"
                  >
                    <FaFacebookMessenger className="text-xl text-blue-500" />
                    <span>Messenger</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
