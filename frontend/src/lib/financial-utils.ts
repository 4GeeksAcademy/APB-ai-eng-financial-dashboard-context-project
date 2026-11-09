import {
  type BusinessComparison,
  type BusinessType,
  type Category,
  type FinancialMovement,
  type KPIMetrics,
  type MetricsFacets,
  type MetricsSummaryItem,
  type MonthlyDataPoint,
  type TopCategoryItem,
} from "./financial-types";

function toYearMonthKey(value: Date): string {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthYearLabel(yearMonthKey: string): string {
  const [yearText, monthText] = yearMonthKey.split("-");
  const year = Number(yearText);
  const month = Number(monthText) - 1;
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function computeFinancialDashboard(
  movements: FinancialMovement[],
): { metrics: KPIMetrics; monthlyData: MonthlyDataPoint[] } {
  let totalIncome = 0;
  let totalOutcome = 0;
  const monthlyMap: Record<string, { income: number; outcome: number }> = {};

  for (const m of movements) {
    const yearMonthKey = toYearMonthKey(new Date(m.create_date));
    if (!monthlyMap[yearMonthKey]) {
      monthlyMap[yearMonthKey] = { income: 0, outcome: 0 };
    }

    if (m.operation_type === "income") {
      totalIncome += m.amount;
      monthlyMap[yearMonthKey].income += m.amount;
    } else {
      totalOutcome += m.amount;
      monthlyMap[yearMonthKey].outcome += m.amount;
    }
  }

  const monthlyData = Object.keys(monthlyMap)
    .sort()
    .map((yearMonthKey) => {
      const { income, outcome } = monthlyMap[yearMonthKey];
      const profit = income - outcome;
      const profitPercent = income > 0 ? (profit / income) * 100 : 0;
      return {
        month: formatMonthYearLabel(yearMonthKey),
        income,
        outcome,
        profitPercent,
      };
    });

  const profit = totalIncome - totalOutcome;
  const profitPercent = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

  return {
    metrics: { totalIncome, totalOutcome, profit, profitPercent },
    monthlyData,
  };
}

export function computeKPIs(movements: FinancialMovement[]): KPIMetrics {
  return computeFinancialDashboard(movements).metrics;
}

export function computeMonthlyData(
  movements: FinancialMovement[],
): MonthlyDataPoint[] {
  return computeFinancialDashboard(movements).monthlyData;
}

export function computeBusinessComparison(
  businessType: BusinessType,
  ranking: TopCategoryItem[],
  summary: MetricsSummaryItem[],
  availableCategories: Category[],
): BusinessComparison {
  const totalIncome = summary.reduce((total, item) => total + item.income, 0);
  const categories = totalIncome > 0
    ? ranking
        .filter((item) => item.operation_type === "income" && item.total_amount > 0 &&
          availableCategories.includes(item.category))
        .sort((first, second) => second.total_amount - first.total_amount)
        .slice(0, 5)
        .map((item) => ({
          category: item.category,
          totalIncome: item.total_amount,
          percentage: item.total_amount / totalIncome * 100,
        }))
    : [];

  return { businessType, totalIncome, categories };
}

export function getDateRangeError(
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

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
