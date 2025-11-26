import ProductPage from '@/components/ProductPage'

export const metadata = {
  title: 'Smart IoT Industry Ecosystem - Core Innovation',
  description: 'Centralized IoT control platform for multi-vendor industrial equipment with real-time monitoring, analytics, and predictive maintenance',
}

const product = {
  id: 'smart-iot-industry-ecosystem',
  name: 'Smart IoT Industry Ecosystem',
  description: 'Centralized IoT control platform for multi-vendor industrial equipment',
  longDescription: 'Revolutionary centralized control system that seamlessly integrates and manages IoT devices from multiple manufacturers. Perfect for industrial environments requiring unified monitoring, control, and analytics across diverse equipment ecosystems.',
  price: '₹4,000',
  originalPrice: '₹6,000',
  discount: '33%',
  rating: 4.8,
  reviews: 156,
  image: '/images/industry-ecosystem.jpg',
  images: [
    '/images/industry-ecosystem.jpg',
    '/images/industry-ecosystem-2.jpg',
    '/images/industry-ecosystem-3.jpg',
    '/images/industry-ecosystem-4.jpg',
  ],
  badge: 'BEST SELLER',
  color: 'from-purple-500 to-pink-500',
  inStock: true,
  features: [
    'Multi-vendor device integration & compatibility',
    'Real-time monitoring dashboard with live data streams',
    'Advanced analytics & predictive maintenance AI',
    'Cloud-based centralized control system',
    'Automated alerts & notification system',
    'Custom rule engine for workflow automation',
    'Energy consumption optimization',
    'Scalable architecture supporting 1000+ devices',
  ],
  specifications: {
    'Platform': 'Web & Mobile App',
    'Protocol Support': 'MQTT, HTTP, CoAP, Modbus',
    'Cloud Storage': '100 GB included',
    'API Access': 'RESTful API included',
    'User Accounts': 'Up to 50 users',
    'Data Retention': '1 year historical data',
    'Support': '24/7 technical support',
    'Updates': 'Lifetime free updates',
  },
}

export default function SmartIoTIndustryEcosystem() {
  return <ProductPage product={product} />
}
