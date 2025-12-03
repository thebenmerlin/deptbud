export const BUDGET_LIMITS = {
  MAX_PROPOSAL_AMOUNT: 100000000, // 1 crore
  MIN_PROPOSAL_AMOUNT: 10000, // 10k
  OVERSPEND_THRESHOLD: 0.95, // 95% utilization warning
  OVERSPEND_CRITICAL: 1.0, // 100% = critical
} as const;

export const EXPENSE_LIMITS = {
  MAX_SINGLE_EXPENSE: 5000000, // 50 lakhs
  MIN_EXPENSE: 1,
  RECEIPT_UPLOAD_TIMEOUT: 30000, // 30 seconds
} as const;

