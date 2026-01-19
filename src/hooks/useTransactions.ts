import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export interface Transaction {
  id: string;
  user_id: string;
  type: "entrada" | "saida";
  description: string;
  amount: number;
  category: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionInput {
  type: "entrada" | "saida";
  description: string;
  amount: number;
  category: string;
  date: string;
}

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar transações",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTransactions(data as Transaction[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const addTransaction = async (input: TransactionInput) => {
    if (!user) return { error: new Error("Usuário não autenticado") };

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type: input.type,
        description: input.description,
        amount: input.amount,
        category: input.category,
        date: input.date,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro ao adicionar transação",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    setTransactions((prev) => [data as Transaction, ...prev]);
    toast({
      title: "Transação adicionada",
      description: "Sua transação foi registrada com sucesso.",
    });
    return { error: null };
  };

  const updateTransaction = async (id: string, input: Partial<TransactionInput>) => {
    const { data, error } = await supabase
      .from("transactions")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro ao atualizar transação",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? (data as Transaction) : t))
    );
    toast({
      title: "Transação atualizada",
      description: "Sua transação foi atualizada com sucesso.",
    });
    return { error: null };
  };

  const deleteTransaction = async (id: string) => {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir transação",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast({
      title: "Transação excluída",
      description: "Sua transação foi removida com sucesso.",
    });
    return { error: null };
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
}
