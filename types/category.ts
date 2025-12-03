// types/category.ts

export interface CategoryDetail {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryCreateInput {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface CategoryUpdateInput {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

export interface CategoryWithStats {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  expenseCount: number;
  totalAmount: number;
  averageAmount: number;
  budgetCount: number;
  lastUsed?: Date;
}

export interface CategoryListItem {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  expenseCount: number;
  isActive: boolean;
}

export interface CategoryStats {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  mostUsedCategory: string;
  leastUsedCategory: string;
  averageExpensesPerCategory: number;
}

export interface CategoryUsage {
  categoryId: string;
  categoryName: string;
  expenseCount: number;
  totalSpent: number;
  percentOfTotal: number;
  budgetCount: number;
  departments: string[];
}

export interface CategoryTrend {
  categoryName: string;
  month: string;
  expenseCount: number;
  totalAmount: number;
  trend: "UP" | "DOWN" | "STABLE";
}

export interface CategoryBudgetAllocation {
  categoryId: string;
  categoryName: string;
  budgetId: string;
  budgetTitle: string;
  allocatedAmount: number;
  spent: number;
  utilization: number;
  remaining: number;
}

export interface CategoryPaginatedResponse {
  data: CategoryListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasMore: boolean;
}

export interface CategoryFilter {
  search?: string;
  isActive?: boolean;
  hasBudgetAllocations?: boolean;
}

export interface BulkCategoryCreateInput {
  categories: CategoryCreateInput[];
}

export interface BulkCategoryUpdateInput {
  categories: Array<{ id: string } & CategoryUpdateInput>;
}

export interface CategoryReportData {
  category: CategoryDetail;
  statistics: CategoryStats;
  budgetAllocations: CategoryBudgetAllocation[];
  monthlyTrends: CategoryTrend[];
  generatedAt: Date;
}