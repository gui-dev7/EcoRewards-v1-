import { Suspense } from "react";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { RewardsCatalog } from "@/features/citizen/rewards-catalog";
import { Skeleton } from "@/components/ui/feedback";

export const metadata = {
  title: "Recompensas",
  description: "Troque seus EcoPontos por mobilidade, cultura, energia e mais.",
};

export default function RecompensasPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Catálogo"
        titulo="Recompensas"
        descricao="Cada resgate desconta o saldo, gera um voucher com código e entra no seu extrato. Tudo permanece neste navegador."
      />
      <Suspense fallback={<CatalogoSkeleton />}>
        <RewardsCatalog />
      </Suspense>
    </PageContainer>
  );
}

function CatalogoSkeleton() {
  return (
    <div>
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, indice) => (
          <div
            key={indice}
            className="rounded-[var(--radius-lg)] border border-[var(--border)] p-5"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-4 h-4 w-4/5" />
            <Skeleton className="mt-2 h-3 w-full" />
            <Skeleton className="mt-6 h-6 w-28" />
            <Skeleton className="mt-4 h-1 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
