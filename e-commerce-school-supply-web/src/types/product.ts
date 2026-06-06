export interface Product {
  id?: string
  name: string
  description?: string
  mainCategory?: string
  subCategory?: string
  type?: string
  size?: string
  color?: string
  material?: string
  brandName?: string
  stockQuantity?: number
  price: number
  discount?: number | null
  // Prefer the new multi-image field; fall back to legacy single url when needed
  images?: string[]
  imageUrl?: string
  status?: 'In Stock' | 'Out of stock'
  rating?: number | 0
  averageRating: number
  reviewCount?: number
  imageURL?: string // For backward compatibility
}
