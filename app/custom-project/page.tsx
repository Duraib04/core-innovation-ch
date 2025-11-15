'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { FiSend, FiMessageCircle, FiFileText, FiMail } from 'react-icons/fi'
import { FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa'
import jsPDF from 'jspdf'

interface Message {
  id: number
  text: string
  sender: 'bot' | 'user'
  timestamp: Date
}

interface ProjectData {
  name: string
  email: string
  phone: string
  projectType: string
  budget: string
  timeline: string
  description: string
  features: string[]
  purpose: string
  targetAudience: string
  inspiration: string
  challenges: string
  additionalNotes: string
}

export default function CustomProjectPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! 👋 I'm here to help you bring your dream project to life. I'll ask you some questions to truly understand your vision. Let's start - what's your name?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [projectData, setProjectData] = useState<Partial<ProjectData>>({
    features: [],
  })
  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSendOptions, setShowSendOptions] = useState(false)
  const [projectNumber, setProjectNumber] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const conversationFlow = [
    {
      question: "Nice to meet you, {name}! 😊 What's the best email address to reach you?",
      field: 'email',
      validation: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      errorMsg: 'Please provide a valid email address.',
    },
    {
      question: "Great! And your phone number? (So I can call you if needed)",
      field: 'phone',
      validation: (value: string) => /^\d{10}$/.test(value.replace(/\D/g, '')),
      errorMsg: 'Please provide a valid 10-digit phone number.',
    },
    {
      question: "Perfect! Now, let's talk about your project. 🚀\n\nWhat type of project are you envisioning?\n\n• IoT Smart Device\n• Web Application\n• Mobile App\n• Hardware + Software Solution\n• Other (tell me!)",
      field: 'projectType',
    },
    {
      question: "Interesting! Now tell me - what problem does this project solve? What inspired you to think of this idea? 💡",
      field: 'purpose',
    },
    {
      question: "I love it! Who will be using this? Describe your target audience or users. 👥",
      field: 'targetAudience',
    },
    {
      question: "Got it! Now, let's dream big - describe your project in detail. What should it do? How should it work? Don't hold back! 🌟",
      field: 'description',
    },
    {
      question: "Excellent vision! What are the MUST-HAVE features? List them one by one, separated by commas.\n\nFor example: 'Real-time notifications, User dashboard, Mobile responsive'",
      field: 'features',
      process: (value: string) => value.split(',').map(f => f.trim()).filter(f => f),
    },
    {
      question: "Do you have any existing solutions or projects that inspire you? Share any reference websites, apps, or ideas! 🎨",
      field: 'inspiration',
    },
    {
      question: "What challenges or concerns do you foresee? Any technical constraints or worries? (It's okay to say 'not sure' too!) 🤔",
      field: 'challenges',
    },
    {
      question: "Almost done! What's your estimated budget range?\n\n• Under ₹10,000\n• ₹10,000 - ₹25,000\n• ₹25,000 - ₹50,000\n• ₹50,000+\n• Open to discussion",
      field: 'budget',
    },
    {
      question: "When would you like this project completed?\n\n• ASAP (1-2 weeks)\n• 1 month\n• 2-3 months\n• Flexible\n• Not urgent",
      field: 'timeline',
    },
    {
      question: "Last question! Anything else you'd like to add? Any special requirements, preferences, or questions for me? 📝",
      field: 'additionalNotes',
    },
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])
  }

  const simulateTyping = (callback: () => void, delay = 1000) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      callback()
    }, delay)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue.trim()
    addMessage(userMessage, 'user')
    setInputValue('')

    const currentQuestion = conversationFlow[currentStep]

    // Validation
    if (currentQuestion.validation && !currentQuestion.validation(userMessage)) {
      simulateTyping(() => {
        addMessage(currentQuestion.errorMsg || 'Invalid input. Please try again.', 'bot')
      }, 800)
      return
    }

    // Process and store data
    const processedValue = currentQuestion.process
      ? currentQuestion.process(userMessage)
      : userMessage

    setProjectData(prev => ({
      ...prev,
      [currentQuestion.field]: processedValue,
    }))

    // Move to next question
    if (currentStep < conversationFlow.length - 1) {
      simulateTyping(() => {
        let nextQuestion = conversationFlow[currentStep + 1].question
        // Replace {name} placeholder
        if (currentStep === 0) {
          nextQuestion = nextQuestion.replace('{name}', userMessage)
        }
        addMessage(nextQuestion, 'bot')
        setCurrentStep(prev => prev + 1)
      }, 1200)
    } else {
      // All questions answered - generate and send document
      simulateTyping(() => {
        addMessage(
          "🎉 Awesome! I have everything I need. Let me create a detailed project proposal document for you...",
          'bot'
        )
        setTimeout(() => {
          generateAndSendDocument()
        }, 2000)
      }, 1000)
    }
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    const data = projectData as ProjectData

    // Header
    doc.setFillColor(99, 102, 241)
    doc.rect(0, 0, 210, 45, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(26)
    doc.text('CUSTOM PROJECT PROPOSAL', 105, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.text('Core Innovation - Turning Ideas into Reality', 105, 30, { align: 'center' })
    doc.setFontSize(9)
    doc.text('itsdurai4@gmail.com | +91 6369704741', 105, 37, { align: 'center' })

    let yPos = 55

    // Client Information
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Client Information', 20, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Name: ${data.name}`, 20, yPos)
    yPos += 6
    doc.text(`Email: ${data.email}`, 20, yPos)
    yPos += 6
    doc.text(`Phone: ${data.phone}`, 20, yPos)
    yPos += 10

    // Project Overview
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Project Overview', 20, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Type: ${data.projectType}`, 20, yPos)
    yPos += 6
    doc.text(`Budget: ${data.budget}`, 20, yPos)
    yPos += 6
    doc.text(`Timeline: ${data.timeline}`, 20, yPos)
    yPos += 10

    // Purpose & Inspiration
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Purpose & Motivation', 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const purposeLines = doc.splitTextToSize(data.purpose, 170)
    doc.text(purposeLines, 20, yPos)
    yPos += purposeLines.length * 5 + 5

    // Target Audience
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Target Audience', 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const audienceLines = doc.splitTextToSize(data.targetAudience, 170)
    doc.text(audienceLines, 20, yPos)
    yPos += audienceLines.length * 5 + 5

    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    // Project Description
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Detailed Description', 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const descLines = doc.splitTextToSize(data.description, 170)
    doc.text(descLines, 20, yPos)
    yPos += descLines.length * 5 + 5

    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    // Key Features
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Key Features', 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    data.features?.forEach((feature, index) => {
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
      doc.text(`${index + 1}. ${feature}`, 25, yPos)
      yPos += 6
    })
    yPos += 5

    // Inspiration
    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Inspiration & References', 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const inspLines = doc.splitTextToSize(data.inspiration, 170)
    doc.text(inspLines, 20, yPos)
    yPos += inspLines.length * 5 + 5

    // Challenges
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Potential Challenges', 20, yPos)
    yPos += 7

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const chalLines = doc.splitTextToSize(data.challenges, 170)
    doc.text(chalLines, 20, yPos)
    yPos += chalLines.length * 5 + 5

    // Additional Notes
    if (data.additionalNotes) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Additional Notes', 20, yPos)
      yPos += 7

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const notesLines = doc.splitTextToSize(data.additionalNotes, 170)
      doc.text(notesLines, 20, yPos)
    }

    // Footer on last page
    const pageCount = doc.getNumberOfPages()
    doc.setPage(pageCount)
    doc.setFillColor(99, 102, 241)
    doc.rect(0, 277, 210, 20, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.text(
      'Thank you for considering Core Innovation! We will review your proposal and contact you within 24 hours.',
      105,
      287,
      { align: 'center' }
    )

    return doc
  }

  const handleSendViaWhatsApp = () => {
    const data = projectData as ProjectData
    const message = `Hi! I'd like to request a custom project:\n\n` +
      `Project #: ${projectNumber}\n` +
      `Name: ${data.name}\n` +
      `Email: ${data.email}\n` +
      `Phone: ${data.phone}\n\n` +
      `Project Type: ${data.projectType}\n` +
      `Budget: ${data.budget}\n` +
      `Timeline: ${data.timeline}\n\n` +
      `Purpose: ${data.purpose}\n\n` +
      `I've downloaded the detailed project proposal PDF. Please review and get back to me!`
    
    window.open(`https://wa.me/916369704741?text=${encodeURIComponent(message)}`, '_blank')
    setShowSendOptions(false)
  }

  const handleSendViaMessenger = () => {
    window.open('https://m.me/durai.b.473058323', '_blank')
    setShowSendOptions(false)
  }

  const handleSendViaGmail = () => {
    const data = projectData as ProjectData
    const subject = `Custom Project Request - ${data.projectType} - ${projectNumber}`
    const body = `Hi,\n\nI'd like to request a custom project:\n\n` +
      `Project #: ${projectNumber}\n` +
      `Name: ${data.name}\n` +
      `Email: ${data.email}\n` +
      `Phone: ${data.phone}\n\n` +
      `Project Details:\n` +
      `Type: ${data.projectType}\n` +
      `Budget: ${data.budget}\n` +
      `Timeline: ${data.timeline}\n\n` +
      `Purpose: ${data.purpose}\n` +
      `Target Audience: ${data.targetAudience}\n\n` +
      `Description: ${data.description}\n\n` +
      `Key Features: ${data.features?.join(', ')}\n\n` +
      `Inspiration: ${data.inspiration}\n` +
      `Challenges: ${data.challenges}\n\n` +
      `Additional Notes: ${data.additionalNotes || 'None'}\n\n` +
      `I've attached the detailed project proposal PDF.\n\nPlease review and get back to me with a quote.\n\nThank you!`
    
    window.open(`mailto:itsdurai4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank')
    setShowSendOptions(false)
  }

  const generateAndSendDocument = async () => {
    setIsSubmitting(true)

    try {
      const pdf = generatePDF()
      const data = projectData as ProjectData
      const projNum = `PROJ-${Date.now()}`
      setProjectNumber(projNum)

      // Download PDF for client
      const fileName = `Project-Proposal-${data.name.replace(/\s+/g, '-')}-${projNum}.pdf`
      pdf.save(fileName)

      // Show send options
      setShowSendOptions(true)

      addMessage(
        `✅ Perfect! Your detailed project proposal has been created!\n\n📥 PDF Downloaded: ${fileName}\n\n🚀 Choose how you'd like to send it to us using the options above!\n\nProject #: ${projNum}`,
        'bot'
      )
    } catch (error) {
      console.error('Error:', error)
      addMessage(
        `⚠️ Oops! There was an issue generating the PDF.\n\n📞 No worries! Please contact us directly:\n\n📧 Email: itsdurai4@gmail.com\n📱 Phone: +91 6369704741\n💬 WhatsApp: +91 6369704741\n\nPlease share these details:\n\n👤 Name: ${projectData.name}\n📧 Email: ${projectData.email}\n📱 Phone: ${projectData.phone}\n🎯 Project Type: ${projectData.projectType}\n💰 Budget: ${projectData.budget}\n⏰ Timeline: ${projectData.timeline}\n\nWe'll get back to you within 24 hours!`,
        'bot'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 glow">
            Custom Project <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Request</span>
          </h1>
          <p className="text-gray-300 text-lg">
            Let's create something amazing together! Chat with our AI assistant to design your perfect project.
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-primary/30 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="h-[500px] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-gray-800"
          >
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white'
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
                      className="w-2 h-2 bg-secondary rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, delay: 0.4, repeat: Infinity }}
                      className="w-2 h-2 bg-accent rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {isSubmitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <div className="bg-primary/20 border border-primary/50 rounded-2xl px-6 py-4 flex items-center gap-3">
                  <FiFileText className="text-2xl text-primary animate-pulse" />
                  <span>Generating your project proposal...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-800 p-4 bg-gray-900/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isSubmitting || isTyping}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={isSubmitting || isTyping || !inputValue.trim()}
                className="px-6 py-3 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiSend />
                Send
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-primary/30 rounded-xl p-4 text-center"
          >
            <FiMessageCircle className="text-3xl text-primary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">AI-Powered</h3>
            <p className="text-sm text-gray-400">Smart questions to understand your needs</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-secondary/30 rounded-xl p-4 text-center"
          >
            <FiFileText className="text-3xl text-secondary mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Detailed Proposal</h3>
            <p className="text-sm text-gray-400">Professional PDF document generated</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-accent/30 rounded-xl p-4 text-center"
          >
            <FiMail className="text-3xl text-accent mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Instant Delivery</h3>
            <p className="text-sm text-gray-400">Sent to you and our team automatically</p>
          </motion.div>
        </div>
      </div>

      {/* Send Options Modal */}
      <AnimatePresence>
        {showSendOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-primary/30 rounded-2xl p-8 max-w-lg w-full"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                className="text-center mb-6"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-4xl"
                  >
                    ✓
                  </motion.div>
                </div>
                <h3 className="text-3xl font-bold text-green-400 mb-2">Proposal Ready! 🎉</h3>
                <p className="text-gray-300">Project #{projectNumber}</p>
                <p className="text-sm text-gray-400 mt-2">PDF downloaded successfully!</p>
              </motion.div>

              {/* Send Options */}
              <div className="space-y-4 mb-6">
                <p className="text-center text-lg font-semibold mb-4">Send your proposal via:</p>
                
                {/* WhatsApp */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendViaWhatsApp}
                  className="w-full flex items-center gap-4 p-4 bg-green-600 hover:bg-green-500 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <FaWhatsapp className="text-3xl text-green-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-lg">WhatsApp</p>
                    <p className="text-sm text-green-100">Send to +91 6369704741</p>
                  </div>
                  <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                </motion.button>

                {/* Messenger */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendViaMessenger}
                  className="w-full flex items-center gap-4 p-4 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <FaFacebookMessenger className="text-3xl text-blue-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-lg">Messenger</p>
                    <p className="text-sm text-blue-100">Chat on Facebook</p>
                  </div>
                  <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                </motion.button>

                {/* Gmail */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendViaGmail}
                  className="w-full flex items-center gap-4 p-4 bg-red-600 hover:bg-red-500 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <FiMail className="text-3xl text-red-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-lg">Gmail</p>
                    <p className="text-sm text-red-100">Email to itsdurai4@gmail.com</p>
                  </div>
                  <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                </motion.button>
              </div>

              {/* Skip Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSendOptions(false)}
                className="w-full py-3 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg transition-all"
              >
                I&apos;ll send it later
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
