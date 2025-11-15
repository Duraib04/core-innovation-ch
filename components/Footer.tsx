'use client'

import { motion } from 'framer-motion'
import { FiHeart } from 'react-icons/fi'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    Services: ['Web Development', 'Mobile Apps', 'UI/UX Design', 'Consulting'],
    Products: ['UI Kits', 'Templates', 'Plugins', 'Tools'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Licenses'],
  }

  return (
    <footer className="relative bg-gradient-to-b from-black to-gray-900 py-16 px-6 border-t border-primary/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.h3
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold mb-4 glow cursor-pointer"
            >
              DURAI
            </motion.h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Crafting exceptional digital experiences with passion, precision, and cutting-edge technology.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <span>Made with</span>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <FiHeart className="text-accent fill-accent" />
              </motion.div>
              <span>by Durai</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold mb-4 text-primary">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 5, color: '#6366f1' }}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Durai. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <motion.a href="#" whileHover={{ color: '#6366f1' }} className="hover:text-primary transition-colors">
                Privacy
              </motion.a>
              <motion.a href="#" whileHover={{ color: '#6366f1' }} className="hover:text-primary transition-colors">
                Terms
              </motion.a>
              <motion.a href="#" whileHover={{ color: '#6366f1' }} className="hover:text-primary transition-colors">
                Cookies
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
    </footer>
  )
}
