import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { DemoGuard } from "@/components/layout/demo-guard";

export const metadata: Metadata = {
  title: { default: "Painel executivo", template: "%s · EcoRewards Governo" },
  description:
    "Inteligência regional, mapas por camadas, execução orçamentária e central de anomalias.",
};

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoGuard environment="governo">
      <AppShell environment="governo">{children}</AppShell>
    </DemoGuard>
  );
}
