import ProductPage from '@/components/ProductPage'

export const metadata = {
  title: 'Smart Home Gas Monitoring - Core Innovation',
  description: 'Intelligent gas leak detection system with automatic shutoff, multi-gas sensors, and instant mobile alerts for home safety',
}

const product = {
  id: 'smart-home-gas-monitoring',
  name: 'Smart Home Gas Monitoring',
  description: 'Intelligent gas leak detection system with automatic shutoff',
  longDescription: 'Advanced multi-gas detection system that monitors LPG, natural gas, and carbon monoxide levels. Features automatic valve shutoff, instant mobile alerts, and voice warnings to protect your family from gas-related hazards.',
  price: '₹6,000',
  originalPrice: '₹8,000',
  discount: '25%',
  rating: 4.9,
  reviews: 234,
  image: '/images/gas-monitoring.jpg',
  images: [
    '/images/gas-monitoring.jpg',
    '/images/gas-monitoring-2.jpg',
    '/images/gas-monitoring-3.jpg',
    '/images/gas-monitoring-4.jpg',
  ],
  badge: 'PREMIUM',
  color: 'from-blue-500 to-indigo-500',
  inStock: true,
  features: [
    'Multi-gas detection (LPG, Natural Gas, CO)',
    'Automatic gas valve shutoff mechanism',
    'Instant mobile app alerts',
    'Loud 85dB alarm siren',
    'Voice warning system',
    'Smart home integration (Alexa, Google Home)',
    'Battery backup for power outages',
    'Sensor self-test & diagnostics',
  ],
  specifications: {
    'Gas Types': 'LPG, Natural Gas, Carbon Monoxide',
    'Detection Range': '0-10,000 PPM',
    'Response Time': '< 10 seconds',
    'Alarm Volume': '85 dB',
    'Connectivity': 'Wi-Fi 2.4GHz',
    'Power': 'AC 220V + Battery Backup',
    'Sensor Life': '5 years',
    'Certifications': 'CE, FCC, RoHS',
  },
}

export default function SmartHomeGasMonitoring() {
  return <ProductPage product={product} />
}
