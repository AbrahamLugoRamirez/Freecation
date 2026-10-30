import { addDays, WEEKDAY_SHORT } from '../lib/dates'
import type { DayClassifier, VacationWindow } from '../lib/optimizer'
import { dayStyle } from './dayStyle'

interface Props {
  window: VacationWindow
  classifier: DayClassifier
}

/** Vista compacta día a día del bloque, útil en celular donde el calendario queda lejos. */
export function DayStrip({ window, classifier }: Props) {
  const days: Date[] = []
  for (let d = window.offStart; d <= window.offEnd; d = addDays(d, 1)) days.push(d)

  return (
    <div className="mt-3 flex flex-wrap gap-1">
      {days.map((date) => (
        <div
          key={date.toISOString()}
          title={classifier.holidayName(date)}
          className={`flex h-11 w-9 flex-col items-center justify-center rounded-lg text-sm leading-tight ${dayStyle(date, classifier, window)}`}
        >
          <span className="text-[10px] font-normal opacity-75">{WEEKDAY_SHORT[date.getUTCDay()]}</span>
          {date.getUTCDate()}
        </div>
      ))}
    </div>
  )
}
