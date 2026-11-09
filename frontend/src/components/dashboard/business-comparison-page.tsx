import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { BusinessIncomeTable } from "@/components/dashboard/business-income-table";
import { BusinessIncomeChart } from "@/components/dashboard/business-income-chart";
import {
  type BusinessComparison,
  type BusinessType,
  type MetricsFacets,
  type MetricsSummaryItem,
  type TopCategoryItem,
} from "@/lib/financial-types";
import { computeBusinessComparison, getDateRangeError } from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchBusinessComparison(
  businessType: BusinessType,
  startDate: string,
  endDate: string,
  signal: AbortSignal,
): Promise<BusinessComparison> {
  const params = new URLSearchParams({ business_type: businessType, operation_type: "income" });
  if (startDate) params.set("start_date", startDate);
  if (endDate) params.set("end_date", endDate);

  async function request<Result>(endpoint: string): Promise<Result> {
    const response = await fetch(`${API_BASE_URL}/api/metrics/${endpoint}`, { signal });
    if (!response.ok) throw new Error(`Failed to fetch comparison: ${response.status}`);
    return response.json() as Promise<Result>;
  }

  const [facets, ranking, summary] = await Promise.all([
    request<MetricsFacets>(`facets?${params}`),
    request<TopCategoryItem[]>(`categories/top?${params}&limit=5`),
    request<MetricsSummaryItem[]>(`summary?${params}&group_by=month`),
  ]);
  return computeBusinessComparison(businessType, ranking, summary, facets.categories);
}

interface BusinessComparisonPageProps {
  facets: MetricsFacets | null;
  facetsError: string | null;
}

export function BusinessComparisonPage({ facets, facetsError }: BusinessComparisonPageProps) {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [comparisons, setComparisons] = useState<BusinessComparison[]>([
    { businessType: "B2B", totalIncome: 0, categories: [] },
    { businessType: "B2C", totalIncome: 0, categories: [] },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("");
  const dateError = facets ? getDateRangeError(dateRange.startDate, dateRange.endDate, facets) : null;

  function handleDateChange(field: "startDate" | "endDate", value: string) {
    const nextRange = { ...dateRange, [field]: value };
    setDateRange(nextRange);
    setLoading(facets !== null && !getDateRangeError(nextRange.startDate, nextRange.endDate, facets));
    setError(null);
  }

  useEffect(() => {
    if (!facets || dateError) return;
    let isActive = true;
    const controller = new AbortController();

    Promise.all([
      fetchBusinessComparison("B2B", dateRange.startDate, dateRange.endDate, controller.signal),
      fetchBusinessComparison("B2C", dateRange.startDate, dateRange.endDate, controller.signal),
    ])
      .then((results) => {
        if (!isActive) return;
        setComparisons(results);
        setPeriod(`${dateRange.startDate || facets.min_date} a ${dateRange.endDate || facets.max_date}`);
        setError(null);
      })
      .catch(() => {
        if (isActive) setError("No se pudo cargar la comparativa de ingresos.");
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
    <section lang="es" aria-label="Comparativa B2B vs B2C" className="flex flex-col gap-8" aria-busy={loading && !facetsError}>
      <DashboardHeader
        title="Comparativa B2B vs B2C"
        subtitle="Ingresos por línea de negocio"
        idPrefix="comparison-"
        period={period}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        minDate={facets?.min_date}
        maxDate={facets?.max_date}
        dateError={dateError}
        onDateChange={handleDateChange}
      />
      {error || facetsError ? <p role="alert" className="text-sm text-destructive-foreground">{error || facetsError}</p> : null}
      {loading && !error && !facetsError ? <p role="status" className="text-sm text-muted-foreground">Cargando comparativa...</p> : null}
      {!error && !facetsError ? (
        <>
          <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
            {comparisons.map((comparison) => (
              <BusinessIncomeTable key={comparison.businessType} comparison={comparison} loading={loading} />
            ))}
          </div>
          <BusinessIncomeChart comparisons={comparisons} loading={loading} />
        </>
      ) : null}
    </section>
  );
}