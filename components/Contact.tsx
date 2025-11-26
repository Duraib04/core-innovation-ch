'use client'

import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiSend, FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi'
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa'
import { useState } from 'react'
import VideoBackground from './VideoBackground'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Web3Forms - 100% FREE contact form API
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: 'Core Innovation Contact Form',
          replyto: formData.email,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setSubmitStatus('idle'), 5000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: <FiMail className="text-2xl" />,
      title: 'Email',
      value: 'itsdurai4@gmail.com',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <FiPhone className="text-2xl" />,
      title: 'Phone',
      value: '+91 6369704741',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <FiMapPin className="text-2xl" />,
      title: 'Location',
      value: 'KSRCE, Namakkal, Tamil Nadu',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const socialLinks = [
    { icon: <FiTwitter />, url: 'https://x.com/Durai4444', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: <FiGithub />, url: 'https://github.com/DD4universe', label: 'GitHub', color: 'hover:text-gray-400' },
    { icon: <FiLinkedin />, url: 'https://www.linkedin.com/in/durai-b-473058323/', label: 'LinkedIn', color: 'hover:text-blue-600' },
  ]

  return (
    <section className="min-h-screen py-20 px-6 relative overflow-hidden">
      <VideoBackground opacity={0.2} />
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 glow">
            Get In <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Let&apos;s discuss your next project and bring your ideas to life
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold mb-6 glow">Let&apos;s Talk</h3>
              <p className="text-gray-300 mb-8">
                Have a project in mind? I&apos;m always open to discussing new opportunities
                and creative collaborations. Feel free to reach out!
              </p>
              
              {/* Custom Project CTA */}
              <motion.a
                href="/custom-project"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all mb-8"
              >
                <span className="text-2xl">🎯</span>
                <div>
                  <div className="font-bold">Need a Custom Project?</div>
                  <div className="text-sm text-white/80">Chat with our AI assistant</div>
                </div>
              </motion.a>
            </div>

            {/* Contact cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="group relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-primary/20 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${info.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{info.title}</div>
                      <div className="text-lg font-semibold">{info.value}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-xl font-semibold mb-4">Follow Me</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-xl ${social.color} transition-colors border border-gray-700 hover:border-primary`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="space-y-3 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-400 mb-3">Quick Connect:</p>
              <motion.a
                href="https://wa.me/916369704741?text=Hi!%20I%20am%20interested%20in%20your%20products/services."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-600 to-green-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all group"
              >
                <FaWhatsapp className="text-2xl" />
                <span>Chat on WhatsApp</span>
              </motion.a>

              <motion.a
                href="https://m.me/durai.b.473058323"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all group"
              >
                <FaFacebookMessenger className="text-2xl" />
                <span>Chat on Messenger</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Your name"
                  />
                </motion.div>

                <motion.div whileFocus={{ scale: 1.02 }}>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="your@email.com"
                  />
                </motion.div>
              </div>

              <motion.div whileFocus={{ scale: 1.02 }}>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="How can I help you?"
                />
              </motion.div>

              <motion.div whileFocus={{ scale: 1.02 }}>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-900 border border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="Tell me about your project..."
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                  isSubmitting 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : submitStatus === 'success'
                    ? 'bg-green-600 hover:bg-green-700'
                    : submitStatus === 'error'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    ✓ Message Sent!
                  </>
                ) : submitStatus === 'error' ? (
                  <>
                    ✗ Failed - Try Again
                  </>
                ) : (
                  <>
                    <FiSend />
                    Send Message (FREE via Web3Forms)
                  </>
                )}
              </motion.button>

              {submitStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-green-400 text-sm"
                >
                  Thank you! I&apos;ll get back to you soon.
                </motion.p>
              )}

              {submitStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-red-400 text-sm"
                >
                  Oops! Something went wrong. Please try WhatsApp or email directly.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
