// components/forms/BudgetForm.tsx

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { BudgetCreateInput } from "@/types/budget";
import { budgetSchema } from "@/validations/budget.schema";

interface BudgetFormProps {
  onSubmit: (data: BudgetCreateInput) => Promise<void>;
  isLoading?: boolean;
}

const DEPARTMENTS = ["CS", "IT", "EC", "ME", "CE", "EE"];
const FISCAL_YEARS = ["2024-2025", "2025-2026", "2026-2027"];

export function BudgetForm({ onSubmit, isLoading = false }: BudgetFormProps) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BudgetCreateInput>({
    resolver: zodResolver(budgetSchema),
  });

  const handleFormSubmit = async (data: BudgetCreateInput) => {
    try {
      setError(null);
      await onSubmit(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Budget Title *
        </label>
        <Input
          {...register("title")}
          placeholder="e.g., Research & Development"
          className="mt-2"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Fiscal Year *
          </label>
          <Select onValueChange={(value) => setValue("fiscalYear", value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {FISCAL_YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.fiscalYear && (
            <p className="mt-1 text-sm text-red-600">{errors.fiscalYear.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Department *
          </label>
          <Select onValueChange={(value) => setValue("department", value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Proposed Amount (₹) *
          </label>
          <Input
            {...register("proposedAmount", { valueAsNumber: true })}
            type="number"
            placeholder="0"
            className="mt-2"
          />
          {errors.proposedAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.proposedAmount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Allotted Amount (₹) *
          </label>
          <Input
            {...register("allottedAmount", { valueAsNumber: true })}
            type="number"
            placeholder="0"
            className="mt-2"
          />
          {errors.allottedAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.allottedAmount.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <Textarea
          {...register("description")}
          placeholder="Add budget description..."
          className="mt-2"
          rows={4}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Creating..." : "Create Budget"}
        </Button>
        <Button type="button" variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}