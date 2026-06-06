export interface Address {
  id?: number
  label?: string
  country?: string
  city?: string
  houseNumber?: string
  street?: string
  addressLine?: string
  addressLine2?: string
  zipCode?: string
  isDefault?: boolean
}

export interface SavedCard {
  cardName: string
  cardNumber: string
  CVV: string
  expiryDate: any
}

export interface UserProfile {
  id?: string
  username: string
  role: string
  email: string
  phoneNumber: string
  addresses?: Address[]
  savedCards?: SavedCard[]
  wishlistProductIds?: string[]
  avatarUrl: string // Make it non-optional with default empty string
}
