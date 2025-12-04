// app/expenses/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTable } from "@/components/table/DataTable";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/ui/button";

interface Expense {
  id: string;
  description: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  category: {
    name: string;
  };
  budget: {
    title: string;
  };
  createdAt: string;
}

export default function ExpensesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    fetchExpenses();
  }, [status, page, router]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/expenses?page=${page}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch expenses");
      }

      const data = await response.json();
      setExpenses(data.expenses);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge variant="success">{status}</Badge>;
      case "REJECTED":
        return <Badge variant="danger">{status}</Badge>;
      case "PENDING":
        return <Badge variant="warning">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 p-4">
        <p className="text-red-800">Error: {error}</p>
        <Button onClick={fetchExpenses} className="mt-2">
          Try Again
        </Button>
      </Card>
    );
  }

  const columns = [
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (info: any) => `₹${(info.getValue() as number).toFixed(2)}`,
    },
    {
      header: "Category",
      accessorKey: "category.name",
    },
    {
      header: "Budget",
      accessorKey: "budget.title",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (info: any) => getStatusBadge(info.getValue() as string),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (info: any) =>
        new Date(info.getValue() as string).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-gray-600">Manage and track your expenses</p>
        </div>
        <Link href="/expenses/new">
          <Button>Add Expense</Button>
        </Link>
      </div>

      <Card>
        <div className="p-6">
          {expenses.length === 0 ? (
            <p className="text-center text-gray-500">No expenses found</p>
          ) : (
            <DataTable columns={columns} data={expenses} />
          )}
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Total: {total} expenses | Page: {page}
        </p>
        <div className="flex gap-2">
          <Button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage(page + 1)}
            disabled={page * 10 >= total}
            variant="outline"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
