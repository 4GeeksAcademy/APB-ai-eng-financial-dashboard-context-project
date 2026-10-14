import { lazy, Suspense, useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type FinancialMovement,
  type KPIMetrics,
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
let financialDataRequest: Promise<FinancialMovement[]> | undefined;

function fetchFinancialData(): Promise<FinancialMovement[]> {
  if (!financialDataRequest) {
    financialDataRequest = fetch(`${API_BASE_URL}/api/metrics`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch financial data: ${response.status}`);
        }
        return response.json() as Promise<FinancialMovement[]>;
      })
      .catch((error: unknown) => {
        financialDataRequest = undefined;
        throw error;
      });
  }
  return financialDataRequest;
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

  useEffect(() => {
    let isActive = true;

    fetchFinancialData()
      .then((movements) => {
        if (!isActive) return;
        const dashboardData = computeFinancialDashboard(movements);
        setMetrics(dashboardData.metrics);
        setMonthlyData(dashboardData.monthlyData);
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
    };
  }, []);

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
            <DashboardHeader period="2024 - Full Year" />

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
