import type { Redemption, Reward, RewardCategory } from "@/types";

/**
 * Catálogo de recompensas do marketplace EcoRewards.
 * Referência de conversão: 1 EcoPonto ≈ R$ 0,02 — todos os `valorEstimado`
 * seguem essa taxa para manter os cálculos de economia coerentes.
 * Os parceiros são fictícios, criados apenas para a demonstração.
 */
export const REWARDS: Reward[] = [
  /* ---------------------------------------------------------------- */
  /* Mobilidade                                                        */
  /* ---------------------------------------------------------------- */
  {
    id: "rwd-mob-001",
    nome: "Passe de metrô — 5 viagens",
    parceiro: "Mobilidade Urbana SP",
    categoria: "mobilidade",
    descricao: "Crédito para cinco viagens na rede de metrô e trens urbanos.",
    detalhes:
      "O código é carregado diretamente no seu Bilhete Único pelo aplicativo do parceiro. O crédito aparece em até 2 horas úteis após a validação e não expira depois de carregado.",
    pontos: 1200,
    valorEstimado: 24,
    disponibilidade: 480,
    validade: "2026-12-31T23:59:00-03:00",
    destaque: true,
    termos: [
      "Válido apenas para o Bilhete Único cadastrado no CPF do titular.",
      "Carga processada em até 2 horas úteis após o resgate.",
      "Não cumulativo com outras promoções de tarifa social.",
      "O código expira 60 dias após o resgate se não for utilizado.",
    ],
  },
  {
    id: "rwd-mob-002",
    nome: "Recarga de R$ 20 no Bilhete Único",
    parceiro: "Mobilidade Urbana SP",
    categoria: "mobilidade",
    descricao: "Crédito livre de R$ 20 para ônibus, metrô e trem.",
    detalhes:
      "Crédito comum, sem restrição de linha ou horário. Pode ser somado ao saldo já existente no cartão e é utilizável em toda a Região Metropolitana de São Paulo.",
    pontos: 1000,
    valorEstimado: 20,
    disponibilidade: 620,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Limite de dois resgates por titular a cada 30 dias.",
      "Necessário informar o número do cartão no momento do resgate.",
      "Crédito não reembolsável em dinheiro.",
    ],
  },
  {
    id: "rwd-mob-003",
    nome: "30 dias de bicicleta compartilhada",
    parceiro: "Bike Livre SP",
    categoria: "mobilidade",
    descricao: "Passe mensal com viagens ilimitadas de até 60 minutos.",
    detalhes:
      "Acesso a todas as estações da rede na capital. Viagens acima de 60 minutos seguem a tarifa padrão por hora adicional, cobrada no cartão cadastrado no aplicativo do parceiro.",
    pontos: 2200,
    valorEstimado: 44,
    disponibilidade: 180,
    validade: "2026-11-30T23:59:00-03:00",
    termos: [
      "Ativação do passe em até 24 horas após o resgate.",
      "Viagens acima de 60 minutos geram cobrança de hora adicional.",
      "Necessário cadastro prévio no aplicativo do parceiro.",
      "Passe individual e intransferível.",
    ],
  },
  {
    id: "rwd-mob-004",
    nome: "Crédito de R$ 60 em corridas elétricas",
    parceiro: "Rota Elétrica",
    categoria: "mobilidade",
    descricao: "Saldo para viagens em frota 100% elétrica na capital.",
    detalhes:
      "O saldo é aplicado automaticamente nas próximas corridas solicitadas pelo aplicativo do parceiro, com desconto sobre o valor total, incluindo taxa dinâmica.",
    pontos: 3000,
    valorEstimado: 60,
    disponibilidade: 140,
    validade: "2026-12-20T23:59:00-03:00",
    termos: [
      "Válido apenas para corridas iniciadas na Região Metropolitana de São Paulo.",
      "Saldo utilizável em quantas corridas forem necessárias até zerar.",
      "Não aplicável a corridas agendadas com mais de 7 dias de antecedência.",
    ],
  },
  {
    id: "rwd-mob-005",
    nome: "Revisão completa de bicicleta",
    parceiro: "Bike Livre SP",
    categoria: "mobilidade",
    descricao: "Manutenção preventiva em oficinas parceiras.",
    detalhes:
      "Inclui regulagem de freios e câmbio, lubrificação da transmissão, calibragem e revisão de aros. Peças de reposição são cobradas à parte.",
    pontos: 1700,
    valorEstimado: 34,
    disponibilidade: 130,
    validade: "2026-11-30T23:59:00-03:00",
    termos: [
      "Agendamento prévio em uma das 9 oficinas parceiras.",
      "Peças e componentes não estão inclusos.",
      "Serviço executado em até 3 dias úteis.",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Alimentação                                                       */
  /* ---------------------------------------------------------------- */
  {
    id: "rwd-ali-001",
    nome: "Cupom Mercado Verde de R$ 16",
    parceiro: "Mercado Verde",
    categoria: "alimentacao",
    descricao: "Desconto em compras na rede de hortifrúti do parceiro.",
    detalhes:
      "Aceito nas 34 lojas físicas e no site do Mercado Verde. O desconto é aplicado no fechamento do pedido, antes do frete.",
    pontos: 800,
    valorEstimado: 16,
    disponibilidade: 900,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Compra mínima de R$ 40 para aplicação do cupom.",
      "Um cupom por pedido, não acumulável.",
      "Não válido para bebidas alcoólicas e produtos de tabacaria.",
    ],
  },
  {
    id: "rwd-ali-002",
    nome: "Cesta orgânica semanal",
    parceiro: "Mercado Verde",
    categoria: "alimentacao",
    descricao: "Cesta com 8 a 12 itens de produtores da Grande São Paulo.",
    detalhes:
      "A composição varia conforme a safra e é divulgada na véspera da entrega. A embalagem é retornável: basta devolver a caixa na entrega seguinte.",
    pontos: 2500,
    valorEstimado: 50,
    disponibilidade: 260,
    validade: "2026-11-15T23:59:00-03:00",
    destaque: true,
    termos: [
      "Entrega gratuita para CEPs da capital e do ABC Paulista.",
      "Agendamento obrigatório com 3 dias úteis de antecedência.",
      "Composição sujeita à disponibilidade de safra.",
      "A caixa retornável deve ser devolvida na entrega seguinte.",
    ],
  },
  {
    id: "rwd-ali-003",
    nome: "Almoço vegetariano para dois",
    parceiro: "Cozinha Raiz",
    categoria: "alimentacao",
    descricao: "Menu completo para duas pessoas, de segunda a sexta.",
    detalhes:
      "Inclui entrada, prato principal e sobremesa do cardápio do dia, servidos nas unidades de Pinheiros, Vila Mariana e Santana.",
    pontos: 1800,
    valorEstimado: 36,
    disponibilidade: 200,
    validade: "2026-11-30T23:59:00-03:00",
    termos: [
      "Válido de segunda a sexta, das 11h30 às 15h.",
      "Bebidas e couvert não inclusos.",
      "Reserva recomendada em dias de maior movimento.",
    ],
  },
  {
    id: "rwd-ali-004",
    nome: "Assinatura mensal de hortifrúti",
    parceiro: "Feira do Bairro",
    categoria: "alimentacao",
    descricao: "Quatro entregas semanais de frutas, legumes e verduras.",
    detalhes:
      "Você escolhe um dia fixo da semana e pode pausar a assinatura por até 15 dias sem perder as entregas restantes.",
    pontos: 4200,
    valorEstimado: 84,
    disponibilidade: 90,
    validade: "2026-12-15T23:59:00-03:00",
    termos: [
      "Assinatura válida por 30 dias corridos a partir da primeira entrega.",
      "Permitida uma pausa de até 15 dias no período.",
      "Entrega restrita à capital paulista.",
      "Trocas de itens solicitadas até 48 horas antes da entrega.",
    ],
  },
  {
    id: "rwd-ali-005",
    nome: "Café da manhã em cafeteria parceira",
    parceiro: "Cozinha Raiz",
    categoria: "alimentacao",
    descricao: "Combo com bebida quente, pão artesanal e fruta da estação.",
    detalhes:
      "Servido diariamente das 7h às 11h, com grãos de cooperativas do sul de Minas e pães de fermentação natural feitos na própria casa.",
    pontos: 650,
    valorEstimado: 13,
    disponibilidade: 400,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Válido das 7h às 11h, todos os dias.",
      "Um combo por resgate, sem substituição de itens.",
      "Não válido para pedidos por aplicativo de entrega.",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Cultura                                                           */
  /* ---------------------------------------------------------------- */
  {
    id: "rwd-cul-001",
    nome: "Ingresso — Museu do Amanhã",
    parceiro: "Cultura Viva",
    categoria: "cultura",
    descricao: "Entrada individual para a exposição permanente.",
    detalhes:
      "Ingresso com data marcada, escolhida no momento do resgate. Inclui acesso à exposição permanente e às mostras temporárias em cartaz.",
    pontos: 600,
    valorEstimado: 12,
    disponibilidade: 340,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Ingresso individual, com data e horário marcados.",
      "Remarcação permitida uma vez, com 24 horas de antecedência.",
      "Necessário apresentar documento com foto na entrada.",
    ],
  },
  {
    id: "rwd-cul-002",
    nome: "Par de ingressos de cinema",
    parceiro: "Cine Central",
    categoria: "cultura",
    descricao: "Dois ingressos para sessões 2D em qualquer dia da semana.",
    detalhes:
      "Aceito nas 12 salas da rede na Grande São Paulo. Sessões 3D e salas premium exigem complemento pago na bilheteria.",
    pontos: 1400,
    valorEstimado: 28,
    disponibilidade: 300,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Válido para sessões 2D em salas convencionais.",
      "Complemento tarifário para sessões 3D e salas premium.",
      "Sujeito à disponibilidade de assentos na sessão escolhida.",
      "Os dois ingressos devem ser usados na mesma sessão.",
    ],
  },
  {
    id: "rwd-cul-003",
    nome: "Ingresso para show na Casa Aberta",
    parceiro: "Cultura Viva",
    categoria: "cultura",
    descricao: "Entrada para a programação musical mensal da casa.",
    detalhes:
      "A grade é divulgada no primeiro dia de cada mês e contempla artistas independentes brasileiros. O ingresso vale para qualquer show da grade vigente.",
    pontos: 2600,
    valorEstimado: 52,
    disponibilidade: 160,
    validade: "2026-11-30T23:59:00-03:00",
    termos: [
      "Válido para um show da grade do mês em que foi resgatado.",
      "Entrada permitida somente para maiores de 18 anos.",
      "Não há reembolso em caso de não comparecimento.",
    ],
  },
  {
    id: "rwd-cul-004",
    nome: "Clube do livro — assinatura anual",
    parceiro: "Página Viva",
    categoria: "cultura",
    descricao: "Um livro por mês, com curadoria socioambiental.",
    detalhes:
      "Doze envios mensais de obras nacionais sobre clima, cidades e consumo consciente, com encontros online de discussão a cada trimestre.",
    pontos: 5200,
    valorEstimado: 104,
    disponibilidade: 60,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Assinatura de 12 meses, com início no mês seguinte ao resgate.",
      "Frete incluso para todo o território nacional.",
      "Trocas por defeito aceitas em até 7 dias após o recebimento.",
      "Não é permitido transferir a assinatura para terceiros.",
    ],
  },
  {
    id: "rwd-cul-005",
    nome: "Visita guiada ao centro histórico",
    parceiro: "Cultura Viva",
    categoria: "cultura",
    descricao: "Caminhada de 2h30 pelo centro de São Paulo.",
    detalhes:
      "Roteiro a pé pelo Pátio do Colégio, Mosteiro de São Bento e Theatro Municipal, com foco na história urbana e no saneamento da cidade.",
    pontos: 480,
    valorEstimado: 10,
    disponibilidade: 260,
    validade: "2026-11-30T23:59:00-03:00",
    termos: [
      "Saídas às quartas e aos domingos, às 9h.",
      "Grupo mínimo de 6 pessoas para confirmação da saída.",
      "Percurso a pé de aproximadamente 3 km.",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Streaming                                                         */
  /* ---------------------------------------------------------------- */
  {
    id: "rwd-str-001",
    nome: "Fluxo Streaming — 1 mês",
    parceiro: "Fluxo Streaming",
    categoria: "streaming",
    descricao: "Um mês do plano individual, sem anúncios.",
    detalhes:
      "Código aplicado na sua conta existente ou usado para abrir uma conta nova. Ao final do período, a assinatura não é renovada automaticamente.",
    pontos: 900,
    valorEstimado: 18,
    disponibilidade: 700,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Válido para uma conta por CPF.",
      "Não há renovação automática ao término do período.",
      "Não acumulável com períodos promocionais em andamento.",
    ],
  },
  {
    id: "rwd-str-002",
    nome: "Fluxo Streaming — 3 meses",
    parceiro: "Fluxo Streaming",
    categoria: "streaming",
    descricao: "Trimestre do plano individual com catálogo completo.",
    detalhes:
      "Inclui download para assistir sem conexão e dois perfis simultâneos. O código deve ser ativado em até 30 dias após o resgate.",
    pontos: 2400,
    valorEstimado: 48,
    disponibilidade: 420,
    validade: "2026-12-31T23:59:00-03:00",
    destaque: true,
    termos: [
      "Ativação obrigatória em até 30 dias após o resgate.",
      "Válido para contas sem assinatura ativa no momento da ativação.",
      "Limite de dois perfis simultâneos.",
      "Não convertível em crédito ou dinheiro.",
    ],
  },
  {
    id: "rwd-str-003",
    nome: "Som Aberto — 6 meses de música",
    parceiro: "Som Aberto",
    categoria: "streaming",
    descricao: "Semestre de streaming de música em alta definição.",
    detalhes:
      "Catálogo completo, sem anúncios, com playlists curadas por selos independentes brasileiros e modo sem conexão liberado.",
    pontos: 3600,
    valorEstimado: 72,
    disponibilidade: 240,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Válido para novas contas ou contas no plano gratuito.",
      "Período de 6 meses contado a partir da ativação.",
      "Uma ativação por CPF a cada 12 meses.",
    ],
  },
  {
    id: "rwd-str-004",
    nome: "Fluxo Streaming — plano família 12 meses",
    parceiro: "Fluxo Streaming",
    categoria: "streaming",
    descricao: "Um ano do plano família, com até cinco perfis.",
    detalhes:
      "Resgate de maior valor do catálogo de streaming: doze meses completos, cinco perfis independentes e reprodução em quatro telas ao mesmo tempo.",
    pontos: 9600,
    valorEstimado: 192,
    disponibilidade: 40,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Os perfis devem pertencer a residentes do mesmo endereço.",
      "Ativação obrigatória em até 30 dias após o resgate.",
      "Não há reembolso proporcional em caso de cancelamento.",
      "Limite de um resgate por titular por ano.",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Energia                                                           */
  /* ---------------------------------------------------------------- */
  {
    id: "rwd-ene-001",
    nome: "Crédito de R$ 30 na conta de luz",
    parceiro: "Solar Coop",
    categoria: "energia",
    descricao: "Abatimento direto na próxima fatura de energia.",
    detalhes:
      "O crédito é enviado à distribuidora e aparece na fatura seguinte ao resgate, identificado como abatimento de cooperativa de geração distribuída.",
    pontos: 1500,
    valorEstimado: 30,
    disponibilidade: 380,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Necessário informar o número da unidade consumidora.",
      "O titular da conta de energia deve ser o mesmo do cadastro.",
      "Crédito aplicado na fatura do mês seguinte ao resgate.",
    ],
  },
  {
    id: "rwd-ene-002",
    nome: "Crédito de R$ 100 na conta de luz",
    parceiro: "Solar Coop",
    categoria: "energia",
    descricao: "Abatimento de R$ 100 distribuído em até duas faturas.",
    detalhes:
      "Se a fatura do mês for inferior a R$ 100, o saldo remanescente é transferido automaticamente para a fatura seguinte.",
    pontos: 5000,
    valorEstimado: 100,
    disponibilidade: 120,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Crédito dividido em no máximo duas faturas consecutivas.",
      "Válido apenas para unidades consumidoras residenciais.",
      "Não abate taxas de religação nem multas por atraso.",
      "Limite de dois resgates por unidade consumidora por ano.",
    ],
  },
  {
    id: "rwd-ene-003",
    nome: "Kit de lâmpadas LED (6 unidades)",
    parceiro: "Solar Coop",
    categoria: "energia",
    descricao: "Seis lâmpadas de 9 W com selo de eficiência classe A.",
    detalhes:
      "Substituem lâmpadas fluorescentes de 15 W com a mesma luminosidade e reduzem cerca de 40% do consumo de cada ponto de luz.",
    pontos: 1100,
    valorEstimado: 22,
    disponibilidade: 260,
    validade: "2026-11-30T23:59:00-03:00",
    termos: [
      "Entrega em até 12 dias úteis para todo o Brasil.",
      "Garantia de 2 anos contra defeito de fabricação.",
      "Modelo de bulbo E27, luz branca neutra de 4000 K.",
    ],
  },
  {
    id: "rwd-ene-004",
    nome: "Cota de energia solar compartilhada — 6 meses",
    parceiro: "Solar Coop",
    categoria: "energia",
    descricao: "Participação semestral em usina solar da cooperativa.",
    detalhes:
      "A cota gera créditos de energia proporcionais ao consumo médio da sua residência, abatidos automaticamente da fatura durante seis meses.",
    pontos: 12000,
    valorEstimado: 240,
    disponibilidade: 24,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Disponível apenas para unidades atendidas pela distribuidora parceira.",
      "Adesão formalizada por contrato digital com a cooperativa.",
      "Créditos proporcionais ao consumo médio dos últimos 12 meses.",
      "Encerramento antecipado sujeito a aviso prévio de 30 dias.",
    ],
  },
  {
    id: "rwd-ene-005",
    nome: "Diagnóstico de eficiência energética residencial",
    parceiro: "Solar Coop",
    categoria: "energia",
    descricao: "Visita técnica com relatório de economia estimada.",
    detalhes:
      "Um técnico avalia iluminação, refrigeração e chuveiro elétrico da residência e entrega um relatório com estimativa de economia mensal.",
    pontos: 2800,
    valorEstimado: 56,
    disponibilidade: 60,
    validade: "2026-12-15T23:59:00-03:00",
    termos: [
      "Disponível para endereços na Região Metropolitana de São Paulo.",
      "Visita de aproximadamente 90 minutos, agendada em dia útil.",
      "Relatório entregue em até 5 dias úteis após a visita.",
      "Não inclui a execução das melhorias recomendadas.",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Produtos                                                          */
  /* ---------------------------------------------------------------- */
  {
    id: "rwd-pro-001",
    nome: "Kit de sacolas reutilizáveis",
    parceiro: "Raiz Utilidades",
    categoria: "produtos",
    descricao: "Três sacolas de algodão cru para as compras do dia a dia.",
    detalhes:
      "Tecido reforçado de 280 g/m², costura dupla e alça longa. Suportam até 12 kg cada e substituem cerca de 700 sacolas plásticas por ano.",
    pontos: 300,
    valorEstimado: 6,
    disponibilidade: 850,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Um kit por resgate, limite de três kits por ano.",
      "Retirada em ecopontos parceiros ou entrega com frete próprio.",
      "Lavagem à máquina em água fria recomendada.",
    ],
  },
  {
    id: "rwd-pro-002",
    nome: "Garrafa térmica de aço inox 500 ml",
    parceiro: "Raiz Utilidades",
    categoria: "produtos",
    descricao: "Parede dupla, mantém a temperatura por até 12 horas.",
    detalhes:
      "Aço inoxidável 304, livre de BPA, com tampa rosqueável vedada. Acompanha capa de transporte feita de lona reaproveitada.",
    pontos: 1600,
    valorEstimado: 32,
    disponibilidade: 220,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Garantia de 1 ano contra defeito de fabricação.",
      "Entrega em até 10 dias úteis nas capitais.",
      "Cor sujeita à disponibilidade de estoque.",
    ],
  },
  {
    id: "rwd-pro-003",
    nome: "Composteira doméstica compacta",
    parceiro: "Raiz Utilidades",
    categoria: "produtos",
    descricao: "Sistema de três caixas, pensado para apartamentos.",
    detalhes:
      "Processa até 1,2 kg de resíduo orgânico por semana sem odor. Inclui minhocas californianas, manual ilustrado e suporte por 90 dias.",
    pontos: 4800,
    valorEstimado: 96,
    disponibilidade: 70,
    validade: "2026-12-15T23:59:00-03:00",
    termos: [
      "Envio de organismos vivos apenas para a Região Sudeste.",
      "Necessário confirmar o recebimento em até 48 horas após a postagem.",
      "Suporte técnico incluso por 90 dias.",
      "Garantia de 1 ano sobre as caixas plásticas.",
    ],
  },
  {
    id: "rwd-pro-004",
    nome: "Kit de higiene sólida zero resíduo",
    parceiro: "Casa Consciente",
    categoria: "produtos",
    descricao: "Xampu, condicionador e sabonete em barra.",
    detalhes:
      "Fórmulas veganas, sem sulfatos e sem embalagem plástica. Cada barra equivale a aproximadamente dois frascos de 300 ml.",
    pontos: 900,
    valorEstimado: 18,
    disponibilidade: 310,
    validade: "2026-11-30T23:59:00-03:00",
    termos: [
      "Produtos não testados em animais.",
      "Validade mínima de 12 meses na data do envio.",
      "Trocas aceitas apenas com o lacre original intacto.",
    ],
  },
  {
    id: "rwd-pro-005",
    nome: "Conjunto de potes de vidro para granel",
    parceiro: "Casa Consciente",
    categoria: "produtos",
    descricao: "Seis potes herméticos para compras a granel.",
    detalhes:
      "Vidro borossilicato com tampa de bambu e vedação de silicone. Tamanhos de 400 ml a 1,2 L, próprios para armazenar grãos e farinhas.",
    pontos: 2100,
    valorEstimado: 42,
    disponibilidade: 140,
    validade: "2026-12-31T23:59:00-03:00",
    termos: [
      "Embalagem de transporte reforçada, sem plástico bolha.",
      "Trocas por avaria no transporte aceitas em até 7 dias.",
      "As tampas de bambu não podem ir à lava-louças.",
    ],
  },

  /* ---------------------------------------------------------------- */
  /* Experiências                                                      */
  /* ---------------------------------------------------------------- */
  {
    id: "rwd-exp-001",
    nome: "Trilha guiada na Serra da Cantareira",
    parceiro: "Trilha Viva",
    categoria: "experiencias",
    descricao: "Caminhada de 8 km com guia credenciado.",
    detalhes:
      "Percurso de dificuldade moderada pelo Núcleo Pedra Grande, com paradas interpretativas sobre a mata atlântica e a bacia hidrográfica da região.",
    pontos: 2000,
    valorEstimado: 40,
    disponibilidade: 150,
    validade: "2026-11-30T23:59:00-03:00",
    destaque: true,
    termos: [
      "Saídas aos sábados, sujeitas a condições climáticas.",
      "Idade mínima de 12 anos, menores acompanhados de responsável.",
      "Ingresso do parque incluso, transporte por conta do participante.",
      "Cancelamento sem custo até 48 horas antes da data escolhida.",
    ],
  },
  {
    id: "rwd-exp-002",
    nome: "Oficina de compostagem urbana",
    parceiro: "Trilha Viva",
    categoria: "experiencias",
    descricao: "Aula prática de 3 horas sobre compostagem em casa.",
    detalhes:
      "Turmas de até 20 pessoas em hortas comunitárias da capital. Cada participante monta e leva para casa um kit inicial de compostagem.",
    pontos: 700,
    valorEstimado: 14,
    disponibilidade: 280,
    validade: "2026-11-30T23:59:00-03:00",
    termos: [
      "Turmas quinzenais, com vagas limitadas a 20 pessoas.",
      "Kit inicial de compostagem incluso.",
      "Necessário confirmar presença 3 dias antes da oficina.",
    ],
  },
  {
    id: "rwd-exp-003",
    nome: "Passeio de caiaque na Represa Billings",
    parceiro: "Trilha Viva",
    categoria: "experiencias",
    descricao: "Duas horas de remada guiada com equipamento incluso.",
    detalhes:
      "Roteiro pelos braços preservados da represa, com orientação sobre recuperação de mananciais e qualidade da água na Região Metropolitana.",
    pontos: 3400,
    valorEstimado: 68,
    disponibilidade: 90,
    validade: "2026-12-15T23:59:00-03:00",
    termos: [
      "Obrigatório saber nadar e usar colete durante todo o passeio.",
      "Equipamento e seguro de atividade inclusos.",
      "Cancelamento por condição climática gera remarcação automática.",
      "Idade mínima de 14 anos.",
    ],
  },
  {
    id: "rwd-exp-004",
    nome: "Fim de semana em pousada ecológica",
    parceiro: "Trilha Viva",
    categoria: "experiencias",
    descricao: "Duas diárias para duas pessoas no Vale do Ribeira.",
    detalhes:
      "Pousada com energia solar, tratamento próprio de efluentes e alimentação de produtores locais. Inclui café da manhã e uma trilha guiada.",
    pontos: 11000,
    valorEstimado: 220,
    disponibilidade: 18,
    validade: "2026-12-20T23:59:00-03:00",
    termos: [
      "Reserva sujeita a disponibilidade, exceto em feriados prolongados.",
      "Café da manhã e uma trilha guiada inclusos.",
      "Transporte até a pousada por conta dos hóspedes.",
      "Cancelamento sem custo até 15 dias antes da data reservada.",
    ],
  },
  {
    id: "rwd-exp-005",
    nome: "Dia de voluntariado em horta comunitária",
    parceiro: "Trilha Viva",
    categoria: "experiencias",
    descricao: "Manhã de mutirão com almoço comunitário incluso.",
    detalhes:
      "Atividade de plantio, manutenção de canteiros e compostagem em hortas urbanas apoiadas pela plataforma, encerrada com um almoço coletivo.",
    pontos: 320,
    valorEstimado: 7,
    disponibilidade: 500,
    validade: "2026-11-30T23:59:00-03:00",
    termos: [
      "Mutirões aos sábados, das 8h às 13h.",
      "Ferramentas e luvas fornecidas pela organização.",
      "Recomendado o uso de calçado fechado e protetor solar.",
    ],
  },
];

