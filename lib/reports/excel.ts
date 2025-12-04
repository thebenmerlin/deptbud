import ExcelJS from "exceljs";
import { Budget, Expense, Category } from "@prisma/client";
import { formatCurrency, formatDate } from "../utils";

export async function generateBudgetExcel(
  budget: Budget,
  expenses: (Expense & { category: Category })[],
  categories: any[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // Summary Sheet
  const summarySheet = workbook.addWorksheet("Summary");
  summarySheet.columns = [
    { header: "Field", key: "field", width: 30 },
    { header: "Value", key: "value", width: 40 },
  ];

  summarySheet.addRows([
    { field: "Budget Title", value: budget.title },
    { field: "Fiscal Year", value: budget.fiscalYear },
    { field: "Department", value: budget.department },
    { field: "Proposed Amount", value: budget.proposedAmount },
    { field: "Allotted Amount", value: budget.allottedAmount },
    {
      field: "Variance",
      value: budget.allottedAmount - budget.proposedAmount,
    },
    { field: "Generated On", value: new Date().toISOString() },
  ]);

  // Format header
  summarySheet.getRow(1).font = {
    bold: true,
    color: { argb: "FFFFFFFF" },
  };
  summarySheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF821910" },
  };

  // Categories Sheet
  if (categories.length > 0) {
    const categorySheet = workbook.addWorksheet("Categories");
    categorySheet.columns = [
      { header: "Category", key: "name", width: 25 },
      { header: "Allocated", key: "allocated", width: 20 },
      { header: "Spent", key: "spent", width: 20 },
      { header: "Balance", key: "balance", width: 20 },
      { header: "Utilization %", key: "utilization", width: 20 },
    ];

    categorySheet.addRows(
      categories.map((cat: any) => ({
        name: cat.category?.name || "N/A",
        allocated: cat.allocatedAmount,
        spent: cat.spent,
        balance: cat.allocatedAmount - cat.spent,
        utilization:
          Math.round((cat.spent / cat.allocatedAmount) * 100) + "%",
      }))
    );

    const headerRow = categorySheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF821910" },
    };
  }

  // Expenses Sheet
  if (expenses.length > 0) {
    const expenseSheet = workbook.addWorksheet("Expenses");
    expenseSheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Category", key: "category", width: 20 },
      { header: "Vendor", key: "vendor", width: 25 },
      { header: "Activity", key: "activity", width: 25 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "Created By", key: "createdBy", width: 20 },
    ];

    expenseSheet.addRows(
      expenses.map((exp) => ({
        date: formatDate(exp.transactionDate),
        category: exp.category?.name || "N/A",
        vendor: exp.vendorName,
        activity: exp.activityName,
        amount: exp.amount,
        status: exp.status,
        createdBy: exp.createdBy,
      }))
    );

    const headerRow = expenseSheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF821910" },
    };
  }

  // Convert to buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
