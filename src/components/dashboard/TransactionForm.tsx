import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TransactionInput } from "@/hooks/useTransactions";
import { CATEGORIES } from "@/lib/formatters";
import { Plus } from "lucide-react";

interface TransactionFormProps {
  onSubmit: (input: TransactionInput) => Promise<{ error: Error | null }>;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Alimentação",
    date: new Date().toISOString().split("T")[0],
    isIncome: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    setLoading(true);
    const { error } = await onSubmit({
      type: formData.isIncome ? "entrada" : "saida",
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    });

    if (!error) {
      setFormData({
        description: "",
        amount: "",
        category: "Alimentação",
        date: new Date().toISOString().split("T")[0],
        isIncome: false,
      });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6">
      <div className="grid gap-4 md:grid-cols-6 md:items-end">
        <div className="md:col-span-2">
          <Label htmlFor="description" className="text-muted-foreground">
            Descrição
          </Label>
          <Input
            id="description"
            placeholder="Ex: Almoço, Salário..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="mt-1.5 bg-secondary border-0"
          />
        </div>

        <div>
          <Label htmlFor="amount" className="text-muted-foreground">
            Valor
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="R$ 0,00"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            className="mt-1.5 bg-secondary border-0"
          />
        </div>

        <div>
          <Label htmlFor="category" className="text-muted-foreground">
            Categoria
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className="mt-1.5 bg-secondary border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${!formData.isIncome ? "text-primary" : "text-muted-foreground"}`}>
              Saída
            </span>
            <Switch
              checked={formData.isIncome}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isIncome: checked }))
              }
            />
            <span className={`text-sm ${formData.isIncome ? "text-primary" : "text-muted-foreground"}`}>
              Entrada
            </span>
          </div>
        </div>

        <div>
          <Button type="submit" disabled={loading} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </div>
    </form>
  );
}
