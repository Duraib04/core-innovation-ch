import ProductPage from '@/components/ProductPage'

export const metadata = {
  title: 'IoT Smart Night Lamp - Core Innovation',
  description: 'Voice-controlled RGB night lamp with motion sensor, scheduling, music sync, and smart home integration',
}

const product = {
  id: 'iot-smart-night-lamp',
  name: 'IoT Smart Night Lamp',
  description: 'Voice-controlled RGB night lamp with motion sensor',
  longDescription: 'Elegant smart LED lamp with 16 million color options, voice control, motion detection, and music synchronization. Creates the perfect ambiance for any mood while saving energy with intelligent automation.',
  price: '₹400',
  originalPrice: '₹600',
  discount: '33%',
  rating: 4.7,
  reviews: 312,
  image: '/images/night-lamp.jpg',
  images: [
    '/images/night-lamp.jpg',
    '/images/night-lamp-2.jpg',
    '/images/night-lamp-3.jpg',
    '/images/night-lamp-4.jpg',
  ],
  badge: 'POPULAR',
  color: 'from-yellow-400 to-orange-500',
  inStock: true,
  features: [
    '16 million RGB colors + warm/cool white',
    'Voice control (Alexa, Google Assistant)',
    'Motion sensor auto on/off',
    'Music sync & rhythm modes',
    'Scheduling & timer functions',
    'Adjustable brightness (1-100%)',
    'Sleep mode with gradual dimming',
    'Energy-efficient LED (5W)',
  ],
  specifications: {
    'Colors': '16 million RGB + White',
    'Brightness': '1-100% dimmable',
    'Power': '5W LED',
    'Lifespan': '50,000 hours',
    'Connectivity': 'Wi-Fi 2.4GHz + Bluetooth',
    'Voice Control': 'Alexa, Google Assistant',
    'Sensors': 'Motion sensor',
    'Base': 'Touch-sensitive controls',
  },
}

export default function IoTSmartNightLamp() {
  return <ProductPage product={product} />
}
