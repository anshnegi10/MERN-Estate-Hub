import { Property } from "../types/property";

export const PROPERTIES: Property[] = [
  {
    id: 'p1', name: 'Property 53', tagline: 'Bidholi · 1BHK Flat · 1.5 km to campus',
    location: 'Bidholi, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 20000, priceLabel: '₹20,000', perLabel: '/month', beds: 1, baths: 1, area: '450',
    rating: 4.5, reviews: 24, description: 'Comfortable 1BHK perfect for students. Quick access to campus.',
    gradient: 'from-sky-300 via-blue-400 to-indigo-500', builder: 'Independent', lat: 30.4159, lng: 77.9668,
    badge: 'Flat - 1BHK', highlight: '1.5 km from campus',
    specs: [['Bedrooms', '1'], ['Distance', '1.5 km'], ['Type', 'Flat']],
    amenities: ['Wi-Fi', 'Security', 'Furnished', 'Power Backup'],
    images: []
  },
  {
    id: 'p2', name: 'Property 54', tagline: 'Bidholi · 1BHK Flat · Nearest to campus',
    location: 'Bidholi, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 20000, priceLabel: '₹20,000', perLabel: '/month', beds: 1, baths: 1, area: '500',
    rating: 4.8, reviews: 45, description: 'Premium 1BHK right next to the university. Walk to classes in 2 mins.',
    gradient: 'from-emerald-300 via-green-400 to-teal-500', builder: 'Independent', lat: 30.4170, lng: 77.9680,
    badge: 'Flat - 1BHK', highlight: '0.2 km from campus',
    specs: [['Bedrooms', '1'], ['Distance', '0.2 km'], ['Type', 'Flat']],
    amenities: ['Wi-Fi', 'Security', 'AC', 'Power Backup'],
    images: []
  },
  {
    id: 'p3', name: 'Property 52', tagline: 'Bidholi · Studio · Budget friendly',
    location: 'Bidholi, Dehradun', city: 'Dehradun', type: 'apartment', category: 'affordable',
    price: 16000, priceLabel: '₹16,000', perLabel: '/month', beds: 1, baths: 1, area: '350',
    rating: 4.3, reviews: 18, description: 'Cozy studio apartment, perfect for solo living.',
    gradient: 'from-amber-300 via-orange-400 to-red-400', builder: 'Independent', lat: 30.4150, lng: 77.9650,
    badge: 'Studio', highlight: '0.5 km from campus',
    specs: [['Bedrooms', 'Studio'], ['Distance', '0.5 km'], ['Type', 'Studio']],
    amenities: ['Wi-Fi', 'Basic Furniture', 'Water 24/7'],
    images: []
  },
  {
    id: 'p4', name: 'KK Residency Boys Hostel', tagline: 'Bidholi · Boys Hostel · Premium',
    location: 'Bidholi, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 170000, priceLabel: '₹1,70,000', perLabel: '/year', beds: 1, baths: 1, area: '200',
    rating: 4.6, reviews: 72, description: 'Premium boys hostel with food included. Excellent facilities and security.',
    gradient: 'from-violet-300 via-purple-400 to-fuchsia-500', builder: 'KK Group', lat: 30.4140, lng: 77.9640,
    badge: 'Hostel-Boys', highlight: '1 km from campus',
    specs: [['Bedrooms', 'Sharing'], ['Distance', '1 km'], ['Food', 'Included']],
    amenities: ['Mess', 'Laundry', 'Wi-Fi', 'Gym'],
    images: []
  },
  {
    id: 'p5', name: 'Stag House Boys Hostel', tagline: 'Bidholi · Boys Hostel · Safe & Secure',
    location: 'Bidholi, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 165000, priceLabel: '₹1,65,000', perLabel: '/year (starting)', beds: 1, baths: 1, area: '250',
    rating: 4.4, reviews: 55, description: 'Vibrant student community. Great food and recreational areas.',
    gradient: 'from-cyan-300 via-teal-400 to-emerald-500', builder: 'Independent', lat: 30.4130, lng: 77.9630,
    badge: 'Hostel-Boys', highlight: '1 km from campus',
    specs: [['Bedrooms', 'Sharing'], ['Distance', '1 km'], ['Food', 'Included']],
    amenities: ['Mess', 'Wi-Fi', 'Indoor Games', 'Security'],
    images: []
  },
  {
    id: 'p6', name: 'Agrasen Mansion Boys Hostel', tagline: 'Bidholi · Premium Hostel · Close to uni',
    location: 'Bidholi, Dehradun', city: 'Dehradun', type: 'apartment', category: 'luxury',
    price: 200000, priceLabel: '₹2,00,000', perLabel: '/year (starting)', beds: 1, baths: 1, area: '300',
    rating: 4.9, reviews: 88, description: 'High-end hostel living with AC rooms and premium dining.',
    gradient: 'from-rose-300 via-pink-400 to-fuchsia-400', builder: 'Agrasen', lat: 30.4160, lng: 77.9670,
    badge: 'Hostel-Boys', highlight: '0.5 km from campus',
    specs: [['Bedrooms', 'Sharing'], ['Distance', '0.5 km'], ['AC', 'Yes']],
    amenities: ['AC', 'Premium Mess', 'Gym', 'Laundry'],
    images: []
  },
  {
    id: 'p7', name: 'Property 50', tagline: 'Bidholi · 2BHK Flat · Spacious',
    location: 'Bidholi, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 50000, priceLabel: '₹50,000', perLabel: '/month', beds: 2, baths: 2, area: '1100',
    rating: 4.7, reviews: 31, description: 'Large 2BHK flat suitable for sharing among friends.',
    gradient: 'from-indigo-300 via-blue-400 to-sky-500', builder: 'Independent', lat: 30.4120, lng: 77.9610,
    badge: 'Flat - 2BHK', highlight: '1 km from campus',
    specs: [['Bedrooms', '2'], ['Distance', '1 km'], ['Furnished', 'Semi']],
    amenities: ['Parking', 'Security', 'Power Backup'],
    images: []
  },
  {
    id: 'p8', name: 'Property 51', tagline: 'Bidholi · Single PG · Private living',
    location: 'Bidholi, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 24000, priceLabel: '₹24,000', perLabel: '/month', beds: 1, baths: 1, area: '150',
    rating: 4.2, reviews: 14, description: 'Quiet single room PG for focused studying.',
    gradient: 'from-lime-300 via-green-400 to-emerald-400', builder: 'Independent', lat: 30.4165, lng: 77.9675,
    badge: 'PG-Single', highlight: '0.5 km from campus',
    specs: [['Bedrooms', '1'], ['Distance', '0.5 km'], ['Food', 'Included']],
    amenities: ['Wi-Fi', 'Meals', 'Cleaning'],
    images: []
  },
  {
    id: 'p9', name: 'Property 7', tagline: 'Pondha · 2BHK Flat · Quiet location',
    location: 'Pondha, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 35000, priceLabel: '₹35,000', perLabel: '/month', beds: 2, baths: 2, area: '950',
    rating: 4.5, reviews: 29, description: 'Peaceful living away from the rush, still accessible.',
    gradient: 'from-yellow-300 via-amber-400 to-orange-500', builder: 'Independent', lat: 30.3800, lng: 77.9500,
    badge: 'Flat - 2BHK', highlight: '3 km from campus',
    specs: [['Bedrooms', '2'], ['Distance', '3 km'], ['Furnished', 'Fully']],
    amenities: ['Parking', 'Balcony', 'Security'],
    images: []
  },
  {
    id: 'p10', name: 'Aashirwad Girls Hostel', tagline: 'Kandoli · Girls Hostel · Highly Secure',
    location: 'Upper Kandoli, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 195000, priceLabel: '₹1,95,000', perLabel: '/year (starting)', beds: 1, baths: 1, area: '200',
    rating: 4.8, reviews: 93, description: 'Top-rated girls hostel with strict security and excellent food.',
    gradient: 'from-pink-300 via-rose-400 to-red-500', builder: 'Aashirwad', lat: 30.4000, lng: 77.9800,
    badge: 'Hostel-Girls', highlight: '1.5 km from campus',
    specs: [['Bedrooms', 'Sharing'], ['Distance', '1.5 km'], ['Security', '24/7']],
    amenities: ['CCTV', 'Biometric', 'Mess', 'Transport'],
    images: []
  },
  {
    id: 'p11', name: 'People Tree Boys Hostel', tagline: 'Kandoli · Boys Hostel · Value',
    location: 'Upper Kandoli, Dehradun', city: 'Dehradun', type: 'apartment', category: 'affordable',
    price: 150000, priceLabel: '₹1,50,000', perLabel: '/year (starting)', beds: 1, baths: 1, area: '200',
    rating: 4.1, reviews: 40, description: 'Budget-friendly boys hostel with all necessary amenities.',
    gradient: 'from-blue-300 via-indigo-400 to-violet-500', builder: 'Independent', lat: 30.3950, lng: 77.9750,
    badge: 'Hostel-Boys', highlight: '1.5 km from campus',
    specs: [['Bedrooms', 'Sharing'], ['Distance', '1.5 km'], ['Food', 'Included']],
    amenities: ['Mess', 'Wi-Fi', 'Security'],
    images: []
  },
  {
    id: 'p12', name: 'Property 55', tagline: 'Kandoli · 2BHK Flat · Modern',
    location: 'Kandoli, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 40000, priceLabel: '₹40,000', perLabel: '/month', beds: 2, baths: 2, area: '1000',
    rating: 4.6, reviews: 33, description: 'Newly furnished 2BHK with modern interiors.',
    gradient: 'from-teal-300 via-emerald-400 to-green-500', builder: 'Independent', lat: 30.3900, lng: 77.9700,
    badge: 'Flat - 2BHK', highlight: '1.5 km from campus',
    specs: [['Bedrooms', '2'], ['Distance', '1.5 km'], ['Furnished', 'Yes']],
    amenities: ['AC', 'Modular Kitchen', 'Parking'],
    images: []
  },
  {
    id: 'p13', name: 'Property 15', tagline: 'Bidholi · 2BHK Flat · Prime Location',
    location: 'Bidholi, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 25000, priceLabel: '₹25,000', perLabel: '/month', beds: 2, baths: 1, area: '800',
    rating: 4.3, reviews: 21, description: 'Affordable 2BHK right near the main market area.',
    gradient: 'from-cyan-300 via-sky-400 to-blue-500', builder: 'Independent', lat: 30.4150, lng: 77.9660,
    badge: 'Flat - 2BHK', highlight: '1 km from campus',
    specs: [['Bedrooms', '2'], ['Distance', '1 km'], ['Furnished', 'Semi']],
    amenities: ['Market Access', 'Water 24/7'],
    images: []
  },
  {
    id: 'p14', name: 'Property 17', tagline: 'Kandoli · 2BHK Flat · Spacious living',
    location: 'Kandoli, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 30000, priceLabel: '₹30,000', perLabel: '/month', beds: 2, baths: 2, area: '950',
    rating: 4.4, reviews: 26, description: 'Well-ventilated flat perfect for group living.',
    gradient: 'from-fuchsia-300 via-purple-400 to-indigo-500', builder: 'Independent', lat: 30.3920, lng: 77.9720,
    badge: 'Flat - 2BHK', highlight: '1 km from campus',
    specs: [['Bedrooms', '2'], ['Distance', '1 km'], ['Location', 'Prime']],
    amenities: ['Balcony', 'Parking', 'Security'],
    images: []
  },
  {
    id: 'p15', name: 'Property 18', tagline: 'Doonga · 2BHK Flat · Scenic views',
    location: 'Doonga, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 25000, priceLabel: '₹25,000', perLabel: '/month', beds: 2, baths: 2, area: '900',
    rating: 4.7, reviews: 41, description: 'Surrounded by nature, very peaceful area.',
    gradient: 'from-orange-300 via-red-400 to-rose-500', builder: 'Independent', lat: 30.4300, lng: 77.9400,
    badge: 'Flat - 2BHK', highlight: 'Nature views',
    specs: [['Bedrooms', '2'], ['Distance', '1.5 km'], ['View', 'Forest']],
    amenities: ['Nature Trails', 'Quiet', 'Parking'],
    images: []
  },
  {
    id: 'p16', name: 'Property 19', tagline: 'Doonga · 3BHK Flat · Large group',
    location: 'Doonga, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 25000, priceLabel: '₹25,000', perLabel: '/month', beds: 3, baths: 2, area: '1200',
    rating: 4.5, reviews: 35, description: 'Incredible value 3BHK, ideal for 3-4 students to share.',
    gradient: 'from-emerald-300 via-teal-400 to-cyan-500', builder: 'Independent', lat: 30.4310, lng: 77.9410,
    badge: 'Flat - 3BHK', highlight: 'Great Value',
    specs: [['Bedrooms', '3'], ['Distance', '1.5 km'], ['Value', 'High']],
    amenities: ['Spacious', 'Parking', 'Balcony'],
    images: []
  },
  {
    id: 'p17', name: 'Property 20', tagline: 'Doonga · 3BHK Flat · Fully furnished',
    location: 'Doonga, Dehradun', city: 'Dehradun', type: 'apartment', category: 'rent',
    price: 30000, priceLabel: '₹30,000', perLabel: '/month', beds: 3, baths: 3, area: '1300',
    rating: 4.6, reviews: 38, description: 'Fully furnished 3BHK with all amenities ready.',
    gradient: 'from-blue-300 via-indigo-400 to-violet-500', builder: 'Independent', lat: 30.4320, lng: 77.9420,
    badge: 'Flat - 3BHK', highlight: 'Fully Furnished',
    specs: [['Bedrooms', '3'], ['Distance', '2.5 km'], ['Furnished', 'Fully']],
    amenities: ['Beds', 'Study Tables', 'Fridge', 'Washing Machine'],
    images: []
  },
  {
    id: 'p18', name: 'Property 22', tagline: 'Bidholi · 3BHK Flat · Premium',
    location: 'Bidholi, Dehradun', city: 'Dehradun', type: 'apartment', category: 'luxury',
    price: 30000, priceLabel: '₹30,000', perLabel: '/month', beds: 3, baths: 3, area: '1400',
    rating: 4.8, reviews: 62, description: 'Premium 3BHK near campus with exceptional build quality.',
    gradient: 'from-rose-300 via-pink-400 to-purple-500', builder: 'Independent', lat: 30.4145, lng: 77.9645,
    badge: 'Flat - 3BHK', highlight: 'Premium Build',
    specs: [['Bedrooms', '3'], ['Distance', '1 km'], ['Quality', 'Luxury']],
    amenities: ['Security', 'Power Backup', 'Gym Access'],
    images: []
  },
  {
    id: 'p19', name: 'Property 2', tagline: 'Pondha · 2BHK Flat · New Build',
    location: 'Pondha, Dehradun', city: 'Dehradun', type: 'apartment', category: 'new',
    price: 35000, priceLabel: '₹35,000', perLabel: '/month', beds: 2, baths: 2, area: '1000',
    rating: 4.9, reviews: 12, description: 'Brand new construction, first time renting.',
    gradient: 'from-yellow-300 via-orange-400 to-red-500', builder: 'Independent', lat: 30.3810, lng: 77.9510,
    badge: 'Flat - 2BHK', highlight: 'Brand New',
    specs: [['Bedrooms', '2'], ['Distance', '2 km'], ['Age', '0 Years']],
    amenities: ['Fresh Interiors', 'Parking', 'Security'],
    images: []
  },
  {
    id: 'p20', name: 'Property 9', tagline: 'Kandoli · 1BHK Flat · Budget',
    location: 'Kandoli, Dehradun', city: 'Dehradun', type: 'apartment', category: 'affordable',
    price: 14000, priceLabel: '₹14,000', perLabel: '/month', beds: 1, baths: 1, area: '400',
    rating: 4.0, reviews: 19, description: 'Basic affordable 1BHK for students on a budget.',
    gradient: 'from-sky-300 via-teal-400 to-emerald-500', builder: 'Independent', lat: 30.3930, lng: 77.9730,
    badge: 'Flat - 1BHK', highlight: 'Most Affordable',
    specs: [['Bedrooms', '1'], ['Distance', '1 km'], ['Type', 'Value']],
    amenities: ['Basic Needs', 'Water 24/7'],
    images: []
  }
];

export const CATEGORIES = [
  { val: 'all',        label: 'All Accoms',  emoji: '🏠' },
  { val: 'Hostel',     label: 'Hostel',      emoji: '🛏️' },
  { val: 'Flat',       label: 'Flat',        emoji: '🔑' },
  { val: 'Studio',     label: 'Studio',      emoji: '🏗️' },
  { val: 'budget',     label: 'Budget',      emoji: '💰' },
];

export const CITIES = ['All', 'Dehradun', 'Bidholi', 'Kandoli', 'Premnagar'];
