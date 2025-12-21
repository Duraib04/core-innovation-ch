import ProductPage from '@/components/ProductPage'

export const metadata = {
  title: 'Real-Time Chat Website - Core Innovation',
  description: 'Full-featured chat application with real-time messaging, file sharing, video calls, and end-to-end encryption',
}

const product = {
  id: 'real-time-chat-website',
  name: 'Real-Time Chat Website',
  description: 'Full-featured chat application with real-time messaging and collaboration',
  longDescription: '⚡ DEMO PRICE OFFER! Professional-grade real-time chat platform with instant messaging, file sharing, video/audio calls, group chats, and end-to-end encryption. Perfect for businesses, communities, or personal projects. Fully customizable and scalable.',
  price: '₹1',
  originalPrice: '₹5,000',
  discount: '99.98%',
  rating: 4.9,
  reviews: 67,
  image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=1200&q=80',
  images: [
    'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=1200&q=80',
    'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=1200&q=80&sat=-20',
    'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=1200&q=80&sat=20',
    'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=1200&q=80&blur=5',
  ],
  badge: '🎯 DEMO OFFER',
  color: 'from-pink-500 to-rose-500',
  inStock: true,
  features: [
    'Real-time messaging with WebSocket technology',
    'Group chats & private conversations',
    'File sharing (images, documents, videos)',
    'Video & audio calling (1-on-1 & group)',
    'End-to-end encryption for security',
    'User authentication & profiles',
    'Message search & chat history',
    'Mobile responsive design',
    'Admin dashboard & moderation tools',
    'Custom themes & branding options',
    'API for integration with other systems',
    'Scalable cloud architecture',
  ],
  specifications: {
    'Technology': 'React, Node.js, WebSocket',
    'Database': 'MongoDB',
    'Hosting': '1 year free hosting included',
    'Users': 'Unlimited users',
    'Storage': '10 GB cloud storage',
    'Video Quality': 'Up to 1080p HD',
    'API Access': 'Full REST API',
    'Support': '6 months free support',
  },
}

export default function RealTimeChatWebsite() {
  return <ProductPage product={product} />
}
