import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { approveExpenseSchema } from "@/validations/expense.schema";
import { createAuditLog } from "@/lib/audit";
import { Logger } from "@/lib/logger";
import { sendEmail, expenseStatusEmail } from "@/lib/email";
import { deleteReceipt } from "@/lib/upload";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        budget: true,
        creator: { select: { name: true, email: true } },
      },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    Logger.error("GET /api/expenses/[id] error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
      include: { creator: { select: { email: true } } },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Only HOD/ADMIN can approve expenses
    const body = await req.json();
    const data = approveExpenseSchema.parse(body);

    if (
      session.user.role !== "HOD" &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: params.id },
      data: {
        status: data.status,
        approverNote: data.approvalNotes,
      },
      include: { category: true },
    });

    // Send notification email
    try {
      await sendEmail(
        expense.creator.email,
        `Expense ${data.status}`,
        expenseStatusEmail(
          expense.creator.email,
          data.status,
          expense.amount,
          data.approvalNotes
        )
      );
    } catch (err) {
      Logger.warn("Failed to send status email");
    }

    await createAuditLog(
      session.user.id,
      "APPROVE",
      "Expense",
      params.id,
      { status: data.status, notes: data.approvalNotes }
    );

    return NextResponse.json(updatedExpense);
  } catch (error: any) {
    Logger.error("PUT /api/expenses/[id] error", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const expense = await prisma.expense.findUnique({
      where: { id: params.id },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Only creator or admin can delete
    if (
      expense.createdBy !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete receipt from Cloudinary if it exists
    if (expense.receiptUrl) {
      try {
        await deleteReceipt(expense.receiptUrl);
      } catch (err) {
        Logger.warn("Failed to delete receipt from Cloudinary");
      }
    }

    await prisma.expense.delete({ where: { id: params.id } });

    await createAuditLog(
      session.user.id,
      "DELETE",
      "Expense",
      params.id,
      { amount: expense.amount }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    Logger.error("DELETE /api/expenses/[id] error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
