// components/forms/ExpenseForm.tsx

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
import { ExpenseCreateInput } from "@/types/expense";
import { expenseSchema } from "@/validations/expense.schema";

interface ExpenseFormProps {
  budgets: Array<{ id: string; title: string }>;
  categories: Array<{ id: string; name: string }>;
  onSubmit: (data: ExpenseCreateInput) => Promise<void>;
  isLoading?: boolean;
}

export function ExpenseForm({
  budgets,
  categories,
  onSubmit,
  isLoading = false,
}: ExpenseFormProps) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExpenseCreateInput>({
    resolver: zodResolver(expenseSchema),
  });

  const handleFormSubmit = async (data: ExpenseCreateInput) => {
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Budget *
          </label>
          <Select onValueChange={(value) => setValue("budgetId", value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              {budgets.map((budget) => (
                <SelectItem key={budget.id} value={budget.id}>
                  {budget.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.budgetId && (
            <p className="mt-1 text-sm text-red-600">{errors.budgetId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category *
          </label>
          <Select onValueChange={(value) => setValue("categoryId", value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Vendor Name *
        </label>
        <Input
          {...register("vendorName")}
          placeholder="e.g., ABC Suppliers"
          className="mt-2"
        />
        {errors.vendorName && (
          <p className="mt-1 text-sm text-red-600">{errors.vendorName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Vendor Email
          </label>
          <Input
            {...register("vendorEmail")}
            type="email"
            placeholder="vendor@example.com"
            className="mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Vendor Phone
          </label>
          <Input
            {...register("vendorPhone")}
            placeholder="+91-XXXXX-XXXXX"
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Activity Name *
        </label>
        <Input
          {...register("activityName")}
          placeholder="e.g., Equipment Purchase"
          className="mt-2"
        />
        {errors.activityName && (
          <p className="mt-1 text-sm text-red-600">{errors.activityName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount (₹) *
        </label>
        <Input
          {...register("amount", { valueAsNumber: true })}
          type="number"
          placeholder="0"
          className="mt-2"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Transaction Date *
        </label>
        <Input
          {...register("transactionDate")}
          type="date"
          className="mt-2"
        />
        {errors.transactionDate && (
          <p className="mt-1 text-sm text-red-600">{errors.transactionDate.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description *
        </label>
        <Textarea
          {...register("description")}
          placeholder="Add expense description..."
          className="mt-2"
          rows={4}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? "Creating..." : "Create Expense"}
        </Button>
        <Button type="button" variant="outline" className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
