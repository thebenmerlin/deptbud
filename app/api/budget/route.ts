import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createBudgetSchema } from "@/validations/budget.schema";
import { createAuditLog } from "@/lib/audit";
import { Logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (department) where.departmentId = department;
    if (status) where.status = status;

    const [budgets, total] = await Promise.all([
      prisma.budget.findMany({
        where,
        select: {
          id: true,
          title: true,
          fiscalYear: true,
          proposedAmount: true,
          allottedAmount: true,
          status: true,
          departmentId: true,
          createdBy: true,
          creator: {
            select: {
              name: true,
              email: true,
            },
          },
          categories: {
            select: {
              id: true,
              allocatedAmount: true,
              spentAmount: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  color: true,
                },
              },
            },
          },
          _count: {
            select: {
              expenses: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.budget.count({ where }),
    ]);

    return NextResponse.json({
      budgets,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    Logger.error("GET /api/budget error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createBudgetSchema.parse(body);

    // Find department by name to get departmentId
    const dept = await prisma.department.findUnique({
      where: { name: validatedData.department },
    });

    if (!dept) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 }
      );
    }

    // Transform validated data for Prisma
    const budget = await prisma.budget.create({
      data: {
        title: validatedData.title,
        fiscalYear: validatedData.fiscalYear,
        proposedAmount: validatedData.proposedAmount,
        allottedAmount: validatedData.allottedAmount,
        departmentId: dept.id,
        createdBy: session.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    await createAuditLog(
      session.user.id,
      "CREATE",
      "Budget",
      budget.id,
      { title: budget.title, amount: budget.allottedAmount }
    );

    return NextResponse.json(budget, { status: 201 });
  } catch (error: any) {
    Logger.error("POST /api/budget error", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
