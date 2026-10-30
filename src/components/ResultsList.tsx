import { formatLong, formatShort } from '../lib/dates'
import type { VacationWindow } from '../lib/optimizer'

interface Props {
  results: VacationWindow[]
  selectedIndex: number
  onSelect: (index: number) => void
}

export function ResultsList({ results, selectedIndex, onSelect }: Props) {
  if (results.length === 0) {
    return (
      <section className="rounded-2xl bg-white p-6 text-slate-500 shadow-sm ring-1 ring-slate-200">
        No hay fechas disponibles con esta configuración.
      </section>
    )
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-1 text-lg font-semibold">Mejores fechas</h2>
      <p className="mb-4 text-sm text-slate-500">
        Ordenadas por días totales de descanso. Haz clic en una para verla en el calendario.
      </p>

      <ol className="space-y-3">
        {results.map((r, i) => {
          const selected = i === selectedIndex
          return (
            <li key={r.vacationStart.toISOString()}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="font-semibold capitalize">
                        {formatShort(r.offStart)} → {formatLong(r.offEnd)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      Pide vacaciones del{' '}
                      <strong className="capitalize">{formatShort(r.vacationStart)}</strong> al{' '}
                      <strong className="capitalize">{formatShort(r.vacationEnd)}</strong>
                    </p>
                    {r.holidays.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {r.holidays.map((h) => (
                          <span
                            key={h.date.toISOString()}
                            className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700"
                          >
                            {h.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600">{r.totalDays}</div>
                    <div className="text-xs text-slate-500">días libres</div>
                    <div className="mt-1 text-xs font-medium text-slate-600">
                      {r.vacationDays} vac. + {r.freeDays} gratis
                    </div>
                    <div className="text-xs text-slate-400">x{r.efficiency.toFixed(2)} rendimiento</div>
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
