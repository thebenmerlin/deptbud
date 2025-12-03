export const APP_CONFIG = {
  BRAND_NAME: "Budget Portal",
  BRAND_WHITE: "#FFFFFF",
  BRAND_RED: "#821910",
  BRAND_BLUE: "#243169",
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: [".pdf", ".jpg", ".jpeg", ".png"],
  PAGINATION_LIMIT: 10,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};

export const API_ROUTES = {
  AUTH: "/api/auth",
  BUDGETS: "/api/budget",
  EXPENSES: "/api/expenses",
  CATEGORIES: "/api/categories",
  UPLOAD: "/api/upload",
  LOGS: "/api/logs",
  REPORTS: "/api/reports",
} as const;
