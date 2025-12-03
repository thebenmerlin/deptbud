import { z } from "zod";

export const createExpenseSchema = z.object({
  budgetId: z.string().min(1, "Budget is required"),
  categoryId: z.string().min(1, "Category is required"),
  vendorName: z.string().min(2, "Vendor name is required"),
  vendorEmail: z.string().email().optional().or(z.literal("")),
  vendorPhone: z.string().optional().or(z.literal("")),
  amount: z
    .number()
    .min(1, "Amount must be greater than 0")
    .max(5000000, "Maximum expense amount is ₹50 Lakhs"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  activityName: z.string().min(2, "Activity name is required"),
  transactionDate: z.string().datetime(),
});

export const approveExpenseSchema = z.object({
  expenseId: z.string().min(1, "Expense ID is required"),
  status: z.enum(["APPROVED", "REJECTED"]),
  approvalNotes: z.string().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type ApproveExpenseInput = z.infer<typeof approveExpenseSchema>;
