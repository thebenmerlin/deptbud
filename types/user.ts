// types/user.ts

export type UserRole = "ADMIN" | "HOD" | "STAFF";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  isActive: boolean;
  emailVerified?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  department?: string;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  department?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface UserPasswordUpdate {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  permissions: Permission[];
  iat?: number;
  exp?: number;
}

export interface UserStats {
  totalUsers: number;
  adminCount: number;
  hodCount: number;
  staffCount: number;
  activeUsers: number;
  inactiveUsers: number;
}

export interface UserListItem {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface UserActivityLog {
  date: Date;
  action: string;
  details: string;
  ipAddress?: string;
}

export interface UserPermissions {
  userId: string;
  role: UserRole;
  permissions: Permission[];
  budgetAccess: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canView: boolean;
    departments: string[];
  };
  expenseAccess: {
    canCreate: boolean;
    canApprove: boolean;
    canReject: boolean;
    canDelete: boolean;
  };
}

export interface Permission {
  resource: "BUDGET" | "EXPENSE" | "CATEGORY" | "USER" | "REPORT" | "AUDIT";
  actions: ("READ" | "CREATE" | "UPDATE" | "DELETE" | "APPROVE")[];
  scope: "OWN" | "DEPARTMENT" | "ALL";
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: "Bearer";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserSession;
  tokens: AuthToken;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserFilter {
  role?: UserRole;
  department?: string;
  isActive?: boolean;
  search?: string;
}

export interface UserPaginatedResponse {
  data: UserListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasMore: boolean;
}

export interface UserAuditEvent {
  userId: string;
  userName: string;
  action: "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE" | "EXPORT";
  resource: string;
  resourceId?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  status: "SUCCESS" | "FAILURE";
}