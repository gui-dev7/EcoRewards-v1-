"use client";

import {
  Bank,
  Bell,
  ChartLineUp,
  ChartPieSlice,
  Coins,
  Compass,
  FileText,
  Flag,
  Gauge,
  Gift,
  GlobeHemisphereWest,
  MapPin,
  MapTrifold,
  Medal,
  Megaphone,
  QrCode,
  Ranking,
  ShieldWarning,
  Target,
  UserCircle,
  Users,
  Wallet,
} from "@phosphor-icons/react";
import type { Environment } from "@/types";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; weight?: "regular" | "bold" | "fill" | "duotone" }>;
  /** Descrição usada pelo Command Palette. */
  descricao: string;
}

export interface NavGroup {
  titulo: string;
  itens: NavItem[];
}

export const NAV_BY_ENVIRONMENT: Record<Environment, NavGroup[]> = {
  cidadao: [
    {
      titulo: "Minha jornada",
      itens: [
        { href: "/app", label: "Visão geral", icon: Gauge, descricao: "Painel do cidadão" },
        { href: "/app/scanner", label: "Scanner", icon: QrCode, descricao: "Registrar um descarte" },
        { href: "/app/carteira", label: "Carteira", icon: Wallet, descricao: "Saldo e extrato de EcoPontos" },
        { href: "/app/recompensas", label: "Recompensas", icon: Gift, descricao: "Catálogo e resgates" },
      ],
    },
    {
      titulo: "Progresso",
      itens: [
        { href: "/app/desafios", label: "Desafios", icon: Target, descricao: "Metas diárias, semanais e comunitárias" },
        { href: "/app/conquistas", label: "Conquistas", icon: Medal, descricao: "Galeria de medalhas" },
        { href: "/app/ranking", label: "Ranking", icon: Ranking, descricao: "Sua posição entre os recicladores" },
      ],
    },
    {
      titulo: "Explorar",
      itens: [
        { href: "/app/ecopontos", label: "Ecopontos", icon: MapPin, descricao: "Mapa de pontos de coleta" },
        { href: "/app/notificacoes", label: "Notificações", icon: Bell, descricao: "Central de avisos" },
        { href: "/app/perfil", label: "Perfil", icon: UserCircle, descricao: "Conta, impacto e preferências" },
      ],
    },
  ],
  empresa: [
    {
      titulo: "Desempenho",
      itens: [
        { href: "/empresa", label: "Visão geral", icon: Gauge, descricao: "Painel corporativo" },
        { href: "/empresa/analytics", label: "Analytics", icon: ChartLineUp, descricao: "Resíduos, CO2 e adesão" },
        { href: "/empresa/esg", label: "ESG", icon: ChartPieSlice, descricao: "Indicadores e meta anual" },
      ],
    },
    {
      titulo: "Programa",
      itens: [
        { href: "/empresa/colaboradores", label: "Colaboradores", icon: Users, descricao: "Adesão e ranking interno" },
        { href: "/empresa/campanhas", label: "Campanhas", icon: Megaphone, descricao: "Criar e acompanhar campanhas" },
        { href: "/empresa/relatorios", label: "Relatórios", icon: FileText, descricao: "Gerar relatório ESG" },
      ],
    },
  ],
  governo: [
    {
      titulo: "Panorama",
      itens: [
        { href: "/governo", label: "Visão geral", icon: Bank, descricao: "Painel executivo" },
        { href: "/governo/mapa", label: "Mapa", icon: MapTrifold, descricao: "Camadas e heatmaps" },
        { href: "/governo/regioes", label: "Regiões", icon: GlobeHemisphereWest, descricao: "Inteligência regional" },
      ],
    },
    {
      titulo: "Operação",
      itens: [
        { href: "/governo/ecopontos", label: "Ecopontos", icon: MapPin, descricao: "Rede de coleta" },
        { href: "/governo/fraudes", label: "Anomalias", icon: ShieldWarning, descricao: "Risk & Fraud Center" },
        { href: "/governo/orcamento", label: "Orçamento", icon: Coins, descricao: "Execução e economia" },
        { href: "/governo/relatorios", label: "Relatórios", icon: FileText, descricao: "Documentos consolidados" },
      ],
    },
  ],
};

export interface BottomNavItem {
  href: string;
  label: string;
  icon: NavItem["icon"];
  /** O item central ganha tratamento de ação primária. */
  destaque?: boolean;
}

/** Navegação inferior do mobile no B2C — o scanner é a ação central. */
export const CITIZEN_BOTTOM_NAV: BottomNavItem[] = [
  { href: "/app", label: "Início", icon: Gauge },
  { href: "/app/ecopontos", label: "Mapa", icon: MapPin },
  { href: "/app/scanner", label: "Escanear", icon: QrCode, destaque: true },
  { href: "/app/recompensas", label: "Prêmios", icon: Gift },
  { href: "/app/perfil", label: "Perfil", icon: UserCircle },
];

export const ENVIRONMENT_ICON: Record<
  Environment,
  React.ComponentType<{ className?: string; weight?: "regular" | "bold" | "fill" | "duotone" }>
> = {
  cidadao: Compass,
  empresa: Flag,
  governo: Bank,
};
