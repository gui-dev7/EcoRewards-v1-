import type { Metadata } from "next";
import { RecoverForm } from "@/features/auth/recover-form";

export const metadata: Metadata = {
  title: "Recuperar senha",
  description: "Fluxo demonstrativo de recuperação de senha do EcoRewards.",
};

export default function RecuperarSenhaPage() {
  return <RecoverForm />;
}
