import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateBudgetPDF } from "@/lib/reports/pdf";
import { generateBudgetExcel } from "@/lib/reports/excel";
import { Logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const budgetId = searchParams.get("budgetId");
    const format = searchParams.get("format") || "pdf";

    if (!budgetId) {
      return NextResponse.json(
        { error: "Budget ID is required" },
        { status: 400 }
      );
    }

    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: {
        expenses: {
          include: { category: true },
        },
        categories: {
          include: { category: true },
        },
      },
    });

    if (!budget) {
      return NextResponse.json(
        { error: "Budget not found" },
        { status: 404 }
      );
    }

    let buffer: Buffer;
    let mimeType: string;
    let fileName: string;

    if (format === "excel") {
      buffer = await generateBudgetExcel(
        budget,
        budget.expenses,
        budget.categories
      );
      mimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      fileName = `budget-${budget.id}.xlsx`;
    } else {
      buffer = generateBudgetPDF(budget, budget.expenses, budget.categories);
      mimeType = "application/pdf";
      fileName = `budget-${budget.id}.pdf`;
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    Logger.error("GET /api/reports error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