export const REWARD_BY_ID: Record<string, Reward> = Object.fromEntries(
  REWARDS.map((r) => [r.id, r]),
);

export const REWARD_CATEGORIES: {
  id: RewardCategory;
  nome: string;
  descricao: string;
  icone: string;
}[] = [
  {
    id: "mobilidade",
    nome: "Mobilidade",
    descricao: "Transporte público, bicicletas e corridas elétricas",
    icone: "bus",
  },
  {
    id: "alimentacao",
    nome: "Alimentação",
    descricao: "Hortifrúti, cestas orgânicas e refeições em parceiros",
    icone: "fork-knife",
  },
  {
    id: "cultura",
    nome: "Cultura",
    descricao: "Museus, cinema, shows e clubes de leitura",
    icone: "ticket",
  },
  {
    id: "streaming",
    nome: "Streaming",
    descricao: "Assinaturas de vídeo e música sob demanda",
    icone: "play-circle",
  },
  {
    id: "energia",
    nome: "Energia",
    descricao: "Créditos na conta de luz e eficiência energética",
    icone: "lightning",
  },
  {
    id: "produtos",
    nome: "Produtos",
    descricao: "Utilidades duráveis que reduzem o resíduo doméstico",
    icone: "package",
  },
  {
    id: "experiencias",
    nome: "Experiências",
    descricao: "Trilhas, oficinas e vivências ao ar livre",
    icone: "mountains",
  },
];

