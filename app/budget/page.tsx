// app/budget/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { DataTable } from "@/components/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";

interface Budget {
  id: string;
  title: string;
  fiscalYear: string;
  department: string;
  allottedAmount: number;
  spent: number;
  status: string;
  createdAt: string;
}

const columns: ColumnDef<Budget>[] = [
  {
    accessorKey: "title",
    header: "Budget Title",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "fiscalYear",
    header: "Fiscal Year",
  },
  {
    accessorKey: "allottedAmount",
    header: "Allotted Amount",
    cell: ({ row }) => `₹${row.original.allottedAmount.toLocaleString()}`,
  },
  {
    accessorKey: "spent",
    header: "Spent",
    cell: ({ row }) => `₹${row.original.spent.toLocaleString()}`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "ACTIVE"
            ? "success"
            : row.original.status === "ARCHIVED"
            ? "danger"
            : "default"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/budget/edit/${row.original.id}`}>
          <Button variant="outline" size="sm">
            <Edit2 className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    ),
  },
];

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await fetch("/api/budgets");
        if (res.ok) {
          const data = await res.json();
          setBudgets(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBudgets();
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
            Budgets
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and track all budgets
          </p>
        </div>
        <Link href="/budget/new">
          <Button>+ New Budget</Button>
        </Link>
      </div>

      <Card>
        <DataTable columns={columns} data={budgets} title="Budget List" />
      </Card>
    </div>
  );
}