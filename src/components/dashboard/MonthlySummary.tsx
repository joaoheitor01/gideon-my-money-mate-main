import { useMemo } from "react";
import { Transaction } from "@/hooks/useTransactions";
import { formatCurrency, MONTHS } from "@/lib/formatters";

interface MonthlySummaryProps {
  transactions: Transaction[];
  selectedYear: number;
  onSelectMonth: (month: number) => void;
  selectedMonth: number | null;
}

export function MonthlySummary({
  transactions,
  selectedYear,
  onSelectMonth,
  selectedMonth,
}: MonthlySummaryProps) {
  const monthlyData = useMemo(() => {
    const data = MONTHS.map((_, index) => ({
      month: index,
      income: 0,
      expense: 0,
    }));

    transactions
      .filter((t) => {
        const date = new Date(t.date + "T00:00:00");
        return date.getFullYear() === selectedYear;
      })
      .forEach((t) => {
        const date = new Date(t.date + "T00:00:00");
        const month = date.getMonth();
        if (t.type === "entrada") {
          data[month].income += Number(t.amount);
        } else {
          data[month].expense += Number(t.amount);
        }
      });

    return data;
  }, [transactions, selectedYear]);

  return (
    <div className="rounded-lg border border-border bg-card animate-fade-in">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-foreground">Resumo por Mês</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted-foreground">
              <th className="p-4 font-medium">Mês</th>
              <th className="p-4 font-medium text-right">Entradas</th>
              <th className="p-4 font-medium text-right">Saídas</th>
              <th className="p-4 font-medium text-right">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((data, index) => {
              const balance = data.income - data.expense;
              const isSelected = selectedMonth === index;
              const hasData = data.income > 0 || data.expense > 0;
              
              return (
                <tr
                  key={index}
                  onClick={() => onSelectMonth(index)}
                  className={`border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-secondary/50 ${
                    isSelected ? "bg-secondary border-l-2 border-l-primary" : ""
                  }`}
                >
                  <td className="p-4 font-medium text-foreground">
                    {MONTHS[index]}
                  </td>
                  <td className={`p-4 text-right ${hasData && data.income > 0 ? "text-primary" : "text-muted-foreground"}`}>
                    {formatCurrency(data.income)}
                  </td>
                  <td className={`p-4 text-right ${hasData && data.expense > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    -{formatCurrency(data.expense)}
                  </td>
                  <td className={`p-4 text-right font-medium ${balance >= 0 ? "text-primary" : "text-destructive"}`}>
                    {formatCurrency(balance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