/**
 * Resgates já realizados pela conta demo (João Silva).
 * Cada item espelha uma transação de gasto em `mocks/citizen.ts`.
 */
export const INITIAL_REDEMPTIONS: Redemption[] = [
  {
    id: "rdm-0003",
    rewardId: "rwd-mob-001",
    nome: "Passe de metrô — 5 viagens",
    parceiro: "Mobilidade Urbana SP",
    codigo: "ECO-4K2M-71QP",
    pontos: 1200,
    resgatadoEm: "2026-08-27T18:40:00-03:00",
    validade: "2026-10-26T23:59:00-03:00",
    status: "ativo",
  },
  {
    id: "rdm-0002",
    rewardId: "rwd-ali-001",
    nome: "Cupom Mercado Verde de R$ 16",
    parceiro: "Mercado Verde",
    codigo: "ECO-9T3R-58HB",
    pontos: 800,
    resgatadoEm: "2026-08-11T19:05:00-03:00",
    validade: "2026-10-10T23:59:00-03:00",
    status: "ativo",
  },
  {
    id: "rdm-0001",
    rewardId: "rwd-cul-001",
    nome: "Ingresso — Museu do Amanhã",
    parceiro: "Cultura Viva",
    codigo: "ECO-2B7L-40XV",
    pontos: 600,
    resgatadoEm: "2026-07-24T17:41:00-03:00",
    validade: "2026-09-22T23:59:00-03:00",
    status: "usado",
  },
];
