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
  date: z.string().datetime(),
});

export const approveExpenseSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  approvalNotes: z.string().optional(),
});

// EXPORT ALIASES FOR COMPONENTS
export const expenseSchema = createExpenseSchema;
export const approvalSchema = approveExpenseSchema;

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type ApproveExpenseInput = z.infer<typeof approveExpenseSchema>;
