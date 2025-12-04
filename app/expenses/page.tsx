/ app/expenses/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { DataTable } from "@/components/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

interface Expense {
  id: string;
  activityName: string;
  amount: number;
  vendorName: string;
  status: string;
  transactionDate: string;
  category: { name: string };
}

const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "activityName",
    header: "Activity",
  },
  {
    accessorKey: "vendorName",
    header: "Vendor",
  },
  {
    accessorKey: "category.name",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `₹${row.original.amount.toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "APPROVED"
            ? "success"
            : row.original.status === "REJECTED"
            ? "danger"
            : "warning"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "transactionDate",
    header: "Date",
    cell: ({ row }) =>
      new Date(row.original.transactionDate).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link href={`/expenses/view/${row.original.id}`}>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await fetch("/api/expenses");
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Expenses
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View and manage all expenses
          </p>
        </div>
        <Link href="/expenses/new">
          <Button>+ New Expense</Button>
        </Link>
      </div>

      <Card>
        <DataTable columns={columns} data={expenses} title="Expense List" />
      </Card>
    </div>
  );
}
