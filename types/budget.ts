// types/budget.ts

export type BudgetStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export interface BudgetCreateInput {
  title: string;
  fiscalYear: string;
  department: string;
  proposedAmount: number;
  allottedAmount: number;
  description?: string;
}

export interface BudgetUpdateInput {
  title?: string;
  description?: string;
  proposedAmount?: number;
  allottedAmount?: number;
  status?: BudgetStatus;
}

export interface BudgetCategory {
  id: string;
  budgetId: string;
  categoryId: string;
  categoryName: string;
  allocatedAmount: number;
  spent: number;
  utilization: number;
}

export interface BudgetDetail {
  id: string;
  title: string;
  fiscalYear: string;
  department: string;
  proposedAmount: number;
  allottedAmount: number;
  description?: string;
  status: BudgetStatus;
  
  totalSpent: number;
  utilization: number;
  remaining: number;
  
  expenseCount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  
  categories: BudgetCategory[];
  
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetListItem {
  id: string;
  title: string;
  fiscalYear: string;
  department: string;
  allottedAmount: number;
  totalSpent: number;
  utilization: number;
  status: BudgetStatus;
  expenseCount: number;
  createdAt: Date;
}

export interface BudgetStats {
  totalBudgets: number;
  activeBudgets: number;
  archivedBudgets: number;
  totalAllocated: number;
  totalSpent: number;
  overallUtilization: number;
  atRiskBudgets: number; // > 80% utilization
  overBudgetCount: number;
}

export interface BudgetComparison {
  budgetId: string;
  title: string;
  proposedAmount: number;
  allottedAmount: number;
  actualSpent: number;
  variance: number;
  variancePercent: number;
  status: "UNDER" | "AT" | "OVER";
}

export interface BudgetTimeline {
  date: string;
  spent: number;
  approved: number;
  pending: number;
  cumulative: number;
}

export interface BudgetAlertType {
  type: "APPROACHING_LIMIT" | "EXCEEDED" | "NO_RECENT_ACTIVITY" | "PENDING_APPROVAL";
  severity: "LOW" | "MEDIUM" | "HIGH";
  message: string;
  budgetId: string;
  threshold?: number;
}