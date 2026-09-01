import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { DemoGuard } from "@/components/layout/demo-guard";

export const metadata: Metadata = {
  title: { default: "Painel corporativo", template: "%s · EcoRewards Empresas" },
  description:
    "Adesão dos colaboradores, metas ESG, campanhas internas e relatórios de sustentabilidade.",
};

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoGuard environment="empresa">
      <AppShell environment="empresa">{children}</AppShell>
    </DemoGuard>
  );
}
