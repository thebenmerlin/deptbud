// app/budget/edit/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface Budget {
  id: string;
  title: string;
  fiscalYear: string;
  department: string;
  allottedAmount: number;
  proposedAmount: number;
  description: string;
  status: string;
}

export default function EditBudgetPage() {
  const router = useRouter();
  const params = useParams();
  const budgetId = params.id as string;

  const [budget, setBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await fetch(`/api/budgets/${budgetId}`);
        if (!res.ok) throw new Error("Failed to fetch budget");
        const data = await res.json();
        setBudget(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudget();
  }, [budgetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget) return;

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/budgets/${budgetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });

      if (!res.ok) throw new Error("Failed to update budget");

      router.push("/budget");
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

  if (!budget) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/20">
        <p>Budget not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Budget
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Update budget information
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-900/20 dark:text-red-200">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Budget Title
            </label>
            <Input
              value={budget.title}
              onChange={(e) =>
                setBudget({ ...budget, title: e.target.value })
              }
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Proposed Amount
              </label>
              <Input
                type="number"
                value={budget.proposedAmount}
                onChange={(e) =>
                  setBudget({
                    ...budget,
                    proposedAmount: parseFloat(e.target.value),
                  })
                }
                className="mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Allotted Amount
              </label>
              <Input
                type="number"
                value={budget.allottedAmount}
                onChange={(e) =>
                  setBudget({
                    ...budget,
                    allottedAmount: parseFloat(e.target.value),
                  })
                }
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <Textarea
              value={budget.description}
              onChange={(e) =>
                setBudget({ ...budget, description: e.target.value })
              }
              className="mt-2"
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}