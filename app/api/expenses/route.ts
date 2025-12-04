import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createExpenseSchema } from "@/validations/expense.schema";
import { createAuditLog } from "@/lib/audit";
import { Logger } from "@/lib/logger";
import { sendEmail, expenseApprovalEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const budgetId = searchParams.get("budgetId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (budgetId) where.budgetId = budgetId;
    if (status) where.status = status;

    // Non-admin users can only see their own or those awaiting their approval
    if (session.user.role !== "ADMIN") {
      where.OR = [
        { createdBy: session.user.id },
        ...(session.user.role === "HOD" ? [{ status: "PENDING" }] : []),
      ];
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          category: true,
          creator: { select: { name: true, email: true } },
          approver: { select: { name: true, email: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.expense.count({ where }),
    ]);

    return NextResponse.json({
      expenses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    Logger.error("GET /api/expenses error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !["STAFF", "HOD", "ADMIN"].includes(session.user.role)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createExpenseSchema.parse(body);

    // Verify budget exists and belongs to user's department
    const budget = await prisma.budget.findUnique({
      where: { id: data.budgetId },
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    // Check budget availability
    const totalSpent = await prisma.expense.aggregate({
      where: { budgetId: data.budgetId, status: { not: "REJECTED" } },
      _sum: { amount: true },
    });

    const spent = totalSpent._sum.amount || 0;
    if (spent + data.amount > budget.allottedAmount) {
      return NextResponse.json(
        { error: "Insufficient budget" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        ...data,
        transactionDate: new Date(data.transactionDate),
        createdBy: session.user.id,
      },
      include: {
        category: true,
        creator: { select: { name: true, email: true } },
      },
    });

    // Notify HOD of pending approval
    const hods = await prisma.user.findMany({
      where: { role: "HOD", department: budget.department },
    });

    for (const hod of hods) {
      try {
        await sendEmail(
          hod.email,
          "New Expense Awaiting Approval",
          expenseApprovalEmail(hod.email, expense.amount, expense.vendorName, expense.category.name)
        );
      } catch (err) {
        Logger.warn("Failed to send approval email", { hodEmail: hod.email });
      }
    }

    await createAuditLog(
      session.user.id,
      "CREATE",
      "Expense",
      expense.id,
      { amount: expense.amount, category: expense.category.name }
    );

    return NextResponse.json(expense, { status: 201 });
  } catch (error: any) {
    Logger.error("POST /api/expenses error", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
