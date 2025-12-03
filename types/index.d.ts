import { Role, BudgetStatus, ExpenseStatus } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  department?: string;
  avatar?: string;
  isActive: boolean;
  emailVerified?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  title: string;
  fiscalYear: string;
  department: string;
  proposedAmount: number;
  allottedAmount: number;
  description?: string;
  status: BudgetStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  id: string;
  budgetId: string;
  categoryId: string;
  allocatedAmount: number;
  spent: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  budgetId: string;
  categoryId: string;
  vendorName: string;
  vendorEmail?: string;
  vendorPhone?: string;
  amount: number;
  description: string;
  activityName: string;
  receiptUrl?: string;
  receiptPublicId?: string;
  transactionDate: Date;
  status: ExpenseStatus;
  approvalNotes?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  changes?: any;
  metadata?: any;
  timestamp: Date;
}

export interface DashboardStats {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  budgetUtilization: number;
  pendingApprovals: number;
  overBudgetCategories: number;
}

export interface ChartData {
  month: string;
  spent: number;
  budget: number;
}
