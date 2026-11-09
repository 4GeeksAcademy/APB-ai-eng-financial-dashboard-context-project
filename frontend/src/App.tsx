import { lazy, Suspense, useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type FinancialMovement,
  type KPIMetrics,
  type MetricsFacets,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeFinancialDashboard } from "@/lib/financial-utils";

const IncomeOutcomeChart = lazy(() =>
  import("@/components/dashboard/income-outcome-chart").then((module) => ({
    default: module.IncomeOutcomeChart,
  })),
);
const ProfitPercentChart = lazy(() =>
  import("@/components/dashboard/profit-percent-chart").then((module) => ({
    default: module.ProfitPercentChart,
  })),
);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function fetchFinancialData(
  startDate: string,
  endDate: string,
  signal: AbortSignal,
): Promise<FinancialMovement[]> {
  const params = new URLSearchParams();
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);
  const query = params.size ? `?${params}` : "";

  return fetch(`${API_BASE_URL}/api/metrics${query}`, { signal }).then(
    (response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch financial data: ${response.status}`);
      }
      return response.json() as Promise<FinancialMovement[]>;
    },
  );
}

function getDateRangeError(
  startDate: string,
  endDate: string,
  facets: MetricsFacets,
): string | null {
  for (const value of [startDate, endDate]) {
    if (!value) continue;
    const parsedDate = new Date(`${value}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== value
    ) {
      return "Introduce una fecha valida en formato YYYY-MM-DD.";
    }
    if (value < facets.min_date || value > facets.max_date) {
      return "Las fechas deben estar dentro del rango disponible.";
    }
  }
  if (startDate && endDate && startDate > endDate) {
    return "Rango no valido: la fecha de inicio no puede ser posterior a la de fin.";
  }
  return null;
}

function ChartLoadingFallback() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-4">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="mt-1 h-3 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[280px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facets, setFacets] = useState<MetricsFacets | null>(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [period, setPeriod] = useState("");
  const dateError = facets
    ? getDateRangeError(dateRange.startDate, dateRange.endDate, facets)
    : null;

  function handleDateChange(field: "startDate" | "endDate", value: string) {
    const nextRange = { ...dateRange, [field]: value };
    setDateRange(nextRange);
    setLoading(
      Boolean(facets) &&
        !getDateRangeError(nextRange.startDate, nextRange.endDate, facets!),
    );
    setError(null);
  }

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    fetch(`${API_BASE_URL}/api/metrics/facets`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch date range: ${response.status}`);
        }
        return response.json() as Promise<MetricsFacets>;
      })
      .then((availableFacets) => {
        if (isActive) setFacets(availableFacets);
      })
      .catch(() => {
        if (!isActive) return;
        setError("No se pudo cargar el rango de fechas disponible.");
        setLoading(false);
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!facets || dateError) return;
    let isActive = true;
    const controller = new AbortController();

    fetchFinancialData(dateRange.startDate, dateRange.endDate, controller.signal)
      .then((movements) => {
        if (!isActive) return;
        const dashboardData = computeFinancialDashboard(movements);
        setMetrics(dashboardData.metrics);
        setMonthlyData(dashboardData.monthlyData);
        setPeriod(
          `${dateRange.startDate || facets.min_date} a ${dateRange.endDate || facets.max_date}`,
        );
        setError(null);
      })
      .catch(() => {
        if (!isActive) return;
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [dateRange, facets, dateError]);

  return (
    <>
      <p role="status" className="sr-only">
        {loading ? "Loading financial data" : ""}
      </p>
      <main
        aria-busy={loading}
        className="dark min-h-screen bg-background text-foreground"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            <DashboardHeader
              period={period}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              minDate={facets?.min_date}
              maxDate={facets?.max_date}
              dateError={dateError}
              onDateChange={handleDateChange}
            />

            {!dateRange.startDate && !dateRange.endDate ? (
              <p
                lang="es"
                role="status"
                className="rounded-md border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-200"
              >
                No se seleccionaron fechas, se muestra data histórica
              </p>
            ) : null}

            {error ? (
              <div
                lang="es"
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground"
              >
                {error}
              </div>
            ) : null}

            <section aria-label="Key performance indicators">
              <KPIRow metrics={metrics} loading={loading} />
            </section>

            <section
              aria-label="Financial charts"
              className="grid grid-cols-1 gap-4 xl:grid-cols-2"
            >
              <Suspense fallback={<ChartLoadingFallback />}>
                <IncomeOutcomeChart data={monthlyData} loading={loading} />
              </Suspense>
              <Suspense fallback={<ChartLoadingFallback />}>
                <ProfitPercentChart data={monthlyData} loading={loading} />
              </Suspense>
            </section>
          </div>
        </div>
    </main>
    </>
  );
}

export default App;
