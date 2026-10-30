// Todas las fechas se manejan en UTC a medianoche para evitar problemas de zona horaria.

const DAY_MS = 24 * 60 * 60 * 1000

export function makeDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day))
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS)
}

export function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS)
}

/** Clave única "YYYY-MM-DD" para usar en mapas y sets. */
export function toKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function today(): Date {
  const now = new Date()
  return makeDate(now.getFullYear(), now.getMonth(), now.getDate())
}

export const WEEKDAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
export const WEEKDAY_SHORT = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const longFormatter = new Intl.DateTimeFormat('es-CO', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

const shortFormatter = new Intl.DateTimeFormat('es-CO', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export function formatLong(date: Date): string {
  return capitalize(longFormatter.format(date))
}

export function formatShort(date: Date): string {
  return capitalize(shortFormatter.format(date))
}
