import { useMemo, useState } from 'react'
import { HolidayList } from './components/HolidayList'
import { ResultsList } from './components/ResultsList'
import { SettingsForm, type Settings } from './components/SettingsForm'
import { YearCalendar } from './components/YearCalendar'
import { today } from './lib/dates'
import { createClassifier, findBestWindows } from './lib/optimizer'

const TODAY = today()
const CURRENT_YEAR = TODAY.getUTCFullYear()
const YEARS = [CURRENT_YEAR, CURRENT_YEAR + 1, CURRENT_YEAR + 2]

function App() {
  const [settings, setSettings] = useState<Settings>({
    // A partir de octubre suele interesar más planear el año siguiente
    year: TODAY.getUTCMonth() >= 9 ? CURRENT_YEAR + 1 : CURRENT_YEAR,
    vacationDays: 5,
    workDays: [1, 2, 3, 4, 5],
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const results = useMemo(
    () =>
      findBestWindows({
        year: settings.year,
        vacationDays: settings.vacationDays,
        workDays: settings.workDays,
        minDate: TODAY,
        limit: 10,
      }),
    [settings],
  )

  const classifier = useMemo(
    () => createClassifier([settings.year - 1, settings.year, settings.year + 1], settings.workDays),
    [settings.year, settings.workDays],
  )

  const updateSettings = (next: Settings) => {
    setSettings(next)
    setSelectedIndex(0)
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 px-1 sm:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          🌴 Freecation <span className="text-emerald-600">Colombia</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Dinos cuántos días de vacaciones tienes y te mostramos cuándo tomarlos para aprovechar al máximo los
          puentes festivos.
        </p>
      </header>

      {/* En celular: datos → resultados → calendario → festivos. En escritorio los festivos van al lado. */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4 sm:space-y-6">
          <SettingsForm settings={settings} years={YEARS} onChange={updateSettings} />
          <ResultsList
            results={results}
            classifier={classifier}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </div>
        <aside className="order-last lg:order-none">
          <HolidayList year={settings.year} />
        </aside>
        <div className="lg:col-span-2">
          <YearCalendar year={settings.year} classifier={classifier} selected={results[selectedIndex]} />
        </div>
      </div>

      <footer className="mt-8 px-1 text-center text-xs text-slate-400">
        Festivos calculados según la Ley 51 de 1983 (Ley Emiliani) y el calendario de Semana Santa.
      </footer>
    </div>
  )
}

export default App
