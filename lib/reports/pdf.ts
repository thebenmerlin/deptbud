import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Budget, Expense, Category } from "@prisma/client";
import { formatCurrency, formatDate } from "../utils";

export function generateBudgetPDF(
  budget: Budget,
  expenses: (Expense & { category: Category })[],
  categories: any[]
): Buffer {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  doc.setFillColor(33, 49, 105); // Brand Blue
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("Budget Report", pageWidth / 2, 25, { align: "center" });

  yPosition = 55;

  // Budget Summary
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text("Budget Summary", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  const summaryData = [
    ["Title", budget.title],
    ["Fiscal Year", budget.fiscalYear],
    ["Department", budget.department],
    ["Proposed Amount", formatCurrency(budget.proposedAmount)],
    ["Allotted Amount", formatCurrency(budget.allottedAmount)],
    ["Variance", formatCurrency(budget.allottedAmount - budget.proposedAmount)],
  ];

  (doc as any).autoTable({
    startY: yPosition,
    head: [["Field", "Value"]],
    body: summaryData,
    headStyles: {
      fillColor: [130, 25, 16], // Brand Red
      textColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 100 },
    },
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Category-wise Breakdown
  if (categories.length > 0) {
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.text("Category-wise Breakdown", 20, yPosition);
    yPosition += 10;

    const categoryData = categories.map((cat: any) => [
      cat.category?.name || "N/A",
      formatCurrency(cat.allocatedAmount),
      formatCurrency(cat.spent),
      formatCurrency(cat.allocatedAmount - cat.spent),
      `${Math.round((cat.spent / cat.allocatedAmount) * 100)}%`,
    ]);

    (doc as any).autoTable({
      startY: yPosition,
      head: [["Category", "Allocated", "Spent", "Balance", "Utilization"]],
      body: categoryData,
      headStyles: {
        fillColor: [130, 25, 16],
        textColor: [255, 255, 255],
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
        4: { cellWidth: 35 },
      },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }

  // Expenses Table
  if (expenses.length > 0) {
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.text("Expense Details", 20, yPosition);
    yPosition += 10;

    const expenseData = expenses.map((exp) => [
      formatDate(exp.transactionDate),
      exp.category?.name || "N/A",
      exp.vendorName,
      exp.activityName,
      formatCurrency(exp.amount),
      exp.status,
    ]);

    (doc as any).autoTable({
      startY: yPosition,
      head: [["Date", "Category", "Vendor", "Activity", "Amount", "Status"]],
      body: expenseData,
      headStyles: {
        fillColor: [130, 25, 16],
        textColor: [255, 255, 255],
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
        4: { cellWidth: 30 },
        5: { cellWidth: 20 },
      },
      margin: { left: 20, right: 20 },
    });
  }

  // Footer
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  return Buffer.from(doc.output("arraybuffer"));
}
