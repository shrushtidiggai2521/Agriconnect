export const API_BASE_URL = 'http://localhost:8080/api'

export const ROLES = {
  FARMER: 'FARMER',
  BUYER: 'BUYER',
}

export const ORDER_STATUS_STEPS = [
  'PLACED',
  'ACCEPTED',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
]

export const TOKEN_KEY = 'agriconnect_token'
export const USER_KEY = 'agriconnect_user'

// Normalizes role strings from the backend so "ROLE_FARMER", "farmer", "Farmer"
// etc. all match ROLES.FARMER / ROLES.BUYER consistently across the app.
export function normalizeRole(role) {
  if (!role) return null
  return role.toString().toUpperCase().replace(/^ROLE_/, '')
}