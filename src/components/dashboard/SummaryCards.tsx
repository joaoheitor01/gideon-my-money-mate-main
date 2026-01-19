import { Transaction } from "@/hooks/useTransactions";
import { formatCurrency } from "@/lib/formatters";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface SummaryCardsProps {
  transactions: Transaction[];
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === "entrada") {
        acc.income += Number(t.amount);
      } else {
        acc.expense += Number(t.amount);
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = totals.income - totals.expense;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-lg border border-border bg-card p-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Entradas</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(totals.income)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <TrendingDown className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Saídas</p>
            <p className="text-2xl font-bold text-destructive">
              -{formatCurrency(totals.expense)}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Wallet className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Saldo Total</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? "text-primary" : "text-destructive"}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
