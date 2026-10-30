import { addDays, makeDate, MONTH_NAMES, WEEKDAY_SHORT } from '../lib/dates'
import type { DayClassifier, VacationWindow } from '../lib/optimizer'

interface Props {
  year: number
  classifier: DayClassifier
  selected?: VacationWindow
}

// Columnas de lunes a domingo
const COLUMN_ORDER = [1, 2, 3, 4, 5, 6, 0]

export function YearCalendar({ year, classifier, selected }: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Calendario {year}</h2>
        <Legend />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MONTH_NAMES.map((name, month) => (
          <Month key={name} year={year} month={month} classifier={classifier} selected={selected} />
        ))}
      </div>
    </section>
  )
}

function Month({ year, month, classifier, selected }: Props & { month: number }) {
  const first = makeDate(year, month, 1)
  const leading = (first.getUTCDay() + 6) % 7
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  const cells: (Date | null)[] = Array.from({ length: leading }, () => null)
  for (let i = 0; i < daysInMonth; i++) cells.push(addDays(first, i))

  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-slate-700">{MONTH_NAMES[month]}</h3>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {COLUMN_ORDER.map((d, i) => (
          <div key={i} className="font-medium text-slate-400">
            {WEEKDAY_SHORT[d]}
          </div>
        ))}
        {cells.map((date, i) =>
          date ? (
            <DayCell key={i} date={date} classifier={classifier} selected={selected} />
          ) : (
            <div key={i} />
          ),
        )}
      </div>
    </div>
  )
}

function DayCell({
  date,
  classifier,
  selected,
}: {
  date: Date
  classifier: DayClassifier
  selected?: VacationWindow
}) {
  const holiday = classifier.holidayName(date)
  const free = classifier.isFree(date)
  const inOff = selected && date >= selected.offStart && date <= selected.offEnd
  const isVacation = inOff && !free

  let style = 'text-slate-700'
  if (free) style = 'bg-slate-100 text-slate-400'
  if (holiday) style = 'bg-rose-100 font-semibold text-rose-600'
  if (inOff) style = holiday ? 'bg-emerald-200 font-semibold text-rose-600' : 'bg-emerald-200 text-emerald-900'
  if (isVacation) style = 'bg-emerald-600 font-semibold text-white'

  return (
    <div title={holiday} className={`flex aspect-square items-center justify-center rounded-md ${style}`}>
      {date.getUTCDate()}
    </div>
  )
}

function Legend() {
  const items = [
    ['bg-emerald-600', 'Vacaciones'],
    ['bg-emerald-200', 'Descanso gratis'],
    ['bg-rose-100', 'Festivo'],
    ['bg-slate-100', 'No laboral'],
  ]
  return (
    <div className="flex flex-wrap gap-3 text-xs text-slate-600">
      {items.map(([color, label]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className={`h-3 w-3 rounded ${color}`} />
          {label}
        </span>
      ))}
    </div>
  )
}
