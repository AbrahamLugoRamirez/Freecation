import type { DayClassifier, VacationWindow } from '../lib/optimizer'

/** Clases de color de un día según si es festivo, libre o parte del bloque seleccionado. */
export function dayStyle(date: Date, classifier: DayClassifier, selected?: VacationWindow): string {
  const holiday = classifier.holidayName(date)
  const free = classifier.isFree(date)
  const inOff = selected && date >= selected.offStart && date <= selected.offEnd

  if (inOff && !free) return 'bg-emerald-600 font-semibold text-white'
  if (inOff) return holiday ? 'bg-emerald-200 font-semibold text-rose-600' : 'bg-emerald-200 text-emerald-900'
  if (holiday) return 'bg-rose-100 font-semibold text-rose-600'
  if (free) return 'bg-slate-100 text-slate-400'
  return 'text-slate-700'
}

export const LEGEND = [
  ['bg-emerald-600', 'Vacaciones'],
  ['bg-emerald-200', 'Descanso gratis'],
  ['bg-rose-100', 'Festivo'],
  ['bg-slate-100', 'No laboral'],
]
