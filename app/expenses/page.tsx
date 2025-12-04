"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";

export default function ExpensesPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Expenses Management</h1>
          <p className="text-muted-foreground">Track and manage all expenses</p>
        </div>

        <div className="mb-6">
          <Button>New Expense</Button>
        </div>

        {/* Data table will be rendered here */}
        <div className="bg-card rounded-lg border p-6">
          <p className="text-muted-foreground">Expenses list coming soon...</p>
        </div>
      </div>
    </div>
  );
}
