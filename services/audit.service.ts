// services/audit.service.ts

import { prisma } from "@/lib/db";
import { AuditLog } from "@prisma/client";

export interface CreateAuditLogInput {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  budgetId?: string;
  expenseId?: string;
}

export class AuditService {
  /**
   * Create an audit log entry
   */
  static async createLog(input: CreateAuditLogInput): Promise<AuditLog> {
    return prisma.auditLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        userId: input.userId,
        changes: input.changes || null,
        metadata: input.metadata || null,
        budgetId: input.budgetId,
        expenseId: input.expenseId,
      },
    });
  }

  /**
   * Get audit logs with filters
   */
  static async getLogs(filters?: {
    entityType?: string;
    userId?: string;
    action?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      where: {
        ...(filters?.entityType && { entityType: filters.entityType }),
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.action && { action: filters.action }),
      },
      orderBy: { timestamp: "desc" },
      take: filters?.limit || 50,
      skip: filters?.offset || 0,
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });
  }

  /**
   * Get audit logs for an entity
   */
  static async getEntityLogs(entityId: string): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      where: { entityId },
      orderBy: { timestamp: "desc" },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });
  }

  /**
   * Get user activity
   */
  static async getUserActivity(userId: string, limit: number = 20): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: limit,
      include: {
        user: true,
      },
    });
  }

  /**
   * Get activity summary
   */
  static async getActivitySummary(days: number = 30): Promise<{
    totalLogs: number;
    actionCounts: Record<string, number>;
    topUsers: Array<{ userId: string; userName: string; count: number }>;
  }> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const logs = await prisma.auditLog.findMany({
      where: { timestamp: { gte: since } },
      include: { user: true },
    });

    // Count by action
    const actionCounts: Record<string, number> = {};
    logs.forEach((log) => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });

    // Top users
    const userCounts: Record<string, { name: string; count: number }> = {};
    logs.forEach((log) => {
      if (!userCounts[log.userId]) {
        userCounts[log.userId] = { name: log.user.name, count: 0 };
      }
      userCounts[log.userId].count += 1;
    });

    const topUsers = Object.entries(userCounts)
      .map(([userId, data]) => ({
        userId,
        userName: data.name,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalLogs: logs.length,
      actionCounts,
      topUsers,
    };
  }

  /**
   * Delete old audit logs
   */
  static async deleteOldLogs(daysOld: number = 90): Promise<{ count: number }> {
    const before = new Date();
    before.setDate(before.getDate() - daysOld);

    return prisma.auditLog.deleteMany({
      where: { timestamp: { lt: before } },
    });
  }
}