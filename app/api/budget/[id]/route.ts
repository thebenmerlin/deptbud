import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateBudgetSchema } from "@/validations/budget.schema";
import { createAuditLog } from "@/lib/audit";
import { Logger } from "@/lib/logger";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const budget = await prisma.budget.findUnique({
      where: { id: params.id },
      include: {
        creator: { select: { name: true, email: true } },
        categories: {
          include: { category: true },
        },
        expenses: {
          include: { category: true },
        },
        _count: { select: { expenses: true } },
      },
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json(budget);
  } catch (error) {
    Logger.error("GET /api/budget/[id] error", error);
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

    const budget = await prisma.budget.findUnique({
      where: { id: params.id },
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    // Check authorization (only admin or creator can edit)
    if (
      session.user.role !== "ADMIN" &&
      budget.createdBy !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateBudgetSchema.parse(body);

    // Transform validated data - only pass updatable fields
    const updateData = {
      ...(validatedData.title !== undefined && { title: validatedData.title }),
      ...(validatedData.fiscalYear !== undefined && { fiscalYear: validatedData.fiscalYear }),
      ...(validatedData.proposedAmount !== undefined && { proposedAmount: validatedData.proposedAmount }),
      ...(validatedData.allottedAmount !== undefined && { allottedAmount: validatedData.allottedAmount }),
      ...(validatedData.description !== undefined && { description: validatedData.description }),
    };

    const updatedBudget = await prisma.budget.update({
      where: { id: params.id },
      data: updateData,
      include: { creator: true, categories: true },
    });

    await createAuditLog(
      session.user.id,
      "UPDATE",
      "Budget",
      params.id,
      { changes: validatedData }
    );

    return NextResponse.json(updatedBudget);
  } catch (error: any) {
    Logger.error("PUT /api/budget/[id] error", error);
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
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const budget = await prisma.budget.findUnique({
      where: { id: params.id },
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    await prisma.budget.delete({ where: { id: params.id } });

    await createAuditLog(
      session.user.id,
      "DELETE",
      "Budget",
      params.id,
      { title: budget.title }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    Logger.error("DELETE /api/budget/[id] error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
