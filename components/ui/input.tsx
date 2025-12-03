import React from "react";
import { cn } from "@/lib/utils";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-2.5 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
          "border-gray-300 dark:border-slate-600 focus:border-brand-blue focus:ring-brand-blue/20",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          "bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100",
          "placeholder-gray-500 dark:placeholder-gray-400",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-gray-500 text-sm mt-1">{hint}</p>
      )}
    </div>
  );
}
