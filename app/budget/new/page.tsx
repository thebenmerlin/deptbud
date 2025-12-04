// app/budget/new/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/shared/Card";
import { BudgetForm } from "@/components/forms/BudgetForm";
import { BudgetCreateInput } from "@/types/budget";
import { AlertCircle } from "lucide-react";

export default function NewBudgetPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: BudgetCreateInput) => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create budget");
      }

      router.push("/budget");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Budget
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Add a new budget for your department
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Card>
        <BudgetForm onSubmit={handleSubmit} isLoading={isLoading} />
      </Card>
    </div>
  );
}