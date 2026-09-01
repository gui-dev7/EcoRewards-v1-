"use client";

import { PageContainer } from "@/components/layout/app-shell";
import { BalanceHeader, QuickStats } from "@/features/citizen/balance-header";
import { EcoLevelCard } from "@/features/citizen/eco-level-card";
import { EcoScore } from "@/features/citizen/eco-score";
import { StreakCalendar } from "@/features/citizen/streak-calendar";
import {
  ActiveChallenges,
  FeaturedRewards,
  MaterialBreakdown,
  MonthlyChart,
  NearbyPoints,
  RecentActivity,
} from "@/features/citizen/dashboard-panels";
import { useWalletStore } from "@/stores";
import { useHydrated } from "@/hooks/use-hydrated";
import { CITIZEN, CITIZEN_ECO_SCORE_INPUT } from "@/mocks/citizen";

export default function CitizenDashboardPage() {
  const hydrated = useHydrated();
  const xp = useWalletStore((s) => s.xp);
  const saldo = useWalletStore((s) => s.ecoPontos);

  return (
    <PageContainer>
      <BalanceHeader />

      <div className="mt-7 space-y-6">
        <QuickStats />

        {/* Progressão: nível à esquerda, score à direita */}
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <EcoLevelCard xp={hydrated ? xp : CITIZEN.xp} />
          <EcoScore entrada={CITIZEN_ECO_SCORE_INPUT} />
        </div>

        <StreakCalendar semanas={CITIZEN.streakSemanas} />

        {/* Leitura analítica */}
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <MonthlyChart />
          <MaterialBreakdown />
        </div>

        {/* Módulos de ação */}
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <ActiveChallenges />
          <FeaturedRewards saldo={hydrated ? saldo : CITIZEN.ecoPontos} />
          <NearbyPoints />
        </div>

        <RecentActivity />
      </div>
    </PageContainer>
  );
}
