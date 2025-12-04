// app/expenses/view/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download } from "lucide-react";

interface ExpenseDetail {
  id: string;
  activityName: string;
  amount: number;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  description: string;
  status: string;
  transactionDate: string;
  category: { name: string };
  budget: { title: string };
  receipts: Array<{ id: string; url: string; filename: string }>;
}

export default function ViewExpensePage() {
  const params = useParams();
  const expenseId = params.id as string;

  const [expense, setExpense] = useState<ExpenseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await fetch(`/api/expenses/${expenseId}`);
        if (res.ok) {
          const data = await res.json();
          setExpense(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpense();
  }, [expenseId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!expense) {
    return <div>Expense not found</div>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {expense.activityName}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Expense Details
        </p>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Status
              </p>
              <Badge
                variant={
                  expense.status === "APPROVED"
                    ? "success"
                    : expense.status === "REJECTED"
                    ? "danger"
                    : "warning"
                }
                className="mt-2"
              >
                {expense.status}
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Amount
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                ₹{expense.amount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Vendor Information
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Name:
                </span>{" "}
                {expense.vendorName}
              </p>
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Email:
                </span>{" "}
                {expense.vendorEmail}
              </p>
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Phone:
                </span>{" "}
                {expense.vendorPhone}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Additional Details
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Category:
                </span>{" "}
                {expense.category.name}
              </p>
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Budget:
                </span>{" "}
                {expense.budget.title}
              </p>
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Date:
                </span>{" "}
                {new Date(expense.transactionDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Description
            </p>
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              {expense.description}
            </p>
          </div>

          {expense.receipts && expense.receipts.length > 0 && (
            <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Receipts
              </h3>
              <div className="mt-4 space-y-2">
                {expense.receipts.map((receipt) => (
                  <a
                    key={receipt.id}
                    href={receipt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded bg-gray-100 p-3 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm">{receipt.filename}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <Link href="/expenses" className="w-full">
            <Button variant="outline" className="w-full">
              Back to Expenses
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}