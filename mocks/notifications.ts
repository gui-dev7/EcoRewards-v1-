import type { AppNotification } from "@/types";

/**
 * Central de notificações da conta demo, cobrindo os 6 tipos do domínio.
 * Ordenadas da mais recente para a mais antiga. Cinco ainda não lidas.
 */
export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "ntf-012",
    tipo: "pontos",
    titulo: "320 EcoPontos creditados",
    mensagem:
      "Seu descarte de 6,8 kg de plástico no Ecoponto Pinheiros foi validado pela equipe de triagem.",
    data: "2026-08-31T09:20:00-03:00",
    lida: false,
    href: "/app/carteira",
  },
  {
    id: "ntf-011",
    tipo: "desafio",
    titulo: "Semana sem plástico: faltam 2 descartes",
    mensagem:
      "Você já está em 3 de 5. Complete o desafio até domingo e garanta 750 EcoPontos de bônus.",
    data: "2026-08-30T18:05:00-03:00",
    lida: false,
    href: "/app/desafios",
  },
  {
    id: "ntf-010",
    tipo: "ecoponto",
    titulo: "Ecoponto Lapa está lotado",
    mensagem:
      "A coleta está agendada para amanhã de manhã. O Ecoponto Perdizes, a 2,1 km, segue com capacidade livre.",
    data: "2026-08-30T07:40:00-03:00",
    lida: false,
    href: "/app/ecopontos",
  },
  {
    id: "ntf-009",
    tipo: "recompensa",
    titulo: "Nova recompensa no catálogo",
    mensagem:
      "A Solar Coop liberou cotas de energia solar compartilhada por 12.000 EcoPontos. São 24 unidades disponíveis.",
    data: "2026-08-29T14:12:00-03:00",
    lida: false,
    href: "/app/recompensas",
  },
  {
    id: "ntf-008",
    tipo: "sistema",
    titulo: "Manutenção programada no domingo",
    mensagem:
      "A validação de QR Code ficará indisponível entre 2h e 4h de 06/09 para atualização do sistema.",
    data: "2026-08-28T11:00:00-03:00",
    lida: false,
  },
  {
    id: "ntf-007",
    tipo: "recompensa",
    titulo: "Passe de metrô resgatado",
    mensagem:
      "O código ECO-4K2M-71QP já está disponível na sua carteira e é válido até 26/10/2026.",
    data: "2026-08-27T18:41:00-03:00",
    lida: true,
    href: "/app/carteira",
  },
  {
    id: "ntf-006",
    tipo: "desafio",
    titulo: "Desafio concluído: Semana sem plástico",
    mensagem:
      "Você completou os 5 descartes do ciclo de agosto e recebeu 750 EcoPontos.",
    data: "2026-08-25T08:06:00-03:00",
    lida: true,
    href: "/app/desafios",
  },
  {
    id: "ntf-005",
    tipo: "conquista",
    titulo: "Medalha desbloqueada: Curador de Eletrônicos",
    mensagem:
      "Você atingiu 10 kg de eletrônicos encaminhados à logística reversa. +600 XP.",
    data: "2026-08-22T16:25:00-03:00",
    lida: true,
    href: "/app/conquistas",
  },
  {
    id: "ntf-004",
    tipo: "pontos",
    titulo: "468 EcoPontos creditados",
    mensagem:
      "Descarte de 3,9 kg de eletrônicos validado no Ecoponto Vila Madalena.",
    data: "2026-08-22T16:23:00-03:00",
    lida: true,
    href: "/app/carteira",
  },
  {
    id: "ntf-003",
    tipo: "ecoponto",
    titulo: "Novo ecoponto perto de você",
    mensagem:
      "O Ecoponto Alto de Pinheiros abriu na Av. Pedroso de Morais e aceita óleo de cozinha e eletrônicos.",
    data: "2026-08-24T10:30:00-03:00",
    lida: true,
    href: "/app/ecopontos",
  },
  {
    id: "ntf-002",
    tipo: "conquista",
    titulo: "Você subiu 14 posições em São Paulo",
    mensagem:
      "Do 32º para o 18º lugar no ranking da cidade. Continue assim para entrar no top 10.",
    data: "2026-08-21T21:00:00-03:00",
    lida: true,
    href: "/app/conquistas",
  },
  {
    id: "ntf-001",
    tipo: "sistema",
    titulo: "Termos de uso atualizados",
    mensagem:
      "Revisamos a política de dados para detalhar como as validações de descarte são armazenadas.",
    data: "2026-08-20T09:00:00-03:00",
    lida: true,
  },
];

export const UNREAD_NOTIFICATION_COUNT: number = NOTIFICATIONS.filter(
  (n) => !n.lida,
).length;
