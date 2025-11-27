export interface User {
  id: string
  firstName: string
  lastName: string
  username?: string
  email: string
  emailVerified: boolean
  isActive?: boolean
  lastLogin?: string
}

export interface Service {
  serviceId: string
  serviceName: string
  domain: string
  role: 'user' | 'admin' | 'moderator'
  permissions: Record<string, any>
  isActive: boolean
  lastAccess?: string
}

export interface Session {
  id: string
  userId: string
  token: string
  refreshToken: string
  expiresAt: string
  refreshExpiresAt: string
  ipAddress?: string
  userAgent?: string
  isRevoked: boolean
  deviceInfo?: {
    platform?: string
    mobile?: boolean
  }
  createdAt?: string
  updatedAt?: string
}

export interface LoginResponse {
  message: string
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: User
  services: Service[]
}

export interface RegisterData {
  firstName: string
  lastName: string
  username?: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface SessionResponse {
  user: User
  services: Service[]
}

export interface ApiError {
  message: string
  code?: string
  statusCode?: number
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  password?: string
}

export interface Solution {
  id: string
  slug: string
  name: string
  logo: string
  logoDesk: string
  category: string
  description: string
  content: string
  disabled: boolean
  allowAuth: boolean
  authType?: 'user' | 'learner' | 'all'
  ctaText: string
  ctaLink: string
  features: string[]
  createdAt: string
  updatedAt: string
}
