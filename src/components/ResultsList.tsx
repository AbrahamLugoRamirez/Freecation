import { useState } from 'react'
import { formatLong, formatShort } from '../lib/dates'
import type { DayClassifier, VacationWindow } from '../lib/optimizer'
import { DayStrip } from './DayStrip'

interface Props {
  results: VacationWindow[]
  classifier: DayClassifier
  selectedIndex: number
  onSelect: (index: number) => void
}

const INITIAL_VISIBLE = 5

export function ResultsList({ results, classifier, selectedIndex, onSelect }: Props) {
  const [showAll, setShowAll] = useState(false)

  if (results.length === 0) {
    return (
      <section className="rounded-2xl bg-white p-4 text-slate-500 shadow-sm ring-1 ring-slate-200 sm:p-6">
        No hay fechas disponibles con esta configuración.
      </section>
    )
  }

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <h2 className="mb-1 text-lg font-semibold">Mejores fechas</h2>
      <p className="mb-4 text-sm text-slate-500">
        Ordenadas por días totales de descanso. Toca una para ver el detalle.
      </p>

      <ol className="space-y-3">
        {(showAll ? results : results.slice(0, INITIAL_VISIBLE)).map((r, i) => {
          const selected = i === selectedIndex
          return (
            <li key={r.vacationStart.toISOString()}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-expanded={selected}
                className={`w-full rounded-xl border p-3 text-left transition sm:p-4 ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50 active:bg-slate-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">
                      {formatShort(r.offStart)} → {formatLong(r.offEnd)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Pide del <strong>{formatShort(r.vacationStart)}</strong> al{' '}
                      <strong>{formatShort(r.vacationEnd)}</strong>
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-2xl font-bold leading-none text-emerald-600 sm:text-3xl">{r.totalDays}</div>
                    <div className="mt-1 text-[11px] text-slate-500">días libres</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  <span className="rounded-full bg-emerald-600 px-2 py-0.5 font-medium text-white">
                    {r.vacationDays} de vacaciones
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800">
                    +{r.freeDays} gratis
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                    x{r.efficiency.toFixed(2)}
                  </span>
                  {r.holidays.map((h) => (
                    <span
                      key={h.date.toISOString()}
                      className="rounded-full bg-rose-100 px-2 py-0.5 font-medium text-rose-700"
                    >
                      {h.name}
                    </span>
                  ))}
                </div>

                {selected && <DayStrip window={r} classifier={classifier} />}
              </button>
            </li>
          )
        })}
      </ol>

      {results.length > INITIAL_VISIBLE && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-3 w-full rounded-xl py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 active:bg-emerald-100"
        >
          {showAll ? 'Ver menos' : `Ver más opciones (${results.length - INITIAL_VISIBLE})`}
        </button>
      )}
    </section>
  )
}
