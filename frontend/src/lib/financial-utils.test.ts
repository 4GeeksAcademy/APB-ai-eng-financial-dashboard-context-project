import { describe, expect, it } from "vitest";

import {
  computeBusinessComparison,
  computeFinancialDashboard,
  computeKPIs,
  computeMonthlyData,
  formatCurrency,
  formatPercent,
  getDateRangeError,
} from "./financial-utils";
import type { Category, FinancialMovement, MetricsFacets, TopCategoryItem } from "./financial-types";

const sampleMovements: FinancialMovement[] = [
  {
    create_date: "2024-01-10",
    amount: 1000,
    operation_type: "income",
    category: "sales",
    business_type: "B2B",
  },
  {
    create_date: "2024-01-15",
    amount: 250,
    operation_type: "outcome",
    category: "suppliers",
    business_type: "B2B",
  },
  {
    create_date: "2024-02-01",
    amount: 500,
    operation_type: "income",
    category: "sales",
    business_type: "B2C",
  },
];

describe("computeFinancialDashboard", () => {
  it("returns KPI metrics and monthly aggregates together", () => {
    const result = computeFinancialDashboard(sampleMovements);

    expect(result.metrics.totalIncome).toBe(1500);
    expect(result.metrics.totalOutcome).toBe(250);
    expect(result.monthlyData).toHaveLength(2);
    expect(result.monthlyData[0]).toEqual({
      month: "Jan 2024",
      income: 1000,
      outcome: 250,
      profitPercent: 75,
    });
  });
});

describe("computeKPIs", () => {
  it("calculates totals and profit values", () => {
    const metrics = computeKPIs(sampleMovements);

    expect(metrics).toEqual({
      totalIncome: 1500,
      totalOutcome: 250,
      profit: 1250,
      profitPercent: (1250 / 1500) * 100,
    });
  });

  it("returns 0 profitPercent when there is no income", () => {
    const onlyOutcomes: FinancialMovement[] = [
      {
        create_date: "2024-03-05",
        amount: 350,
        operation_type: "outcome",
        category: "operational",
        business_type: "B2B",
      },
    ];

    const metrics = computeKPIs(onlyOutcomes);
    expect(metrics.profitPercent).toBe(0);
  });
});

describe("computeMonthlyData", () => {
  it("returns chronological year-month points with aggregated totals", () => {
    const unsortedCrossYearMovements: FinancialMovement[] = [
      {
        create_date: "2026-01-08",
        amount: 300,
        operation_type: "income",
        category: "sales",
        business_type: "B2C",
      },
      {
        create_date: "2025-12-05",
        amount: 200,
        operation_type: "outcome",
        category: "operational",
        business_type: "B2B",
      },
      {
        create_date: "2025-12-03",
        amount: 1000,
        operation_type: "income",
        category: "sales",
        business_type: "B2B",
      },
    ];
    const monthlyData = computeMonthlyData(unsortedCrossYearMovements);

    expect(monthlyData).toHaveLength(2);
    expect(monthlyData[0]).toEqual({
      month: "Dec 2025",
      income: 1000,
      outcome: 200,
      profitPercent: 80,
    });
    expect(monthlyData[1]).toEqual({
      month: "Jan 2026",
      income: 300,
      outcome: 0,
      profitPercent: 100,
    });
  });
});

describe("formatters", () => {
  it("formats currency without decimals", () => {
    expect(formatCurrency(1234.56)).toBe("$1,235");
  });

  it("formats percent with one decimal", () => {
    expect(formatPercent(15.555)).toBe("15.6%");
  });
});

describe("computeBusinessComparison", () => {
  const ranking: TopCategoryItem[] = [
    { category: "others", operation_type: "income", total_amount: 200 },
    { category: "sales", operation_type: "income", total_amount: 600 },
  ];
  const summary = [
    { period: "2026-01", income: 600, outcome: 200, net: 400 },
    { period: "2026-02", income: 400, outcome: 100, net: 300 },
  ];

  it("uses complete group income rather than the visible ranking sum", () => {
    const result = computeBusinessComparison("B2B", ranking, summary, ["sales", "others"]);

    expect(result.totalIncome).toBe(1000);
    expect(result.categories).toEqual([
      { category: "sales", totalIncome: 600, percentage: 60 },
      { category: "others", totalIncome: 200, percentage: 20 },
    ]);
    expect(ranking[0].category).toBe("others");
  });

  it("keeps fewer than five categories without inventing rows", () => {
    expect(computeBusinessComparison("B2B", ranking, summary, ["sales", "others"]).categories).toHaveLength(2);
  });

  it("uses income categories from the selected facets and excludes zero income", () => {
    const mixedRanking: TopCategoryItem[] = [
      ...ranking,
      { category: "suppliers", operation_type: "outcome", total_amount: 900 },
      { category: "administrative", operation_type: "income", total_amount: 0 },
    ];
    const result = computeBusinessComparison("B2B", mixedRanking, summary, ["sales", "suppliers", "administrative"]);

    expect(result.categories).toEqual([{ category: "sales", totalIncome: 600, percentage: 60 }]);
  });

  it("shows the five available categories in descending income order", () => {
    const available: Category[] = ["sales", "others", "operational", "administrative", "suppliers"];
    const fiveCategories: TopCategoryItem[] = available.map((category, index) => ({
      category, operation_type: "income", total_amount: (index + 1) * 100,
    }));
    const result = computeBusinessComparison("B2B", fiveCategories, [
      { period: "2026-01", income: 1500, outcome: 0, net: 1500 },
    ], available);

    expect(result.categories).toHaveLength(5);
    expect(result.categories.map((row) => row.totalIncome)).toEqual([500, 400, 300, 200, 100]);
  });

  it("returns zero total and no categories for a group without income", () => {
    expect(computeBusinessComparison("B2C", [], [], [])).toEqual({
      businessType: "B2C", totalIncome: 0, categories: [],
    });
  });

  it("keeps B2B and B2C totals separate", () => {
    const business = computeBusinessComparison("B2B", ranking, summary, ["sales", "others"]);
    const consumer = computeBusinessComparison("B2C", [
      { category: "sales", operation_type: "income", total_amount: 300 },
    ], [{ period: "2026-01", income: 300, outcome: 0, net: 300 }], ["sales"]);

    expect(business.totalIncome).toBe(1000);
    expect(consumer).toEqual({ businessType: "B2C", totalIncome: 300,
      categories: [{ category: "sales", totalIncome: 300, percentage: 100 }] });
  });
});

describe("getDateRangeError", () => {
  const facets: MetricsFacets = {
    min_date: "2026-01-01", max_date: "2026-12-31",
    categories: [], business_types: ["B2B", "B2C"], operation_types: ["income"],
  };

  it.each([
    ["", ""], ["2026-02-01", ""], ["", "2026-02-28"],
    ["2026-01-01", "2026-12-31"], ["2026-02-15", "2026-02-15"],
  ])("accepts historical, partial or inclusive range %s to %s", (start, end) => {
    expect(getDateRangeError(start, end, facets)).toBeNull();
  });

  it.each([
    ["2026-03-01", "2026-02-01"], ["2026-02-30", ""],
    ["01/02/2026", ""], ["2025-12-31", ""], ["", "2027-01-01"],
  ])("rejects inverted, malformed or unavailable range %s to %s", (start, end) => {
    expect(getDateRangeError(start, end, facets)).not.toBeNull();
  });
});
