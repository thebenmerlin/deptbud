// app/reports/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/shared/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { LineChart } from "@/components/charts/LineChart";
import { Download } from "lucide-react";
import Link from "next/link";

interface ReportData {
  monthlyData: Array<{ name: string; value: number }>;
  departmentData: Array<{ name: string; value: number }>;
  categoryData: Array<{ name: string; value: number }>;
  summaryStats: {
    totalBudget: number;
    totalSpent: number;
    totalExpenses: number;
  };
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          const data = await res.json();
          setReportData(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
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
            Reports
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Financial reports and analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/reports/pdf/generate">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </Link>
          <Link href="/reports/excel/generate">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Budget
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              ₹{(reportData?.summaryStats.totalBudget || 0).toLocaleString()}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Spent
            </p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              ₹{(reportData?.summaryStats.totalSpent || 0).toLocaleString()}
            </p>
          </div>
        </Card>

        <Card>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Expenses
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {reportData?.summaryStats.totalExpenses || 0}
            </p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          {reportData?.monthlyData && (
            <LineChart
              data={reportData.monthlyData}
              title="Monthly Trends"
              dataKey="value"
            />
          )}
        </Card>

        <Card>
          {reportData?.categoryData && (
            <PieChart
              data={reportData.categoryData}
              title="Expense Distribution"
            />
          )}
        </Card>
      </div>

      <Card>
        {reportData?.departmentData && (
          <BarChart
            data={reportData.departmentData}
            title="Department-wise Spending"
            dataKey="value"
            height={400}
          />
        )}
      </Card>

      {/* Additional Reports */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              NBA-NAAC Report
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Accreditation compliance report
            </p>
          </div>
          <Link href="/reports/nba-naac">
            <Button>Generate</Button>
          </Link>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Audit Report
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Complete audit trail and logs
            </p>
          </div>
          <Button disabled>Coming Soon</Button>
        </Card>
      </div>
    </div>
  );
}