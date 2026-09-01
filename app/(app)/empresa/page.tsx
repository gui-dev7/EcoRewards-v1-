import Link from "next/link";
import { FileText } from "@phosphor-icons/react/dist/ssr";
import { PageContainer, PageHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  ActiveCampaigns,
  Announcements,
  CompanyKpis,
  CompanyMaterialSplit,
  DepartmentAdoption,
  EsgSummary,
  GoalPaceChart,
  PointsDistributed,
} from "@/features/company/overview";
import { COMPANY } from "@/mocks/company";

export default function CompanyDashboardPage() {
  return (
    <PageContainer wide>
      <PageHeader
        eyebrow={COMPANY.segmento}
        titulo={COMPANY.nome}
        descricao={`${COMPANY.colaboradores} colaboradores em ${COMPANY.unidades.length} unidades. Os números abaixo cobrem o ano corrente e são atualizados a cada fechamento mensal.`}
        acoes={
          <Button asChild variant="secondary">
            <Link href="/empresa/relatorios">
              <FileText weight="bold" />
              Gerar relatório ESG
            </Link>
          </Button>
        }
      />

      <div className="space-y-6">
        <CompanyKpis />

        {/* A pergunta central do painel ocupa a maior superfície */}
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <GoalPaceChart />
          <CompanyMaterialSplit />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <DepartmentAdoption />
          <PointsDistributed />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <ActiveCampaigns />
          <EsgSummary />
          <Announcements />
        </div>
      </div>
    </PageContainer>
  );
}
