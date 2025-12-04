import { z } from "zod";

export const createExpenseSchema = z.object({
  budgetId: z.string().min(1, "Budget is required"),
  categoryId: z.string().min(1, "Category is required"),
  vendorName
