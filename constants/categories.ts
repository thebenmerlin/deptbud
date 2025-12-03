export const EXPENSE_CATEGORIES = [
  {
    name: "Infrastructure",
    description: "Lab setup, repairs, furniture",
    icon: "hard-hat",
    color: "#F97316",
  },
  {
    name: "Hardware",
    description: "Hardware purchases",
    icon: "cpu",
    color: "#3B82F6",
  },
  {
    name: "Software",
    description: "Software purchases, licenses, subscriptions",
    icon: "code",
    color: "#8B5CF6",
  },
  {
    name: "Workshops & FDPs",
    description: "Workshops, FDPs, seminars",
    icon: "graduation-cap",
    color: "#EC4899",
  },
  {
    name: "Expert Sessions",
    description: "Expert talks and industry sessions honorarium",
    icon: "user-check",
    color: "#06B6D4",
  },
  {
    name: "Events & Sponsorship",
    description: "Technical fests and departmental events",
    icon: "sparkles",
    color: "#EAB308",
  },
  {
    name: "Stationary & Misc",
    description: "Stationary, printing, miscellaneous academic needs",
    icon: "file-text",
    color: "#A16207",
  },
  {
    name: "Student Activities",
    description: "Student activities and competition support",
    icon: "users",
    color: "#10B981",
  },
] as const;
