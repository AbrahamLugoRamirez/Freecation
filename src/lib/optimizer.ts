import { addDays, diffDays, makeDate, toKey } from './dates'
import { holidayMap } from './holidays'

export interface OptimizerInput {
  year: number
  /** Días hábiles de vacaciones que se quieren gastar. */
  vacationDays: number
  /** Días de la semana laborales (0 = domingo ... 6 = sábado). */
  workDays: number[]
  /** Fecha mínima a partir de la cual se pueden tomar vacaciones. */
  minDate: Date
  /** Cantidad máxima de resultados a devolver. */
  limit: number
}

export interface VacationWindow {
  /** Primer día libre del bloque (incluye fines de semana/festivos previos). */
  offStart: Date
  /** Último día libre del bloque. */
  offEnd: Date
  /** Primer día de vacaciones que se debe pedir. */
  vacationStart: Date
  /** Último día de vacaciones que se debe pedir. */
  vacationEnd: Date
  /** Días calendario totales de descanso. */
  totalDays: number
  vacationDays: number
  /** Días libres "gratis" (no laborales o festivos) dentro del bloque. */
  freeDays: number
  holidays: { date: Date; name: string }[]
  /** Días de descanso por cada día de vacaciones gastado. */
  efficiency: number
}

export interface DayClassifier {
  isFree: (date: Date) => boolean
  holidayName: (date: Date) => string | undefined
}

export function createClassifier(years: number[], workDays: number[]): DayClassifier {
  const holidays = holidayMap(years)
  const work = new Set(workDays)
  return {
    holidayName: (date) => holidays.get(toKey(date)),
    isFree: (date) => !work.has(date.getUTCDay()) || holidays.has(toKey(date)),
  }
}

/**
 * Busca los bloques continuos de vacaciones que más días de descanso generan.
 * Para cada día hábil posible como inicio, se gastan N días hábiles y se extiende
 * el bloque con los días libres (fines de semana y festivos) que lo rodean.
 */
export function findBestWindows(input: OptimizerInput): VacationWindow[] {
  const { year, vacationDays, workDays, minDate, limit } = input
  if (vacationDays < 1 || workDays.length === 0) return []

  const classifier = createClassifier([year - 1, year, year + 1, year + 2], workDays)
  const yearStart = makeDate(year, 0, 1)
  const yearEnd = makeDate(year, 11, 31)
  const firstStart = minDate > yearStart ? minDate : yearStart

  const candidates: VacationWindow[] = []

  for (let start = firstStart; start <= yearEnd; start = addDays(start, 1)) {
    if (classifier.isFree(start)) continue

    // Gastar N días hábiles a partir de "start"
    let used = 0
    let cursor = start
    let vacationEnd = start
    while (used < vacationDays) {
      if (!classifier.isFree(cursor)) {
        used++
        vacationEnd = cursor
      }
      cursor = addDays(cursor, 1)
    }

    // Extender hacia atrás y hacia adelante con días libres
    let offStart = start
    while (addDays(offStart, -1) >= minDate && classifier.isFree(addDays(offStart, -1))) {
      offStart = addDays(offStart, -1)
    }
    let offEnd = vacationEnd
    while (classifier.isFree(addDays(offEnd, 1))) {
      offEnd = addDays(offEnd, 1)
    }

    const totalDays = diffDays(offStart, offEnd) + 1
    const holidays: VacationWindow['holidays'] = []
    for (let d = offStart; d <= offEnd; d = addDays(d, 1)) {
      const name = classifier.holidayName(d)
      if (name) holidays.push({ date: d, name })
    }

    candidates.push({
      offStart,
      offEnd,
      vacationStart: start,
      vacationEnd,
      totalDays,
      vacationDays,
      freeDays: totalDays - vacationDays,
      holidays,
      efficiency: totalDays / vacationDays,
    })
  }

  // Mejor primero: más días de descanso; a igualdad, más festivos y luego la fecha más próxima
  candidates.sort(
    (a, b) =>
      b.totalDays - a.totalDays ||
      b.holidays.length - a.holidays.length ||
      a.offStart.getTime() - b.offStart.getTime(),
  )

  // Elegir bloques que no se superpongan para dar opciones realmente distintas
  const selected: VacationWindow[] = []
  for (const candidate of candidates) {
    const overlaps = selected.some(
      (s) => candidate.offStart <= s.offEnd && s.offStart <= candidate.offEnd,
    )
    if (!overlaps) selected.push(candidate)
    if (selected.length >= limit) break
  }

  return selected
}
