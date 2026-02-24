'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa'
import Image from 'next/image'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [showContactMenu, setShowContactMenu] = useState(false)
  const [showLogoIntro, setShowLogoIntro] = useState(false)
  const [customerSession, setCustomerSession] = useState<{ name?: string; email?: string } | null>(null)
  const pathname = usePathname()

  const handleWhatsApp = () => {
    const phoneNumber = '916369704741'
    const message = encodeURIComponent('Hi! I am interested in your products/services.')
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  const handleMessenger = () => {
    window.open('https://m.me/durai.b.473058323', '_blank')
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
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

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/customer/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'session' })
        })
        const data = await res.json()
        if (res.ok && data.authenticated) {
          setCustomerSession(data.user)
        } else {
          setCustomerSession(null)
        }
      } catch {
        setCustomerSession(null)
      }
    }
    fetchSession()
  }, [])

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <>
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-lg shadow-lg shadow-primary/10'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Home">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer flex items-center overflow-hidden rounded-xl"
              >
                {/* Mobile: brief logo */}
                <Image
                  src="/images/logo-brief.jpeg"
                  alt="DD-SHOP brief logo"
                  width={180}
                  height={54}
                  className="md:hidden h-14 sm:h-16 w-auto object-contain mix-blend-multiply"
                  priority
                />
                {/* Desktop: full logo */}
                <Image
                  src="/images/logo.jpeg"
                  alt="DD-SHOP logo"
                  width={280}
                  height={70}
                  className="hidden md:block h-16 lg:h-20 w-auto object-contain mix-blend-multiply"
                  priority
                />
              </motion.div>
            </Link>
            {/* Intro button removed; logo click opens intro modal */}
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link key={item.path} href={item.path}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    pathname === item.path ? 'text-primary' : 'text-gray-300'
                  }`}
                >
                  {item.name}
                  {pathname === item.path && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Customer Auth + Let's Talk */}
          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
            {/* Customer auth buttons / profile */}
            {customerSession ? (
              <Link href="/customer/profile" aria-label="Customer Profile">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full font-semibold text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                >
                  Profile
                </motion.button>
              </Link>
            ) : (
              <>
                <Link href="/customer/login" aria-label="Customer Login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full font-semibold text-sm bg-gray-800 text-gray-200 border border-gray-700 hover:border-primary/60 hover:text-white transition-colors"
                  >
                    Customer Login
                  </motion.button>
                </Link>
                <Link href="/customer/signup" aria-label="Customer Signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full font-semibold text-sm bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </>
            )}

            {/* Let's Talk Button with Dropdown */}
            <div className="relative contact-menu-container">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowContactMenu(!showContactMenu)}
              className="px-4 md:px-6 py-2 bg-blue-600 text-white rounded-full font-semibold text-xs md:text-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Chat
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
      </div>
    </motion.nav>

    {/* Logo Intro Modal removed so logo is always visible and not interactive */}
    </>
  )
}

// Logo Intro Modal
// Rendered at the end to avoid layout shifts
