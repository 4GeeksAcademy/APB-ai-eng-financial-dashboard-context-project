import { LayoutDashboard } from 'lucide-react'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  idPrefix?: string
  period?: string
  startDate: string
  endDate: string
  minDate?: string
  maxDate?: string
  dateError?: string | null
  onDateChange: (field: 'startDate' | 'endDate', value: string) => void
}

export function DashboardHeader({
  title = 'Financial Overview',
  subtitle = 'Executive metrics dashboard',
  idPrefix = '',
  period,
  startDate,
  endDate,
  minDate,
  maxDate,
  dateError,
  onDateChange,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LayoutDashboard size={18} />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-foreground tracking-tight">{title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div lang="es" className="flex min-w-0 flex-col gap-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label htmlFor={`${idPrefix}start-date`} className="flex min-w-0 flex-col gap-1 text-sm">
            Fecha de inicio
            <input
              id={`${idPrefix}start-date`}
              type="date"
              value={startDate}
              min={minDate}
              max={maxDate}
              disabled={!minDate || !maxDate}
              aria-invalid={Boolean(dateError)}
              aria-describedby={dateError ? `${idPrefix}available-date-range ${idPrefix}date-range-error` : `${idPrefix}available-date-range`}
              onChange={(event) => onDateChange('startDate', event.target.value)}
              className="min-w-0 w-full rounded-md border border-border bg-secondary px-3 py-2 text-foreground [color-scheme:dark] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
          </label>
          <label htmlFor={`${idPrefix}end-date`} className="flex min-w-0 flex-col gap-1 text-sm">
            Fecha de fin
            <input
              id={`${idPrefix}end-date`}
              type="date"
              value={endDate}
              min={minDate}
              max={maxDate}
              disabled={!minDate || !maxDate}
              aria-invalid={Boolean(dateError)}
              aria-describedby={dateError ? `${idPrefix}available-date-range ${idPrefix}date-range-error` : `${idPrefix}available-date-range`}
              onChange={(event) => onDateChange('endDate', event.target.value)}
              className="min-w-0 w-full rounded-md border border-border bg-secondary px-3 py-2 text-foreground [color-scheme:dark] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            />
          </label>
        </div>
        <p id={`${idPrefix}available-date-range`} className="text-xs text-muted-foreground">
          {minDate && maxDate
            ? `Rango disponible: ${minDate} a ${maxDate}`
            : 'Rango disponible: pendiente'}
        </p>
        {dateError ? (
          <p id={`${idPrefix}date-range-error`} role="alert" className="max-w-md text-sm text-destructive-foreground">
            {dateError}
          </p>
        ) : null}
        {period ? <p className="text-xs text-muted-foreground">{period}</p> : null}
      </div>
    </header>
  )
}
