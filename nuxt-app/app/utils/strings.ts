export function normalizeText(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function getInitials(name: string | null | undefined): string {
  if (!name || !name.trim()) return '?'
  const parts = name.trim().split(/\s+/)
  const first = parts[0]
  if (!first) return '?'
  if (parts.length === 1) {
    return first.slice(0, 2).toUpperCase()
  }
  const last = parts[parts.length - 1] ?? first
  const firstChar = first[0] ?? ''
  const lastChar = last[0] ?? ''
  return (firstChar + lastChar).toUpperCase()
}
