import { Suspense } from "react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { CollectionPointsExplorer } from "@/features/citizen/collection-points";
import { Skeleton } from "@/components/ui/feedback";

export const metadata = {
  title: "Ecopontos",
  description: "Encontre pontos de coleta próximos e veja o que cada um aceita.",
};

export default function EcopontosPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Rede de coleta"
        titulo="Ecopontos"
        descricao="42 pontos na Região Metropolitana de São Paulo, com materiais aceitos, horário e ocupação em tempo real."
      />
      <Suspense fallback={<MapaSkeleton />}>
        <CollectionPointsExplorer />
      </Suspense>
    </PageContainer>
  );
}

function MapaSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, indice) => (
            <Skeleton key={indice} className="h-[92px] w-full rounded-[var(--radius-lg)]" />
          ))}
        </div>
        <Skeleton className="h-[420px] w-full rounded-[var(--radius-lg)] lg:h-[560px]" />
      </div>
    </div>
  );
}
