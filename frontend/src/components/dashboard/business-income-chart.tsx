import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { type BusinessComparison } from "@/lib/financial-types";
import { formatCurrency } from "@/lib/financial-utils";

interface BusinessIncomeChartProps {
  comparisons: BusinessComparison[];
  loading: boolean;
}

export function BusinessIncomeChart({ comparisons, loading }: BusinessIncomeChartProps) {
  return (
    <section aria-label="Ingresos totales B2B vs B2C" className="min-w-0 border-t border-border pt-6">
      <h2 className="mb-4 text-lg font-semibold">Ingresos totales B2B vs B2C</h2>
      {loading ? <Skeleton className="h-[280px] w-full rounded-md" /> : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparisons} margin={{ top: 8, right: 12, left: 16, bottom: 0 }} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="businessType" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatCurrency} width={90} tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: 6 }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Bar dataKey="totalIncome" name="Total de ingresos" maxBarSize={100} radius={[4, 4, 0, 0]}>
                {comparisons.map((comparison) => (
                  <Cell key={comparison.businessType} fill={comparison.businessType === "B2B" ? "var(--chart-income)" : "#38bdf8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <table className="sr-only">
            <caption>Ingresos totales por línea de negocio</caption>
            <thead><tr><th scope="col">Línea de negocio</th><th scope="col">Total de ingresos</th></tr></thead>
            <tbody>{comparisons.map((comparison) => (
              <tr key={comparison.businessType}><th scope="row">{comparison.businessType}</th><td>{formatCurrency(comparison.totalIncome)}</td></tr>
            ))}</tbody>
          </table>
        </>
      )}
    </section>
  );
}