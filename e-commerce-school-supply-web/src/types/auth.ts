export interface AuthResponse {
  token: string
  id: string
  username: string
  email: string
  role: string
  phoneNumber: string | null
  avatarUrl: string // Make it non-optional with default empty string
}
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterUserData {
  username: string
  email: string
  password: string
  confirmPassword: string
}
