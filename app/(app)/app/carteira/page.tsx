import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Wallet } from "@/features/citizen/wallet";

export const metadata = {
  title: "Minha carteira",
  description: "Saldo, ganhos, gastos e o extrato completo dos seus EcoPontos.",
};

export default function CarteiraPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="EcoPontos"
        titulo="Minha Carteira"
        descricao="Cada entrada mostra de onde veio o ponto, quando entrou e qual o status. O saldo é local: vale enquanto esta demonstração estiver aberta neste navegador."
      />
      <Wallet />
    </PageContainer>
  );
}
