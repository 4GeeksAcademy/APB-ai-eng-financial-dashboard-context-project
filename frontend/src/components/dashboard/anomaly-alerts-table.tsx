import { type MetricsAlert } from "@/lib/financial-types";
import { formatCurrency, formatPercent } from "@/lib/financial-utils";

interface AnomalyAlertsTableProps {
  alerts: MetricsAlert[];
  loading: boolean;
  error: string | null;
  thresholdValue: string;
  thresholdError: string | null;
  onThresholdChange: (value: string) => void;
}

export function AnomalyAlertsTable({
  alerts,
  loading,
  error,
  thresholdValue,
  thresholdError,
  onThresholdChange,
}: AnomalyAlertsTableProps) {
  return (
    <section lang="es" aria-label="Alertas de anomalías" aria-busy={loading}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-lg font-semibold">Alertas de gasto</h2>
        <div className="flex flex-col gap-1 sm:w-64">
          <label htmlFor="alert-threshold" className="text-sm">
            Umbral de alerta
          </label>
          <input
            id="alert-threshold"
            type="number"
            min="0.1"
            max="1.0"
            step="any"
            value={thresholdValue}
            aria-invalid={Boolean(thresholdError)}
            aria-describedby={thresholdError ? "alert-threshold-error" : undefined}
            onChange={(event) => onThresholdChange(event.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
          {thresholdError ? (
            <p id="alert-threshold-error" role="alert" className="text-sm text-destructive-foreground">
              {thresholdError}
            </p>
          ) : null}
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[36rem] text-sm">
          <thead className="bg-secondary">
            <tr className="border-b border-border">
              <th scope="col" className="px-4 py-3 text-left font-medium">Periodo</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">outcome registrado</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">M.movil 3 P. anteriores</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">incremento %</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr><td colSpan={4} className="px-4 py-5"><p role="alert">{error}</p></td></tr>
            ) : loading ? (
              <tr><td colSpan={4} className="px-4 py-5"><p role="status">Cargando alertas...</p></td></tr>
            ) : alerts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-5">
                  <p role="status" className="whitespace-pre-wrap">{" No se encontraron anómalias materiales"}</p>
                </td>
              </tr>
            ) : alerts.map((alert) => (
              <tr key={alert.period} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{alert.period}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(alert.outcome_total)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(alert.baseline_average)}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums text-amber-200">{formatPercent(alert.increase_ratio * 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}