import type { Metadata } from "next";
import { SignupForm } from "@/features/auth/signup-form";

export const metadata: Metadata = {
  title: "Criar conta",
  description:
    "Cadastro demonstrativo do EcoRewards, com validação real de formulário e nenhum dado enviado a servidores.",
};

export default function CadastroPage() {
  return <SignupForm />;
}
