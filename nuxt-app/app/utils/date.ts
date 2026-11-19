export function parseLocalDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null
  const clean = dateStr.trim()
  if (!clean.includes('-')) return null

  const parts = clean.split('-').map((v) => parseInt(v, 10))
  if (parts.length < 3) return null

  const y = parts[0]
  const m = parts[1]
  const d = parts[2]

  if (y === undefined || m === undefined || d === undefined || isNaN(y) || isNaN(m) || isNaN(d)) {
    return null
  }

  // year, monthIndex (0-based), day
  return new Date(y, m - 1, d)
}

export function formatDateToColombian(dateStr: string | null | undefined): string {
  const date = parseLocalDate(dateStr)
  if (!date) return '—'

  const today = new Date()
  const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const targetAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const diffTime = todayAtMidnight.getTime() - targetAtMidnight.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Hoy'
  }
  if (diffDays === 1) {
    return 'Ayer'
  }

  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
