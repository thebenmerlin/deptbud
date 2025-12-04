import { useState, useEffect } from "react";
import axios from "axios";
import { Logger } from "@/lib/logger";

export function useBudget(budgetId?: string) {
  const [budget, setBudget] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async (
    department?: string,
    page: number = 1
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (department) params.append("department", department);
      params.append("page", page.toString());

      const { data } = await axios.get(`/api/budget?${params}`);
      setBudgets(data.budgets);
      return data;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to fetch budgets";
      setError(message);
      Logger.error("useBudget fetch error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBudgetById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`/api/budget/${id}`);
      setBudget(data);
      return data;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to fetch budget";
      setError(message);
      Logger.error("useBudget fetchById error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createBudget = async (data: any) => {
    try {
      const { data: newBudget } = await axios.post("/api/budget", data);
      setBudgets((prev) => [newBudget, ...prev]);
      return newBudget;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to create budget";
      setError(message);
      Logger.error("useBudget create error", err);
      throw error;
    }
  };

  const updateBudget = async (id: string, data: any) => {
    try {
      const { data: updated } = await axios.put(`/api/budget/${id}`, data);
      setBudget(updated);
      setBudgets((prev) =>
        prev.map((b: any) => (b.id === id ? updated : b))
      );
      return updated;
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to update budget";
      setError(message);
      Logger.error("useBudget update error", err);
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await axios.delete(`/api/budget/${id}`);
      setBudgets((prev) => prev.filter((b: any) => b.id !== id));
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : "Failed to delete budget";
      setError(message);
      Logger.error("useBudget delete error", err);
      throw error;
    }
  };

  useEffect(() => {
    if (budgetId) {
      fetchBudgetById(budgetId);
    }
  }, [budgetId]);

  return {
    budget,
    budgets,
    isLoading,
    error,
    fetchBudgets,
    fetchBudgetById,
    createBudget,
    updateBudget,
    deleteBudget,
  };
}
