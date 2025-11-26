import ProductPage from '@/components/ProductPage'

export const metadata = {
  title: 'IoT Smart Water Planting Kit - Core Innovation',
  description: 'Automated plant watering system with soil moisture sensors, scheduling, and mobile app control for smart gardening',
}

const product = {
  id: 'iot-smart-water-planting-kit',
  name: 'IoT Smart Water Planting Kit',
  description: 'Automated plant watering system with soil moisture sensors',
  longDescription: 'Intelligent automated watering system that monitors soil moisture, temperature, and humidity to deliver optimal water to your plants. Schedule watering routines or let the AI decide based on plant needs and weather forecasts.',
  price: '₹500',
  originalPrice: '₹800',
  discount: '38%',
  rating: 4.5,
  reviews: 142,
  image: '/images/water-planting.jpg',
  images: [
    '/images/water-planting.jpg',
    '/images/water-planting-2.jpg',
    '/images/water-planting-3.jpg',
    '/images/water-planting-4.jpg',
  ],
  badge: 'ECO-FRIENDLY',
  color: 'from-green-400 to-emerald-500',
  inStock: true,
  features: [
    'Automatic watering based on soil moisture',
    'Soil moisture, temperature & humidity sensors',
    'Customizable watering schedules',
    'Weather forecast integration',
    'Mobile app control & monitoring',
    'Water-saving smart algorithms',
    'Supports up to 10 plants per unit',
    'Solar panel option available',
  ],
  specifications: {
    'Sensors': 'Soil Moisture, Temperature, Humidity',
    'Pump Capacity': '5L/min',
    'Water Tank': '10L capacity',
    'Power': '12V DC adapter or solar',
    'Connectivity': 'Wi-Fi 2.4GHz',
    'Pipes Included': '10m drip irrigation tubes',
    'App Features': 'Scheduling, History, Alerts',
    'Coverage': 'Up to 10 plants',
  },
}

export default function IoTSmartWaterPlantingKit() {
  return <ProductPage product={product} />
}
