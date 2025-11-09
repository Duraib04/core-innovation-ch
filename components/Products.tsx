'use client'

import { motion } from 'framer-motion'
import { FiShoppingCart, FiStar, FiHeart, FiZap } from 'react-icons/fi'
import { useState } from 'react'

export default function Products() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const products = [
    {
      name: 'Helpio4 — Digital Health Ecosystem',
      description: 'Voice-enabled AI assistant with Firebase backend for doctor/patient/shop workflows, secure verification and realtime communication.',
      price: 'Custom',
      originalPrice: '',
      rating: 4.9,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1586773860416-70f0f1f1b0b8?w=1200&q=80',
      badge: 'Product',
      color: 'from-indigo-500 to-blue-500',
    },
    {
      name: 'Industrial IoT Suite',
      description: 'Smart IoT Industry Ecosystem for real-time monitoring, predictive maintenance and energy optimization.',
      price: 'Enterprise',
      originalPrice: '',
      rating: 4.8,
      reviews: 68,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
      badge: 'Hardware+Software',
      color: 'from-green-500 to-teal-500',
    },
    {
      name: 'IoT Smart Lift Guard',
      description: 'ESP32-based Wi-Fi lift access control with secure portal and password-gated activation.',
      price: '$299',
      originalPrice: '$399',
      rating: 4.7,
      reviews: 142,
      image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1200&q=80',
      badge: 'Hardware',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Smart Home Gas Monitoring',
      description: 'AI-driven gas detection with automatic ventilation control and voice command integration.',
      price: '$189',
      originalPrice: '$299',
      rating: 4.8,
      reviews: 213,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
      badge: 'Safety',
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'IoT Smart Door Lock (RFID)',
      description: 'Secure RFID door lock with monitoring, access logs and remote dashboard control.',
      price: '$159',
      originalPrice: '$249',
      rating: 4.7,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1505685296765-3a2736de412f?w=1200&q=80',
      badge: 'Security',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'IoT Smart Water Planting Kit',
      description: 'Sensor-driven automated irrigation kit with AI optimizations for plant health.',
      price: '$129',
      originalPrice: '$199',
      rating: 4.6,
      reviews: 94,
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80',
      badge: 'Agritech',
      color: 'from-emerald-500 to-green-500',
    },
    {
      name: 'IoT Smart Night Lamp',
      description: 'Ambient-sensing night lamp with IoT controls and customizable scenes.',
      price: '$49',
      originalPrice: '$79',
      rating: 4.5,
      reviews: 412,
      image: 'https://images.unsplash.com/photo-1505691723518-36a56a7f2f8f?w=1200&q=80',
      badge: 'Gadget',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      name: 'Billing System (Java)',
      description: 'Java billing application with invoice automation, product tracking and secure storage.',
      price: 'Custom',
      originalPrice: '',
      rating: 4.6,
      reviews: 74,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
      badge: 'Software',
      color: 'from-gray-500 to-gray-700',
    },
    {
      name: 'Responsive Portfolio Website',
      description: 'Ready-to-deploy responsive portfolio (React + Next.js + TypeScript) with animations.',
      price: '$79',
      originalPrice: '$149',
      rating: 4.9,
      reviews: 120,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
      badge: 'Website',
      color: 'from-pink-500 to-rose-500',
    },
  ]

  return (
    <section id="products" className="min-h-screen py-20 px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-secondary/5 to-transparent rounded-full blur-3xl"
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
            Premium <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional-grade tools and resources designed to accelerate your development workflow
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -15 }}
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border border-primary/20 hover:border-primary/50 transition-all h-full"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    animate={{
                      scale: hoveredIndex === index ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-40`} />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FiZap className="text-yellow-400" />
                    {product.badge}
                  </div>

                  {/* Wishlist button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary/70 transition-colors"
                  >
                    <FiHeart />
                  </motion.button>

                  {/* Discount tag */}
                  <div className="absolute bottom-4 right-4 bg-accent/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                    -50% OFF
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-400">
                      {product.rating} ({product.reviews.toLocaleString()} reviews)
                    </span>
                  </div>

                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-primary">
                      {product.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/50 transition-all"
                  >
                    <FiShoppingCart />
                    Add to Cart
                  </motion.button>
                </div>

                {/* Glow effect on hover */}
                <motion.div
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                  className={`absolute inset-0 bg-gradient-to-r ${product.color} opacity-0 blur-2xl -z-10`}
                />
              </motion.div>
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
            Browse All Products
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
