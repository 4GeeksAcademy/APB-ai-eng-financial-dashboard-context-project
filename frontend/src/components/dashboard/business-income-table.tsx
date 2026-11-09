import { type BusinessComparison } from "@/lib/financial-types";
import { formatCurrency, formatPercent } from "@/lib/financial-utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BusinessIncomeTableProps {
  comparison: BusinessComparison;
  loading: boolean;
}

export function BusinessIncomeTable({ comparison, loading }: BusinessIncomeTableProps) {
  return (
    <section aria-label={`Ingresos ${comparison.businessType}`} className="min-w-0">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">{comparison.businessType}</h2>
        <p className="text-sm text-muted-foreground">
          Total de ingresos: <span className="font-medium text-foreground tabular-nums">{formatCurrency(comparison.totalIncome)}</span>
        </p>
      </div>
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[22rem] text-sm">
          <caption className="sr-only">Categorías de ingreso de {comparison.businessType}</caption>
          <thead className="bg-secondary">
            <tr className="border-b border-border">
              <th scope="col" className="px-3 py-3 text-left font-medium">Categoría</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">Total de ingresos</th>
              <th scope="col" className="px-3 py-3 text-right font-medium">% del grupo</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="px-3 py-4"><Skeleton className="h-8 w-full" /></td></tr>
            ) : comparison.categories.map((row) => (
              <tr key={row.category} className="border-b border-border last:border-0">
                <th scope="row" className="px-3 py-3 text-left font-medium">{row.category}</th>
                <td className="px-3 py-3 text-right tabular-nums">{formatCurrency(row.totalIncome)}</td>
                <td className="px-3 py-3 text-right tabular-nums">{formatPercent(row.percentage)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!loading && comparison.categories.length === 0 ? (
        <p role="status" className="mt-3 text-sm text-muted-foreground">Sin ingresos en el periodo.</p>
      ) : null}
    </section>
  );
}