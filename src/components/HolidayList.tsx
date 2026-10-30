import { formatShort } from '../lib/dates'
import { colombianHolidays } from '../lib/holidays'

export function HolidayList({ year }: { year: number }) {
  const holidays = colombianHolidays(year)

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <h2 className="mb-3 text-lg font-semibold">
        Festivos en Colombia {year} <span className="text-sm font-normal text-slate-400">({holidays.length})</span>
      </h2>
      <ul className="divide-y divide-slate-100 text-sm">
        {holidays.map((h) => (
          <li key={h.name} className="flex justify-between gap-3 py-1.5">
            <span className="text-slate-700">{h.name}</span>
            <span className="shrink-0 text-slate-500">{formatShort(h.date)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
