// types/expense.ts

export type ExpenseStatus = "PENDING" | "APPROVED" | "REJECTED" | "PAID";

export interface ExpenseCreateInput {
  budgetId: string;
  categoryId: string;
  vendorName: string;
  vendorEmail?: string;
  vendorPhone?: string;
  amount: number;
  description: string;
  activityName: string;
  transactionDate: Date;
}

export interface ExpenseUpdateInput {
  categoryId?: string;
  vendorName?: string;
  vendorEmail?: string;
  vendorPhone?: string;
  amount?: number;
  description?: string;
  activityName?: string;
  transactionDate?: Date;
}

export interface ExpenseApprovalInput {
  status: "APPROVED" | "REJECTED";
  approvalNotes?: string;
}

export interface ExpenseDetail {
  id: string;
  budgetId: string;
  categoryId: string;
  categoryName: string;
  vendorName: string;
  vendorEmail?: string;
  vendorPhone?: string;
  amount: number;
  description: string;
  activityName: string;
  receiptUrl?: string;
  transactionDate: Date;
  status: ExpenseStatus;
  approvalNotes?: string;

  createdBy: string;
  createdByName: string;
  createdByEmail: string;

  approvedBy?: string;
  approvedByName?: string;
  approvalDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseListItem {
  id: string;
  budgetId: string;
  vendorName: string;
  categoryName: string;
  amount: number;
  status: ExpenseStatus;
  transactionDate: Date;
  createdAt: Date;
  createdByName: string;
}

export interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  pendingCount: number;
  pendingAmount: number;
  approvedCount: number;
  approvedAmount: number;
  rejectedCount: number;
  rejectedAmount: number;
  paidCount: number;
  paidAmount: number;
  averageAmount: number;
  approvalRate: number;
}

export interface ExpenseFilter {
  budgetId?: string;
  categoryId?: string;
  status?: ExpenseStatus;
  vendorName?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  createdBy?: string;
}

export interface ExpensePaginatedResponse {
  data: ExpenseListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasMore: boolean;
}

export interface ExpenseApprovalQueue {
  id: string;
  vendorName: string;
  amount: number;
  categoryName: string;
  budgetTitle: string;
  submittedBy: string;
  submittedDate: Date;
  daysWaiting: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}

export interface ExpenseTimeline {
  date: string;
  submitted: number;
  approved: number;
  rejected: number;
  totalAmount: number;
}

export interface ExpenseActivityLog {
  id: string;
  expenseId: string;
  action: "CREATED" | "UPDATED" | "SUBMITTED" | "APPROVED" | "REJECTED" | "RECEIPT_ATTACHED";
  performedBy: string;
  performedByEmail: string;
  changes?: Record<string, any>;
  timestamp: Date;
}

export interface ExpenseBulkAction {
  expenseIds: string[];
  action: "APPROVE" | "REJECT" | "DELETE";
  approvalNotes?: string;
}

export interface ExpenseAlertType {
  type: "PENDING_APPROVAL" | "OVERDUE" | "DUPLICATE_VENDOR" | "UNUSUAL_AMOUNT";
  severity: "LOW" | "MEDIUM" | "HIGH";
  message: string;
  expenseId: string;
  suggestedAction?: string;
}