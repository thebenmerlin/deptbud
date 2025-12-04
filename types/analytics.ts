// types/analytics.ts

export interface DashboardMetrics {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  utilizationPercent: number;
  expenseCount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export interface BudgetUtilization {
  budgetId: string;
  budgetTitle: string;
  allocated: number;
  spent: number;
  utilization: number;
  remaining: number;
  status: "UNDER" | "AT" | "OVER";
}

export interface CategoryAnalytics {
  categoryId: string;
  categoryName: string;
  totalExpenses: number;
  totalAmount: number;
  averageAmount: number;
  percentOfTotal: number;
  trend: "UP" | "DOWN" | "STABLE";
}

export interface MonthlyAnalytics {
  month: string;
  totalExpenses: number;
  expenseCount: number;
  averagePerExpense: number;
  dayCount: number;
}

export interface DepartmentAnalytics {
  department: string;
  totalBudgets: number;
  totalAllocated: number;
  totalSpent: number;
  utilizationPercent: number;
  topCategory: string;
  topCategoryAmount: number;
}

export interface ApprovalAnalytics {
  approverName: string;
  totalApproved: number;
  totalRejected: number;
  averageApprovalTime: number; // in hours
  approvalRate: number;
  rejectionRate: number;
}

export interface ChartData {
  label: string;
  value: number;
  percentage?: number;
  color?: string;
}

export interface TrendData {
  date: string;
  value: number;
  target?: number;
}

export interface ComparisonData {
  label: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

export interface AlertMetric {
  type: "WARNING" | "CRITICAL" | "INFO";
  message: string;
  value?: number;
  threshold?: number;
  actionRequired: boolean;
}

export interface AnalyticsResponse {
  metrics: DashboardMetrics;
  budgetUtilization: BudgetUtilization[];
  categoryAnalytics: CategoryAnalytics[];
  monthlyTrends: MonthlyAnalytics[];
  departmentAnalytics: DepartmentAnalytics[];
  alerts: AlertMetric[];
  generatedAt: Date;
}