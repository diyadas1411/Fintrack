'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Income = {
  id: string;
  source: string;
  amount: number;
  date: string;
};

export type Expense = {
  id: string;
  item: string;
  amount: number;
  date: string;
  category: string;
};

type FinancialsContextType = {
  incomes: Income[];
  expenses: Expense[];
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (income: Income) => void;
  deleteIncome: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
};

const FinancialsContext = createContext<FinancialsContextType | undefined>(undefined);

export const FinancialsProvider = ({ children }: { children: ReactNode }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const addIncome = (income: Omit<Income, 'id'>) => {
    setIncomes([...incomes, { ...income, id: uuidv4() }]);
  };

  const updateIncome = (updatedIncome: Income) => {
    setIncomes(incomes.map(inc => (inc.id === updatedIncome.id ? updatedIncome : inc)));
  };

  const deleteIncome = (id: string) => {
    setIncomes(incomes.filter(inc => inc.id !== id));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses([...expenses, { ...expense, id: uuidv4() }]);
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map(exp => (exp.id === updatedExpense.id ? updatedExpense : exp)));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };
  
  const value = {
    incomes,
    expenses,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense
  };

  return (
    <FinancialsContext.Provider value={value}>
      {children}
    </FinancialsContext.Provider>
  );
};

export const useFinancials = () => {
  const context = useContext(FinancialsContext);
  if (context === undefined) {
    throw new Error('useFinancials must be used within a FinancialsProvider');
  }
  return context;
};
