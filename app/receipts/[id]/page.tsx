// app/receipts/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/shared/Card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, FileText } from "lucide-react";

interface Receipt {
  id: string;
  filename: string;
  url: string;
  fileSize: number;
  uploadedAt: string;
  expense: {
    id: string;
    activityName: string;
    amount: number;
  };
}

export default function ReceiptPage() {
  const params = useParams();
  const receiptId = params.id as string;

  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await fetch(`/api/receipts/${receiptId}`);
        if (res.ok) {
          const data = await res.json();
          setReceipt(data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipt();
  }, [receiptId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!receipt) {
    return <div>Receipt not found</div>;
  }

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = receipt.url;
    a.download = receipt.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Receipt
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View receipt details
        </p>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {receipt.filename}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {(receipt.fileSize / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>

          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Related Expense
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Activity:
                </span>{" "}
                {receipt.expense.activityName}
              </p>
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Amount:
                </span>{" "}
                ₹{receipt.expense.amount.toLocaleString()}
              </p>
              <p>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Uploaded:
                </span>{" "}
                {new Date(receipt.uploadedAt).toLocaleDateString()}{" "}
                {new Date(receipt.uploadedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {receipt.url && (
            <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
              <iframe
                src={receipt.url}
                className="h-96 w-full rounded-lg border border-gray-200 dark:border-gray-700"
                title="Receipt Preview"
              />
            </div>
          )}

          <Link href={`/expenses/view/${receipt.expense.id}`} className="w-full">
            <Button variant="outline" className="w-full">
              View Expense
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}