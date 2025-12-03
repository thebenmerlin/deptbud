// app/expenses/new/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card } from "@/components/shared/Card";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { ExpenseCreateInput } from "@/types/expense";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { AlertCircle } from "lucide-react";

interface Budget {
  id: string;
  title: string;
}

interface Category {
  id: string;
  name: string;
}

export default function NewExpensePage() {
  const router = useRouter();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetsRes, categoriesRes] = await Promise.all([
          fetch("/api/budgets"),
          fetch("/api/categories"),
        ]);

        if (budgetsRes.ok && categoriesRes.ok) {
          const budgetsData = await budgetsRes.json();
          const categoriesData = await categoriesRes.json();
          setBudgets(budgetsData);
          setCategories(categoriesData);
        }
      } catch (err) {
        setError("Failed to load form data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (data: ExpenseCreateInput) => {
    setError(null);
    setIsSaving(true);

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create expense");
      }

      router.push("/expenses");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Expense
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Add a new expense to your budget
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Card>
        <ExpenseForm
          budgets={budgets}
          categories={categories}
          onSubmit={handleSubmit}
          isLoading={isSaving}
        />
      </Card>
    </div>
  );
}
