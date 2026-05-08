export interface Property {
  id: string
  name: string
  tagline: string
  location: string
  city: string
  type: 'apartment' | 'villa' | 'plot' | 'commercial'
  category: 'sale' | 'rent' | 'new' | 'luxury' | 'affordable'
  price: number
  priceLabel: string
  perLabel?: string
  beds: number
  baths: number
  area: string
  rating: number
  reviews: number
  description: string
  gradient: string
  builder: string
  lat: number
  lng: number
  rera?: string
  badge?: string
  highlight?: string
  specs: [string, string][]
  amenities: string[]
  images: string[]
  contact?: {
    name: string
    phone: string
  }
  isOwnerVerified?: boolean
  isLocationVerified?: boolean
  isDocumentVerified?: boolean
  safetyScore?: number
}
