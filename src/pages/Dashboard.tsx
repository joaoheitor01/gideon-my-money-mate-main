import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import { MonthlySummary } from "@/components/dashboard/MonthlySummary";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { Charts } from "@/components/dashboard/Charts";
import { useTransactions } from "@/hooks/useTransactions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const { transactions, loading, addTransaction, deleteTransaction } = useTransactions();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            Carregando transações...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Summary Cards */}
        <SummaryCards transactions={transactions} />

        {/* Transaction Form */}
        <TransactionForm onSubmit={addTransaction} />

        {/* Year Filter */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Ano:</span>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => {
              setSelectedYear(parseInt(value));
              setSelectedMonth(null);
            }}
          >
            <SelectTrigger className="w-32 bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Monthly Summary and Transaction List */}
        <div className="grid gap-6 lg:grid-cols-2">
          <MonthlySummary
            transactions={transactions}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
          />
          <TransactionList
            transactions={transactions}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onDelete={deleteTransaction}
            onClearFilter={() => setSelectedMonth(null)}
          />
        </div>

        {/* Charts */}
        <Charts transactions={transactions} selectedYear={selectedYear} />
      </div>
    </DashboardLayout>
  );
}
