import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar",
  description:
    "Acesse o EcoRewards com uma das contas demonstrativas de cidadão, empresa ou governo.",
};

export default function LoginPage() {
  return <LoginForm />;
}
