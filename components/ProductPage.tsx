'use client'

import { motion } from 'framer-motion'
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'

interface ProductPageProps {
  product: {
    id: string
    name: string
    description: string
    longDescription: string
    price: string
    originalPrice: string
    discount: string
    rating: number
    reviews: number
    image: string
    images: string[]
    badge: string
    color: string
    features: string[]
    specifications: { [key: string]: string }
    inStock: boolean
  }
}

export default function ProductPage({ product }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const handleBuyNow = () => {
    // Scroll to order form or open modal
    window.location.href = `/products?order=${product.id}`
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-primary/20"
              >
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className={`absolute top-4 left-4 px-4 py-2 bg-gradient-to-r ${product.color} rounded-full text-sm font-bold`}>
                  {product.badge}
                </div>
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-500">Out of Stock</span>
                  </div>
                )}
              </motion.div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-gray-700'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" sizes="150px" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${
                          i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-lg font-semibold">{product.rating}</span>
                  </div>
                  <span className="text-gray-400">({product.reviews} reviews)</span>
                </div>
              </div>

              <p className="text-gray-300 text-lg">{product.longDescription}</p>

              {/* Price */}
              <div className="py-6 border-y border-gray-800">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-bold text-primary">{product.price}</span>
                  <span className="text-2xl text-gray-500 line-through">{product.originalPrice}</span>
                  <span className="text-2xl text-green-400 font-semibold">{product.discount} OFF</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Inclusive of all taxes</p>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-16 text-center text-xl font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className={`flex-1 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 ${
                      product.inStock
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                        : 'bg-gray-700 cursor-not-allowed'
                    }`}
                  >
                    <FiShoppingCart />
                    {product.inStock ? 'Buy Now' : 'Out of Stock'}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FiHeart className="text-2xl" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <FiShare2 className="text-2xl" />
                  </motion.button>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <FiTruck className="text-3xl text-primary mb-2" />
                  <span className="text-sm text-center">Free Delivery</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <FiShield className="text-3xl text-green-400 mb-2" />
                  <span className="text-sm text-center">1 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <FiRefreshCw className="text-3xl text-blue-400 mb-2" />
                  <span className="text-sm text-center">7 Days Return</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features & Specifications */}
          <div className="mt-16 grid lg:grid-cols-2 gap-8">
            {/* Features */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <h2 className="text-3xl font-bold mb-6 text-primary">Key Features</h2>
              <ul className="space-y-4">
                {product.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-primary text-xl mt-1">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
              <h2 className="text-3xl font-bold mb-6 text-primary">Specifications</h2>
              <div className="space-y-4">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between py-3 border-b border-gray-800"
                  >
                    <span className="text-gray-400">{key}</span>
                    <span className="text-white font-semibold">{value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="text-center text-gray-400">
              <Link href="/products" className="text-primary hover:underline">View all products →</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
