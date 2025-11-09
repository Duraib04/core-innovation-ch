'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiStar, FiHeart, FiZap, FiX } from 'react-icons/fi'
import { useState } from 'react'

export default function Products() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    quantity: '1',
  })

  const handleAddToCart = (productName: string) => {
    setSelectedProduct(productName)
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you can add logic to send the order to your backend
    console.log('Order Details:', {
      product: selectedProduct,
      ...formData,
    })
    alert(`Thank you! Your order for ${selectedProduct} has been received. We will contact you soon!`)
    setShowModal(false)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      quantity: '1',
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const products = [
    {
      name: 'Smart IoT Industry Ecosystem',
      description: 'Connected industrial IoT environment for real-time monitoring, predictive maintenance and energy optimization.',
      price: '₹4,000',
      originalPrice: '₹6,000',
      rating: 4.8,
      reviews: 68,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
      badge: 'Hardware+Software',
      color: 'from-green-500 to-teal-500',
    },
    {
      name: 'IoT Smart Lift Guard',
      description: 'ESP32-based Wi-Fi lift access control with secure portal and password-gated activation.',
      price: '₹1,500',
      originalPrice: '₹2,500',
      rating: 4.7,
      reviews: 142,
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&q=80',
      badge: 'Hardware',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Smart Home Gas Monitoring',
      description: 'AI-driven gas detection with automatic ventilation control and voice command integration.',
      price: '₹6,000',
      originalPrice: '₹8,000',
      rating: 4.8,
      reviews: 213,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
      badge: 'Safety',
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'IoT Smart Door Lock (RFID)',
      description: 'Secure RFID door lock with monitoring, access logs and remote dashboard control.',
      price: '₹500',
      originalPrice: '₹800',
      rating: 4.7,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1505685296765-3a2736de412f?w=1200&q=80',
      badge: 'Security',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'IoT Smart Water Planting Kit',
      description: 'Sensor-driven automated irrigation kit with AI optimizations for plant health.',
      price: '₹500',
      originalPrice: '₹800',
      rating: 4.6,
      reviews: 94,
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=1200&q=80',
      badge: 'Agritech',
      color: 'from-emerald-500 to-green-500',
    },
    {
      name: 'IoT Smart Night Lamp',
      description: 'Ambient-sensing night lamp with IoT controls and customizable scenes.',
      price: '₹400',
      originalPrice: '₹600',
      rating: 4.5,
      reviews: 412,
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80',
      badge: 'Gadget',
      color: 'from-yellow-400 to-orange-500',
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
                    onClick={() => handleAddToCart(product.name)}
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

      {/* Order Form Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-primary/30 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold glow">Order Details</h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="text-2xl" />
                </motion.button>
              </div>

              {/* Product Info */}
              <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-lg font-semibold text-primary">{selectedProduct}</p>
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 bg-gray-900 border border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-900 border border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="House/Flat No, Street, Landmark"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900 border border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-3 bg-gray-900 border border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="6-digit PIN"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                    className="w-full px-4 py-3 bg-gray-900 border border-primary/20 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/50 transition-all text-lg glow-strong"
                >
                  <FiShoppingCart />
                  Place Order
                </motion.button>
              </form>

              <p className="text-sm text-gray-400 text-center mt-4">
                We'll contact you shortly to confirm your order and arrange delivery.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
