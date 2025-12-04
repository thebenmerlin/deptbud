import { useState, useEffect } from "react";
import axios from "axios";
import { Logger } from "@/lib/logger";

export function useExpenses(budgetId?: string) {
  const [expenses, setExpenses] = useState([]);
  const [expense, setExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async (
    budgetId?: string,
    status?: string,
    page: number = 1
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (budgetId) params.append("budgetId", budgetId);
      if (status) params.append("status", status);
      params.append("page", page.toString());

      const { data } = await axios.get(`/api/expenses?${params}`);
      setExpenses(data.expenses);
      return data;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to fetch expenses";
      setError(message);
      Logger.error("useExpenses fetch error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExpenseById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`/api/expenses/${id}`);
      setExpense(data);
      return data;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to fetch expense";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const createExpense = async (data: any) => {
    try {
      const { data: newExpense } = await axios.post(
        "/api/expenses",
        data
      );
      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to create expense";
      setError(message);
      Logger.error("useExpenses create error", err);
      throw error;
    }
  };

  const approveExpense = async (
    id: string,
    status: "APPROVED" | "REJECTED",
    notes?: string
  ) => {
    try {
      const { data } = await axios.put(`/api/expenses/${id}`, {
        expenseId: id,
        status,
        approvalNotes: notes,
      });
      setExpenses((prev) =>
        prev.map((e: any) => (e.id === id ? data : e))
      );
      return data;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to approve expense";
      setError(message);
      Logger.error("useExpenses approve error", err);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await axios.delete(`/api/expenses/${id}`);
      setExpenses((prev) => prev.filter((e: any) => e.id !== id));
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to delete expense";
      setError(message);
      Logger.error("useExpenses delete error", err);
      throw error;
    }
  };

  useEffect(() => {
    if (budgetId) {
      fetchExpenses(budgetId);
    }
  }, [budgetId]);

  return {
    expenses,
    expense,
    isLoading,
    error,
    fetchExpenses,
    fetchExpenseById,
    createExpense,
    approveExpense,
    deleteExpense,
  };
}
