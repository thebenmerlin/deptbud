// app/api/budget/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { budgetSchema } from "@/validations/budget";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const budgets = await db.budget.findMany({
      where: {
        department: {
          users: {
            some: {
              id: session.user.id,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        proposedAmount: true,
        allottedAmount: true,
        fiscalYear: true,
        status: true,
        createdAt: true,
        category: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await db.budget.count({
      where: {
        department: {
          users: {
            some: {
              id: session.user.id,
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        budgets,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Budget GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = budgetSchema.parse(body);

    const budget = await db.budget.create({
      data: {
        title: validatedData.title,
        proposedAmount: validatedData.proposedAmount,
        allottedAmount: validatedData.allottedAmount,
        fiscalYear: validatedData.fiscalYear,
        departmentId: session.user.departmentId,
        categoryId: validatedData.categoryId,
        description: validatedData.description || null,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Budget POST error:", error);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}