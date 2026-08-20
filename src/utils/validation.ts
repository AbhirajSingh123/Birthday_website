export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidWhatsApp(value: string): boolean {
  // Accepts optional leading +, 8-15 digits (covers most international formats).
  return /^\+?[0-9]{8,15}$/.test(value.replace(/[\s-]/g, ''))
}

export function isValidName(value: string): boolean {
  return value.trim().length >= 2 && value.trim().length <= 80
}

export function isValidMessage(value: string): boolean {
  return value.trim().length >= 5 && value.trim().length <= 500
}
