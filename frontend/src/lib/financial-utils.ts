import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
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
