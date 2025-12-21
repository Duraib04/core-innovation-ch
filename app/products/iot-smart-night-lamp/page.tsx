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
  image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80',
  images: [
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80&sat=-20',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80&sat=20',
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80&blur=5',
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
