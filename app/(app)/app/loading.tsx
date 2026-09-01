import { PageContainer } from "@/components/layout/app-shell";
import { Skeleton, SkeletonChart } from "@/components/ui/feedback";

/** Reproduz aproximadamente o layout final do painel, não um bloco genérico. */
export default function CitizenDashboardLoading() {
  return (
    <PageContainer>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--border)] pb-7">
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-full" />
          <div>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-7 w-36" />
            <Skeleton className="mt-2 h-3 w-44" />
          </div>
        </div>
        <div className="flex items-end gap-6">
          <div>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-10 w-32" />
          </div>
          <Skeleton className="h-12 w-44 rounded-[var(--radius-md)]" />
        </div>
      </div>

      <div className="mt-7 space-y-6">
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, indice) => (
            <div key={indice} className="bg-[var(--surface)] px-5 py-4">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="mt-3 h-7 w-24" />
              <Skeleton className="mt-3 h-3 w-32" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-6 w-32" />
            <Skeleton className="mt-6 h-2 w-full" />
            <div className="mt-6 flex gap-1.5">
              {Array.from({ length: 6 }).map((_, indice) => (
                <Skeleton key={indice} className="h-1 flex-1" />
              ))}
            </div>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] p-5">
            <Skeleton className="h-3 w-20" />
            <div className="mt-4 flex items-center gap-5">
              <Skeleton className="size-24 rounded-full" />
              <div className="flex-1 space-y-2">
                {Array.from({ length: 5 }).map((_, indice) => (
                  <Skeleton key={indice} className="h-2 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] p-5">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="mt-3 h-6 w-52" />
          <div className="mt-5 flex gap-[3px]">
            {Array.from({ length: 40 }).map((_, indice) => (
              <Skeleton key={indice} className="size-[13px] rounded-[3px]" />
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] p-5">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="mt-2 h-3 w-72" />
            <div className="mt-6">
              <SkeletonChart />
            </div>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] p-5">
            <Skeleton className="h-4 w-48" />
            <div className="mt-8 flex justify-center">
              <Skeleton className="size-44 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
