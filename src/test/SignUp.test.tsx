import { render, screen, fireEvent } from "@testing-library/react";
import { SignUp } from "../pages/SignUp";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
    },
  },
}));

describe("SignUp", () => {
  it("should render the sign up form", () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    expect(screen.getByText("Gideon Finance")).toBeInTheDocument();
    expect(screen.getByText("Crie sua conta para começar a gerenciar suas finanças")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome Completo *")).toBeInTheDocument();
    expect(screen.getByLabelText("Email *")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha *")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirmar Senha *")).toBeInTheDocument();
    expect(screen.getByLabelText("Data de Nascimento *")).toBeInTheDocument();
    expect(screen.getByLabelText("Gênero")).toBeInTheDocument();
    expect(screen.getByText("Cadastrar")).toBeInTheDocument();
    expect(screen.getByText("Já tem conta?")).toBeInTheDocument();
  });

  it("should show an error message if the name is too short", async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Nome Completo *"), {
      target: { value: "a" },
    });

    fireEvent.blur(screen.getByLabelText("Nome Completo *"));

    expect(await screen.findByText("O nome deve ter no mínimo 3 caracteres")).toBeInTheDocument();
  });

  it("should show an error message if the email is invalid", async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email *"), {
      target: { value: "invalid-email" },
    });

    fireEvent.blur(screen.getByLabelText("Email *"));

    expect(await screen.findByText("Formato de email inválido")).toBeInTheDocument();
  });

  it("should show an error message if the password is too short", async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Senha *"), {
      target: { value: "123" },
    });

    fireEvent.blur(screen.getByLabelText("Senha *"));

    expect(await screen.findByText("A senha deve ter no mínimo 8 caracteres")).toBeInTheDocument();
  });

  it("should show an error message if the passwords do not match", async () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Senha *"), {
      target: { value: "Password123" },
    });

    fireEvent.change(screen.getByLabelText("Confirmar Senha *"), {
      target: { value: "Password1234" },
    });

    fireEvent.blur(screen.getByLabelText("Confirmar Senha *"));

    expect(await screen.findByText("As senhas não coincidem")).toBeInTheDocument();
  });
});
