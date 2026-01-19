import { useMemo } from "react";
import { Transaction } from "@/hooks/useTransactions";
import { formatCurrency, formatDate, MONTHS } from "@/lib/formatters";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionListProps {
  transactions: Transaction[];
  selectedMonth: number | null;
  selectedYear: number;
  onDelete: (id: string) => Promise<{ error: Error | null }>;
  onClearFilter: () => void;
}

export function TransactionList({
  transactions,
  selectedMonth,
  selectedYear,
  onDelete,
  onClearFilter,
}: TransactionListProps) {
  const filteredTransactions = useMemo(() => {
    if (selectedMonth === null) return [];
    
    return transactions.filter((t) => {
      const date = new Date(t.date + "T00:00:00");
      return (
        date.getMonth() === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    });
  }, [transactions, selectedMonth, selectedYear]);

  if (selectedMonth === null) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center animate-fade-in">
        <p className="text-muted-foreground">
          Selecione um mês no resumo para ver as transações
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card animate-fade-in">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-semibold text-foreground">
          Extrato de {MONTHS[selectedMonth]}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClearFilter}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">
            Nenhuma transação neste mês
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted-foreground">
                <th className="p-4 font-medium">Descrição</th>
                <th className="p-4 font-medium text-right">Valor</th>
                <th className="p-4 font-medium text-right">Data</th>
                <th className="p-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.category}
                      </p>
                    </div>
                  </td>
                  <td className={`p-4 text-right font-medium ${
                    transaction.type === "entrada" ? "text-primary" : "text-destructive"
                  }`}>
                    {transaction.type === "saida" && "-"}
                    {formatCurrency(Number(transaction.amount))}
                  </td>
                  <td className="p-4 text-right text-muted-foreground">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(transaction.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
