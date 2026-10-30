import { addDays, makeDate, toKey } from './dates'

export interface Holiday {
  date: Date
  name: string
}

/** Domingo de Pascua (algoritmo anónimo gregoriano / Meeus-Jones-Butcher). */
export function easterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return makeDate(year, month - 1, day)
}

/** Ley Emiliani (Ley 51 de 1983): si el festivo no cae lunes, se traslada al lunes siguiente. */
function nextMonday(date: Date): Date {
  const dow = date.getUTCDay()
  if (dow === 1) return date
  return addDays(date, (8 - dow) % 7)
}

/** Festivos oficiales de Colombia para un año dado. */
export function colombianHolidays(year: number): Holiday[] {
  const easter = easterSunday(year)
  const d = (month: number, day: number) => makeDate(year, month - 1, day)

  const holidays: Holiday[] = [
    // Festivos fijos (no se trasladan)
    { date: d(1, 1), name: 'Año Nuevo' },
    { date: d(5, 1), name: 'Día del Trabajo' },
    { date: d(7, 20), name: 'Día de la Independencia' },
    { date: d(8, 7), name: 'Batalla de Boyacá' },
    { date: d(12, 8), name: 'Inmaculada Concepción' },
    { date: d(12, 25), name: 'Navidad' },

    // Festivos que se trasladan al lunes (Ley Emiliani)
    { date: nextMonday(d(1, 6)), name: 'Día de los Reyes Magos' },
    { date: nextMonday(d(3, 19)), name: 'Día de San José' },
    { date: nextMonday(d(6, 29)), name: 'San Pedro y San Pablo' },
    { date: nextMonday(d(8, 15)), name: 'Asunción de la Virgen' },
    { date: nextMonday(d(10, 12)), name: 'Día de la Raza' },
    { date: nextMonday(d(11, 1)), name: 'Todos los Santos' },
    { date: nextMonday(d(11, 11)), name: 'Independencia de Cartagena' },

    // Festivos que dependen de la Pascua
    { date: addDays(easter, -3), name: 'Jueves Santo' },
    { date: addDays(easter, -2), name: 'Viernes Santo' },
    { date: addDays(easter, 43), name: 'Ascensión del Señor' },
    { date: addDays(easter, 64), name: 'Corpus Christi' },
    { date: addDays(easter, 71), name: 'Sagrado Corazón de Jesús' },
  ]

  return holidays.sort((x, y) => x.date.getTime() - y.date.getTime())
}

/** Mapa "YYYY-MM-DD" -> nombre del festivo para varios años. */
export function holidayMap(years: number[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const year of years) {
    for (const h of colombianHolidays(year)) {
      const key = toKey(h.date)
      // Puede coincidir más de un festivo el mismo día
      map.set(key, map.has(key) ? `${map.get(key)} / ${h.name}` : h.name)
    }
  }
  return map
}
