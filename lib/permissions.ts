import { Role } from "@prisma/client";
import { ROLE_PERMISSIONS } from "@/constants/roles";

export function hasPermission(
  userRole: Role,
  permission: string
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission as any);
}

export function canApproveExpense(userRole: Role): boolean {
  return hasPermission(userRole, "approve_expense");
}

export function canCreateExpense(userRole: Role): boolean {
  return hasPermission(userRole, "create_expense");
}

export function canViewAuditLogs(userRole: Role): boolean {
  return hasPermission(userRole, "view_audit_logs");
}

export function canManageUsers(userRole: Role): boolean {
  return hasPermission(userRole, "manage_users");
}

export function canViewAllBudgets(userRole: Role): boolean {
  return hasPermission(userRole, "view_all_budgets");
}

export function canExportReports(userRole: Role): boolean {
  return hasPermission(userRole, "export_reports");
}
