import { z } from "zod";

export const createBudgetSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  fiscalYear: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "Fiscal year must be in format YYYY-YYYY"),
  department: z.string().min(2, "Department is required"),
  proposedAmount: z
    .number()
    .min(10000, "Minimum proposed amount is ₹10,000")
    .max(100000000, "Maximum proposed amount is ₹1 Crore"),
  allottedAmount: z
    .number()
    .min(10000, "Minimum allotted amount is ₹10,000")
    .max(100000000, "Maximum allotted amount is ₹1 Crore"),
  description: z.string().optional(),
});

export const updateBudgetSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  fiscalYear: z
    .string()
    .regex(/^\d{4}-\d{4}$/, "Fiscal year must be in format YYYY-YYYY")
    .optional(),
  proposedAmount: z
    .number()
    .min(10000, "Minimum proposed amount is ₹10,000")
    .max(100000000, "Maximum proposed amount is ₹1 Crore")
    .optional(),
  allottedAmount: z
    .number()
    .min(10000, "Minimum allotted amount is ₹10,000")
    .max(100000000, "Maximum allotted amount is ₹1 Crore")
    .optional(),
  description: z.string().optional(),
});

export const budgetSchema = createBudgetSchema;
export const updateBudgetValidation = updateBudgetSchema;

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
