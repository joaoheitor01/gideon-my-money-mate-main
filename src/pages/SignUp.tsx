
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import {supabase} from "@/integrations/supabase/client"
import { useState } from "react";
import { Link } from "react-router-dom";

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .refine((password) => /[A-Z]/.test(password), {
    message: "A senha deve conter pelo menos uma letra maiúscula",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "A senha deve conter pelo menos um número",
  });

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "O nome deve ter no mínimo 3 caracteres")
      .max(100, "O nome deve ter no máximo 100 caracteres"),
    email: z.string().email("Formato de email inválido"),
    password: passwordSchema,
    confirmPassword: z.string(),
    birthDate: z.coerce.date().max(eighteenYearsAgo, {
      message: "Você deve ser maior de 18 anos",
    }),
    gender: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

  const PasswordStrengthBar = ({ password }: { password?: string }) => {
    const getStrength = () => {
      if (!password) return 0;
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      return strength;
    };
  
    const strength = getStrength();
    const strengthColor =
      strength <= 1
        ? "bg-red-500"
        : strength === 2
        ? "bg-yellow-500"
        : "bg-green-500";
  
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
        <div
          className={`h-2.5 rounded-full ${strengthColor}`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
    );
  };
  

export function SignUp() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
      },
    });

    const password = form.watch("password");
  
    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true);
        try {
          const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                full_name: data.fullName,
                birth_date: data.birthDate,
                gender: data.gender,
              },
            },
          });
          if (error) throw error;
          toast({
            title: "Cadastro realizado com sucesso!",
            description: "Verifique seu email para confirmar sua conta.",
          });
        } catch (error) {
          toast({
            title: "Erro no cadastro",
            description: (error as Error).message,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gideon Finance
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Crie sua conta para começar a gerenciar suas finanças
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nome Completo <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        👤
                      </span>
                      <Input
                        placeholder="Seu nome completo"
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        ✉️
                      </span>
                      <Input
                        placeholder="seu@email.com"
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Senha <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        🔒
                      </span>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        {...field}
                        className="pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </FormControl>
                  <PasswordStrengthBar password={password} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirmar Senha <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirme sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Data de Nascimento <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} 
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gênero</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu gênero" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="other">
                        Prefiro não informar
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full hover:bg-primary/90"
              disabled={loading || !form.formState.isValid}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Já tem conta?{" "}
            <Link
              to="/auth"
              className="font-medium text-primary hover:underline"
            >
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
