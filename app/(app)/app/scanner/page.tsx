import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Scanner } from "@/features/citizen/scanner";

export const metadata = {
  title: "Scanner",
  description: "Registre um descarte lendo o QR do ecoponto.",
};

export default function ScannerPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Registrar descarte"
        titulo="Scanner de ecoponto"
        descricao="A leitura identifica o local, confere o material e registra o peso. Só depois disso os EcoPontos entram na sua carteira."
      />
      <Scanner />
    </PageContainer>
  );
}
