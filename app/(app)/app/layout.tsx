import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { DemoGuard } from "@/components/layout/demo-guard";

export const metadata: Metadata = {
  title: { default: "Painel do cidadão", template: "%s · EcoRewards" },
  description:
    "Acompanhe seus EcoPontos, desafios, recompensas e impacto ambiental.",
};

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoGuard environment="cidadao">
      <AppShell environment="cidadao">{children}</AppShell>
    </DemoGuard>
  );
}
