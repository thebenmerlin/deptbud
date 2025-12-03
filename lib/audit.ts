import { prisma } from "./db";
import { Logger } from "./logger";

export async function createAuditLog(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  changes?: any,
  metadata?: any
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        changes,
        metadata,
      },
    });
  } catch (error) {
    Logger.error("Failed to create audit log", { error, action, entityType });
  }
}

export async function getAuditLogs(
  entityType?: string,
  entityId?: string,
  limit: number = 50
) {
  try {
    return await prisma.auditLog.findMany({
      where: {
        ...(entityType && { entityType }),
        ...(entityId && { entityId }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  } catch (error) {
    Logger.error("Failed to fetch audit logs", error);
    throw error;
  }
}
