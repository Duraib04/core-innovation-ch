import ProductPage from '@/components/ProductPage'

export const metadata = {
  title: 'IoT Smart Door Lock RFID - Core Innovation',
  description: 'Keyless entry system with RFID cards, fingerprint sensor, PIN code access, and remote unlock via mobile app',
}

const product = {
  id: 'iot-smart-door-lock-rfid',
  name: 'IoT Smart Door Lock (RFID)',
  description: 'Keyless entry system with RFID cards and mobile app control',
  longDescription: 'Next-generation smart door lock featuring multiple access methods including RFID cards, fingerprint recognition, PIN codes, and smartphone control. Perfect for homes and offices seeking advanced security with convenience.',
  price: '₹500',
  originalPrice: '₹800',
  discount: '38%',
  rating: 4.6,
  reviews: 178,
  image: '/images/door-lock.jpg',
  images: [
    '/images/door-lock.jpg',
    '/images/door-lock-2.jpg',
    '/images/door-lock-3.jpg',
    '/images/door-lock-4.jpg',
  ],
  badge: 'NEW ARRIVAL',
  color: 'from-green-500 to-teal-500',
  inStock: true,
  features: [
    '4-in-1 access: RFID, Fingerprint, PIN, App',
    'Remote unlock from anywhere via mobile app',
    'Auto-lock after specified time',
    'Access log & entry history tracking',
    'Low battery warning (6 months advance)',
    'Emergency power port (USB Type-C)',
    'Tamper alarm & intrusion detection',
    'Up to 100 RFID cards & 50 fingerprints',
  ],
  specifications: {
    'Access Methods': 'RFID, Fingerprint, PIN, Bluetooth',
    'Fingerprint Capacity': '50 fingerprints',
    'RFID Cards': '100 cards (5 included)',
    'PIN Codes': '50 codes',
    'Battery': '4x AA batteries (6-12 months)',
    'Material': 'Zinc alloy + Stainless steel',
    'Compatibility': 'Most standard doors',
    'App': 'iOS & Android',
  },
}

export default function IoTSmartDoorLockRFID() {
  return <ProductPage product={product} />
}
