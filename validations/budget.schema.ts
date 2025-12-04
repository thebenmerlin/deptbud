import { z } from "zod";

export const createBudgetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fiscalYear: z.string().regex(/^\d{4}$/, "Fiscal year must be 4 digits"),
  proposedAmount: z.number().positive("Proposed amount must be positive"),
  allottedAmount: z.number().positive("Allotted amount must be positive"),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  departmentId: z.string().min(1, "Department is required"),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
