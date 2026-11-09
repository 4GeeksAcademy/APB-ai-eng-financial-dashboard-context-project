export type OperationType = 'income' | 'outcome'
export type Category = 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'
export type BusinessType = 'B2B' | 'B2C'

export interface FinancialMovement {
  create_date: string // ISO date
  amount: number
  operation_type: OperationType
  category: Category
  business_type: BusinessType
}

export interface MetricsFacets {
  operation_types: OperationType[]
  business_types: BusinessType[]
  categories: Category[]
  min_date: string
  max_date: string
}

export interface MetricsAlert {
  period: string
  outcome_total: number
  baseline_average: number
  increase_ratio: number
}

export interface KPIMetrics {
  totalIncome: number
  totalOutcome: number
  profit: number
  profitPercent: number
}

export interface TopCategoryItem {
  category: Category
  operation_type: OperationType
  total_amount: number
}

export interface MetricsSummaryItem {
  period: string
  income: number
  outcome: number
  net: number
}

export interface IncomeCategoryRow {
  category: Category
  totalIncome: number
  percentage: number
}

export interface BusinessComparison {
  businessType: BusinessType
  totalIncome: number
  categories: IncomeCategoryRow[]
}

export interface MonthlyDataPoint {
  month: string
  income: number
  outcome: number
  profitPercent: number
}
