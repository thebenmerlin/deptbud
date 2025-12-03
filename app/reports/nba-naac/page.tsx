// app/reports/nba-naac/page.tsx

"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/shared/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download } from "lucide-react";

interface NBANAACReport {
  department: string;
  totalBudget: number;
  totalSpent: number;
  utilizationRate: number;
  approvalRate: number;
  categoryBreakdown: Array<{ name: string; amount: number }>;
  complianceStatus: string;
}

export default function NBAANAACReportPage() {
  const [reports, setReports] = useState<NBANAACReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports/nba-naac");
        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownload = async () => {
    const res = await fetch("/api/reports/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "NBA_NAAC" }),
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "nba-naac-report.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            NBA-NAAC Report
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Accreditation and compliance documentation
          </p>
        </div>
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="space-y-4">
        {reports.map((report, index) => (
          <Card key={index}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {report.department}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    report.complianceStatus === "COMPLIANT"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                  }`}
                >
                  {report.complianceStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Budget
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{report.totalBudget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Spent
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    ₹{report.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Utilization
                  </p>
                  <p className="mt-1 text-lg font-semibold text-blue-600">
                    {report.utilizationRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Approval Rate
                  </p>
                  <p className="mt-1 text-lg font-semibold text-green-600">
                    {report.approvalRate.toFixed(1)}%
                  </p>
                </div>
              </div>

              {report.categoryBreakdown.length > 0 && (
                <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Category Breakdown
                  </p>
                  <div className="mt-3 space-y-2">
                    {report.categoryBreakdown.map((category, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          ₹{category.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Link href="/reports">
        <Button variant="outline" className="w-full">
          Back to Reports
        </Button>
      </Link>
    </div>
  );
}