// app/expenses/approve/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface PendingExpense {
  id: string;
  activityName: string;
  amount: number;
  vendorName: string;
  description: string;
  user: { name: string; email: string };
  transactionDate: string;
}

export default function ApproveExpensesPage() {
  const [expenses, setExpenses] = useState<PendingExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/expenses?status=PENDING");
        if (res.ok) {
          const data = await res.json();
          setExpenses(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleApprove = async (expenseId: string) => {
    setActionLoading(expenseId);
    try {
      const res = await fetch(`/api/expenses/${expenseId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (res.ok) {
        setExpenses(expenses.filter((e) => e.id !== expenseId));
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (expenseId: string) => {
    setActionLoading(expenseId);
    try {
      const res = await fetch(`/api/expenses/${expenseId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });

      if (res.ok) {
        setExpenses(expenses.filter((e) => e.id !== expenseId));
      }
    } finally {
      setActionLoading(null);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Approve Expenses
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Review and approve pending expenses
        </p>
      </div>

      {expenses.length === 0 ? (
        <Card>
          <div className="py-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              All caught up!
            </p>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              There are no pending expenses to approve
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <Card key={expense.id}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {expense.activityName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      By {expense.user.name} ({expense.user.email})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{expense.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(expense.transactionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Vendor: {expense.vendorName}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {expense.description}
                </p>

                <div className="flex gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                  <Button
                    onClick={() => handleApprove(expense.id)}
                    disabled={actionLoading === expense.id}
                    className="flex-1 items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(expense.id)}
                    disabled={actionLoading === expense.id}
                    variant="outline"
                    className="flex-1 items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}