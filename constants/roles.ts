export const ROLES = {
  ADMIN: "ADMIN",
  HOD: "HOD",
  STAFF: "STAFF",
} as const;

export const ROLE_LABELS = {
  ADMIN: "Administrator",
  HOD: "Head of Department",
  STAFF: "Staff",
} as const;

export const ROLE_PERMISSIONS = {
  ADMIN: [
    "view_all_budgets",
    "create_budget",
    "edit_budget",
    "delete_budget",
    "approve_expense",
    "reject_expense",
    "view_audit_logs",
    "manage_users",
    "manage_categories",
    "view_reports",
    "export_reports",
  ],
  HOD: [
    "view_department_budgets",
    "create_budget",
    "edit_budget",
    "approve_expense",
    "reject_expense",
    "view_reports",
    "export_reports",
  ],
  STAFF: [
    "view_budget",
    "create_expense",
    "view_own_expenses",
    "upload_receipt",
  ],
} as const;
