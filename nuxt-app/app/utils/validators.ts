export const rules = {
  required: (field = 'Este campo') => (v: unknown) => {
    if (v === null || v === undefined) return `${field} es obligatorio.`
    if (typeof v === 'string' && !v.trim()) return `${field} es obligatorio.`
    return true
  },

  maxLength: (max: number, field = 'Este campo') => (v: string | null | undefined) => {
    if (!v) return true
    return v.trim().length <= max || `${field} no puede superar los ${max} caracteres.`
  },

  minLength: (min: number, field = 'Este campo') => (v: string | null | undefined) => {
    if (!v) return true
    return v.trim().length >= min || `${field} debe tener al menos ${min} caracteres.`
  },

  email: (v: string | null | undefined) => {
    if (!v || !v.trim()) return 'El correo electrónico es obligatorio.'
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(v.trim()) || 'Ingresa un correo electrónico válido.'
  },

  password: (v: string | null | undefined) => {
    if (!v || !v.trim()) return 'La contraseña es obligatoria.'
    return v.trim().length >= 8 || 'La contraseña debe tener al menos 8 caracteres.'
  },

  imageUrl: (v: string | null | undefined) => {
    if (!v || !v.trim()) return true
    const trimmed = v.trim()
    return (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      'La imagen debe ser una URL válida que comience con http:// o https://'
    )
  },
}
