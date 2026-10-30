import { addDays, makeDate, MONTH_NAMES, WEEKDAY_SHORT } from '../lib/dates'
import type { DayClassifier, VacationWindow } from '../lib/optimizer'
import { dayStyle, LEGEND } from './dayStyle'

interface Props {
  year: number
  classifier: DayClassifier
  selected?: VacationWindow
}

// Columnas de lunes a domingo
const COLUMN_ORDER = [1, 2, 3, 4, 5, 6, 0]

export function YearCalendar({ year, classifier, selected }: Props) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Calendario {year}</h2>
        <Legend />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
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
      <h3 className="mb-1.5 text-sm font-semibold text-slate-700">{MONTH_NAMES[month]}</h3>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[11px] sm:gap-1 sm:text-xs">
        {COLUMN_ORDER.map((d, i) => (
          <div key={i} className="font-medium text-slate-400">
            {WEEKDAY_SHORT[d]}
          </div>
        ))}
        {cells.map((date, i) =>
          date ? (
            <div
              key={i}
              title={classifier.holidayName(date)}
              className={`flex aspect-square items-center justify-center rounded sm:rounded-md ${dayStyle(date, classifier, selected)}`}
            >
              {date.getUTCDate()}
            </div>
          ) : (
            <div key={i} />
          ),
        )}
      </div>
    </div>
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
      {LEGEND.map(([color, label]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className={`h-3 w-3 rounded ${color}`} />
          {label}
        </span>
      ))}
    </div>
  )
}
