import { WEEKDAY_NAMES } from '../lib/dates'

export interface Settings {
  year: number
  vacationDays: number
  workDays: number[]
}

interface Props {
  settings: Settings
  years: number[]
  onChange: (settings: Settings) => void
}

// Lunes primero, como se acostumbra en Colombia
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]
const MAX_DAYS = 60

export function SettingsForm({ settings, years, onChange }: Props) {
  const toggleDay = (day: number) => {
    const workDays = settings.workDays.includes(day)
      ? settings.workDays.filter((d) => d !== day)
      : [...settings.workDays, day]
    onChange({ ...settings, workDays })
  }

  const setVacationDays = (value: number) =>
    onChange({ ...settings, vacationDays: Math.max(1, Math.min(MAX_DAYS, value || 1)) })

  const stepButton =
    'flex h-12 w-12 shrink-0 items-center justify-center text-2xl font-semibold text-slate-600 transition hover:bg-slate-100 active:bg-slate-200 disabled:opacity-30'

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold">Tus datos</h2>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        <div>
          <label htmlFor="vacation-days" className="text-sm font-medium text-slate-600">
            Días de vacaciones (hábiles)
          </label>
          <div className="mt-1 flex overflow-hidden rounded-lg border border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200">
            <button
              type="button"
              aria-label="Restar un día"
              onClick={() => setVacationDays(settings.vacationDays - 1)}
              disabled={settings.vacationDays <= 1}
              className={stepButton}
            >
              −
            </button>
            <input
              id="vacation-days"
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_DAYS}
              value={settings.vacationDays}
              onChange={(e) => setVacationDays(Number(e.target.value))}
              className="w-full min-w-0 border-x border-slate-200 text-center text-lg font-semibold focus:outline-none"
            />
            <button
              type="button"
              aria-label="Sumar un día"
              onClick={() => setVacationDays(settings.vacationDays + 1)}
              disabled={settings.vacationDays >= MAX_DAYS}
              className={stepButton}
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="year" className="text-sm font-medium text-slate-600">
            Año
          </label>
          <select
            id="year"
            value={settings.year}
            onChange={(e) => onChange({ ...settings, year: Number(e.target.value) })}
            className="mt-1 h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-slate-600">¿Qué días trabajas?</legend>
        <div className="mt-2 grid grid-cols-7 gap-1.5 sm:flex sm:flex-wrap sm:gap-2">
          {WEEK_ORDER.map((day) => {
            const active = settings.workDays.includes(day)
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                aria-pressed={active}
                aria-label={WEEKDAY_NAMES[day]}
                className={`h-11 rounded-lg text-sm font-medium transition sm:h-auto sm:rounded-full sm:px-4 sm:py-1.5 ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <span className="sm:hidden">{WEEKDAY_NAMES[day].slice(0, 3)}</span>
                <span className="hidden sm:inline">{WEEKDAY_NAMES[day]}</span>
              </button>
            )
          })}
        </div>
        {settings.workDays.length === 0 && (
          <p className="mt-2 text-sm text-rose-600">Selecciona al menos un día laboral.</p>
        )}
      </fieldset>
    </section>
  )
}
