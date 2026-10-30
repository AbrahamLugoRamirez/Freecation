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

export function SettingsForm({ settings, years, onChange }: Props) {
  const toggleDay = (day: number) => {
    const workDays = settings.workDays.includes(day)
      ? settings.workDays.filter((d) => d !== day)
      : [...settings.workDays, day]
    onChange({ ...settings, workDays })
  }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-lg font-semibold">Tus datos</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-600">Días de vacaciones (hábiles)</span>
          <input
            type="number"
            min={1}
            max={60}
            value={settings.vacationDays}
            onChange={(e) =>
              onChange({ ...settings, vacationDays: Math.max(1, Math.min(60, Number(e.target.value) || 1)) })
            }
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-600">Año</span>
          <select
            value={settings.year}
            onChange={(e) => onChange({ ...settings, year: Number(e.target.value) })}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-slate-600">¿Qué días trabajas?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {WEEK_ORDER.map((day) => {
            const active = settings.workDays.includes(day)
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                aria-pressed={active}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {WEEKDAY_NAMES[day]}
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
