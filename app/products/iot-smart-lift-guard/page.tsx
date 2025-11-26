import ProductPage from '@/components/ProductPage'

export const metadata = {
  title: 'IoT Smart Lift Guard - Core Innovation',
  description: 'Advanced elevator monitoring system with predictive maintenance, safety sensors, and real-time diagnostics for lift management',
}

const product = {
  id: 'iot-smart-lift-guard',
  name: 'IoT Smart Lift Guard',
  description: 'Advanced elevator monitoring system with predictive maintenance',
  longDescription: 'Comprehensive elevator safety and monitoring solution that uses IoT sensors to track lift performance, detect anomalies, and predict maintenance needs before failures occur. Ensures passenger safety and minimizes downtime.',
  price: '₹1,500',
  originalPrice: '₹2,500',
  discount: '40%',
  rating: 4.7,
  reviews: 89,
  image: '/images/lift-guard.jpg',
  images: [
    '/images/lift-guard.jpg',
    '/images/lift-guard-2.jpg',
    '/images/lift-guard-3.jpg',
    '/images/lift-guard-4.jpg',
  ],
  badge: 'HOT SALE',
  color: 'from-orange-500 to-red-500',
  inStock: true,
  features: [
    'Real-time lift performance monitoring',
    'Predictive maintenance alerts',
    'Emergency notification system',
    'Door sensor monitoring for safety',
    'Overload detection & prevention',
    'Remote diagnostics & troubleshooting',
    'Usage analytics & reporting',
    'Mobile app for instant alerts',
  ],
  specifications: {
    'Sensors': 'Door, Weight, Motion, Vibration',
    'Communication': 'Wi-Fi / 4G LTE',
    'Power Supply': '12V DC with battery backup',
    'Alert System': 'SMS, Email, App notifications',
    'Data Logging': 'Cloud-based storage',
    'Compatibility': 'All lift brands',
    'Installation': 'Professional installation included',
    'Warranty': '2 years',
  },
}

export default function IoTSmartLiftGuard() {
  return <ProductPage product={product} />
}
