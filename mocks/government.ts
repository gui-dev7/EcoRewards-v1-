import type {
  Anomaly,
  BudgetLine,
  GovernmentProfile,
  MaterialId,
  Region,
  TimePoint,
} from "@/types";

/**
 * Conta demo Governo. Todos os agregados fecham com os detalhes:
 * 42 ecopontos e 486.320 usuários ativos são a soma exata de `REGIONS`,
 * o orçamento anual de R$ 42,5 mi e os R$ 27,84 mi executados são a soma
 * exata de `BUDGET_LINES`.
 */
export const GOVERNMENT: GovernmentProfile = {
  id: "gov-sma-demo",
  orgao: "Secretaria de Meio Ambiente — Demo",
  email: "governo.demo@ecorewards.app",
  responsavel: "Dra. Helena Marques",
  abrangencia: "Região Metropolitana de São Paulo",
  municipios: 8,
  populacaoAtendida: 21400000,
  ecopontosAtivos: 42,
  usuariosAtivos: 486320,
  orcamentoAnual: 42500000,
  orcamentoExecutado: 27840000,
  economiaAterro: 18600000,
  membroDesde: "2024-02-05",
};

/**
 * Oito regiões operacionais. Cada uma agrega os bairros e municípios
 * vizinhos atendidos pela mesma base logística, por isso a população
 * de uma região é maior do que a do distrito que lhe dá nome.
 * Somas: ecopontos = 42, usuariosAtivos = 486.320,
 * toneladasRecicladas = 86.400 t, custoOperacional = R$ 27.840.000,
 * economiaEstimada = R$ 18.600.000.
 */
export const REGIONS: Region[] = [
  {
    id: "reg-leste",
    nome: "Zona Leste",
    municipio: "São Paulo",
    populacao: 5640000,
    usuariosAtivos: 108400,
    ecopontos: 8,
    toneladasRecicladas: 19240,
    aterroEvitadoToneladas: 16540,
    co2EvitadoToneladas: 39440,
    adesaoPercentual: 58,
    crescimentoPercentual: 14.2,
    custoOperacional: 6180000,
    economiaEstimada: 4140000,
    riscoOperacional: 62,
    lat: -23.545,
    lng: -46.52,
  },
  {
    id: "reg-sul",
    nome: "Zona Sul",
    municipio: "São Paulo",
    populacao: 4860000,
    usuariosAtivos: 96800,
    ecopontos: 8,
    toneladasRecicladas: 17180,
    aterroEvitadoToneladas: 14780,
    co2EvitadoToneladas: 35220,
    adesaoPercentual: 61,
    crescimentoPercentual: 11.6,
    custoOperacional: 5520000,
    economiaEstimada: 3700000,
    riscoOperacional: 47,
    lat: -23.642,
    lng: -46.68,
  },
  {
    id: "reg-oeste",
    nome: "Zona Oeste",
    municipio: "São Paulo",
    populacao: 1960000,
    usuariosAtivos: 72600,
    ecopontos: 8,
    toneladasRecicladas: 12860,
    aterroEvitadoToneladas: 11060,
    co2EvitadoToneladas: 26360,
    adesaoPercentual: 68,
    crescimentoPercentual: 9.4,
    custoOperacional: 4140000,
    economiaEstimada: 2770000,
    riscoOperacional: 38,
    lat: -23.557,
    lng: -46.71,
  },
  {
    id: "reg-norte",
    nome: "Zona Norte",
    municipio: "São Paulo",
    populacao: 2780000,
    usuariosAtivos: 68200,
    ecopontos: 6,
    toneladasRecicladas: 12100,
    aterroEvitadoToneladas: 10400,
    co2EvitadoToneladas: 24800,
    adesaoPercentual: 52,
    crescimentoPercentual: 16.8,
    custoOperacional: 3890000,
    economiaEstimada: 2600000,
    riscoOperacional: 71,
    lat: -23.498,
    lng: -46.628,
  },
  {
    id: "reg-abc",
    nome: "ABC Paulista",
    municipio: "Santo André",
    populacao: 3180000,
    usuariosAtivos: 48700,
    ecopontos: 3,
    toneladasRecicladas: 8620,
    aterroEvitadoToneladas: 7420,
    co2EvitadoToneladas: 17670,
    adesaoPercentual: 49,
    crescimentoPercentual: 8.1,
    custoOperacional: 2780000,
    economiaEstimada: 1860000,
    riscoOperacional: 54,
    lat: -23.668,
    lng: -46.54,
  },
  {
    id: "reg-centro",
    nome: "Centro Expandido",
    municipio: "São Paulo",
    populacao: 620000,
    usuariosAtivos: 41300,
    ecopontos: 5,
    toneladasRecicladas: 7340,
    aterroEvitadoToneladas: 6310,
    co2EvitadoToneladas: 15050,
    adesaoPercentual: 72,
    crescimentoPercentual: 6.3,
    custoOperacional: 2360000,
    economiaEstimada: 1580000,
    riscoOperacional: 44,
    lat: -23.5505,
    lng: -46.64,
  },
  {
    id: "reg-guarulhos",
    nome: "Guarulhos",
    municipio: "Guarulhos",
    populacao: 1480000,
    usuariosAtivos: 29400,
    ecopontos: 2,
    toneladasRecicladas: 5210,
    aterroEvitadoToneladas: 4480,
    co2EvitadoToneladas: 10680,
    adesaoPercentual: 41,
    crescimentoPercentual: 19.7,
    custoOperacional: 1720000,
    economiaEstimada: 1120000,
    riscoOperacional: 66,
    lat: -23.456,
    lng: -46.518,
  },
  {
    id: "reg-osasco",
    nome: "Osasco",
    municipio: "Osasco",
    populacao: 880000,
    usuariosAtivos: 20920,
    ecopontos: 2,
    toneladasRecicladas: 3850,
    aterroEvitadoToneladas: 3310,
    co2EvitadoToneladas: 7880,
    adesaoPercentual: 46,
    crescimentoPercentual: 13.5,
    custoOperacional: 1250000,
    economiaEstimada: 830000,
    riscoOperacional: 35,
    lat: -23.532,
    lng: -46.792,
  },
];

export const REGION_BY_ID: Record<string, Region> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r]),
);

/**
 * Doze meses fechados (Set/25 a Ago/26), em toneladas.
 * `reciclado` soma 86.400 t, `aterroEvitado` soma 74.300 t e
 * `co2` soma 177.100 t — os mesmos totais consolidados em `REGIONS`.
 */
export const GOVERNMENT_MONTHLY: TimePoint[] = [
  { periodo: "Set/25", reciclado: 5980, aterroEvitado: 5140, co2: 12260, novosUsuarios: 7420 },
  { periodo: "Out/25", reciclado: 6320, aterroEvitado: 5440, co2: 12960, novosUsuarios: 8160 },
  { periodo: "Nov/25", reciclado: 6640, aterroEvitado: 5710, co2: 13610, novosUsuarios: 8940 },
  { periodo: "Dez/25", reciclado: 7180, aterroEvitado: 6180, co2: 14720, novosUsuarios: 11280 },
  { periodo: "Jan/26", reciclado: 5420, aterroEvitado: 4660, co2: 11110, novosUsuarios: 6840 },
  { periodo: "Fev/26", reciclado: 6780, aterroEvitado: 5830, co2: 13900, novosUsuarios: 9260 },
  { periodo: "Mar/26", reciclado: 7260, aterroEvitado: 6240, co2: 14880, novosUsuarios: 10480 },
  { periodo: "Abr/26", reciclado: 7540, aterroEvitado: 6480, co2: 15460, novosUsuarios: 11140 },
  { periodo: "Mai/26", reciclado: 7820, aterroEvitado: 6730, co2: 16030, novosUsuarios: 11860 },
  { periodo: "Jun/26", reciclado: 8140, aterroEvitado: 7000, co2: 16690, novosUsuarios: 12640 },
  { periodo: "Jul/26", reciclado: 8420, aterroEvitado: 7240, co2: 17260, novosUsuarios: 13420 },
  { periodo: "Ago/26", reciclado: 8900, aterroEvitado: 7650, co2: 18220, novosUsuarios: 14260 },
];

/**
 * Ocorrências do sistema de detecção de anomalias — um mecanismo
 * demonstrativo baseado em REGRAS FIXAS (limiares de volume, janela de
 * tempo entre leituras, distância entre coordenadas e repetição de
 * cadastro). Não há modelo estatístico, aprendizado de máquina ou
 * inteligência artificial envolvidos: o `riskScore` é apenas a soma
 * ponderada das regras violadas, e toda ocorrência exige conferência
 * humana antes de qualquer medida administrativa.
 */
export const ANOMALIES: Anomaly[] = [
  {
    id: "anm-001",
    tipo: "duplicacao-qr",
    titulo: "Possível duplicação de QR",
    riskScore: 92,
    descricao:
      "O mesmo código de validação foi lido 7 vezes em 19 minutos no Ecoponto Sé, sempre com o peso declarado idêntico.",
    motivo: [
      "7 leituras do mesmo QR em 19 minutos (regra dispara acima de 3 em 30 min).",
      "Peso declarado idêntico de 4,20 kg em todas as leituras.",
      "Nenhuma pesagem correspondente registrada na balança do equipamento.",
    ],
    data: "2026-08-30T15:42:00-03:00",
    usuario: "usr-31842",
    ecopontoId: "eco-038",
    ecoponto: "Ecoponto Sé",
    cidade: "São Paulo",
    status: "aberto",
    recomendacao:
      "Bloquear preventivamente o código, solicitar o vídeo do totem entre 15h20 e 15h50 e confirmar a pesagem com o operador de plantão antes de creditar os pontos.",
    eventosRelacionados: 7,
  },
  {
    id: "anm-002",
    tipo: "volume-incompativel",
    titulo: "Volume incompatível com histórico",
    riskScore: 78,
    descricao:
      "Conta com média de 6,4 kg por descarte registrou 84 kg de papel em uma única entrega no Ecoponto Tatuapé.",
    motivo: [
      "Volume 13 vezes acima da média dos últimos 90 dias da conta.",
      "Material declarado como papel, mas sem nota de coleta comercial anexada.",
      "Entrega feita fora do horário de operação da esteira de triagem.",
    ],
    data: "2026-08-28T19:10:00-03:00",
    usuario: "usr-27615",
    ecopontoId: "eco-017",
    ecoponto: "Ecoponto Tatuapé",
    cidade: "São Paulo",
    status: "em-analise",
    recomendacao:
      "Reter o crédito por 72 horas e pedir comprovante de origem do material; se for volume comercial, migrar a conta para o cadastro de gerador empresarial.",
    eventosRelacionados: 1,
  },
  {
    id: "anm-003",
    tipo: "volume-incompativel",
    titulo: "Salto de volume em conta recém-criada",
    riskScore: 88,
    descricao:
      "Conta aberta há 9 dias acumulou 214 kg em quatro entregas no Ecoponto Brasilândia.",
    motivo: [
      "Média de 53,5 kg por entrega em conta sem histórico consolidado.",
      "Quatro entregas em dias consecutivos, todas próximas do fechamento.",
      "Cadastro sem comprovante de endereço validado.",
    ],
    data: "2026-08-27T18:05:00-03:00",
    usuario: "usr-49207",
    ecopontoId: "eco-026",
    ecoponto: "Ecoponto Brasilândia",
    cidade: "São Paulo",
    status: "aberto",
    recomendacao:
      "Suspender novos créditos até a validação do endereço e agendar entrevista presencial com a coordenação da região norte.",
    eventosRelacionados: 4,
  },
  {
    id: "anm-004",
    tipo: "conta-multipla",
    titulo: "Cadastros distintos com mesmo dispositivo",
    riskScore: 84,
    descricao:
      "Seis contas diferentes validaram descartes a partir do mesmo identificador de dispositivo em 11 dias.",
    motivo: [
      "6 contas compartilham o mesmo identificador de aparelho.",
      "Endereços de cadastro diferentes, todos no mesmo CEP.",
      "Descartes sempre no mesmo ecoponto e na mesma faixa de horário.",
    ],
    data: "2026-08-26T10:28:00-03:00",
    usuario: "usr-38104",
    ecopontoId: "eco-020",
    ecoponto: "Ecoponto Itaquera",
    cidade: "São Paulo",
    status: "em-analise",
    recomendacao:
      "Consolidar as seis contas em um único cadastro familiar e aplicar o limite de crédito por domicílio previsto no regulamento.",
    eventosRelacionados: 23,
  },
  {
    id: "anm-005",
    tipo: "frequencia-atipica",
    titulo: "Frequência atípica de validações",
    riskScore: 71,
    descricao:
      "Conta registrou 19 descartes em 24 horas no Ecoponto Guarulhos Centro, contra média de 2 por semana.",
    motivo: [
      "19 validações em 24 horas (limiar da regra: 8 por dia).",
      "Intervalo médio de 41 minutos entre leituras consecutivas.",
      "Somatório de peso de apenas 9,8 kg, sugerindo fracionamento.",
    ],
    data: "2026-08-25T21:15:00-03:00",
    usuario: "usr-11930",
    ecopontoId: "eco-034",
    ecoponto: "Ecoponto Guarulhos Centro",
    cidade: "Guarulhos",
    status: "aberto",
    recomendacao:
      "Aplicar o limite diário de 8 validações à conta e orientar o usuário a agrupar os materiais em uma única entrega.",
    eventosRelacionados: 19,
  },
  {
    id: "anm-006",
    tipo: "geolocalizacao-divergente",
    titulo: "Validação distante do ecoponto",
    riskScore: 66,
    descricao:
      "Leituras registradas a 14,2 km do Ecoponto Santo Amaro, fora do raio de tolerância de 300 metros.",
    motivo: [
      "Distância de 14,2 km entre o aparelho e o equipamento na hora da leitura.",
      "Três ocorrências semelhantes na mesma conta em 15 dias.",
      "Precisão do sinal reportada como alta, o que reduz a chance de erro de GPS.",
    ],
    data: "2026-08-24T13:47:00-03:00",
    usuario: "usr-20558",
    ecopontoId: "eco-013",
    ecoponto: "Ecoponto Santo Amaro",
    cidade: "São Paulo",
    status: "em-analise",
    recomendacao:
      "Exigir validação presencial com leitura do totem nas próximas três entregas e conferir o log de localização com a equipe de campo.",
    eventosRelacionados: 3,
  },
  {
    id: "anm-007",
    tipo: "duplicacao-qr",
    titulo: "QR reutilizado entre ecopontos",
    riskScore: 58,
    descricao:
      "O mesmo código foi lido no Ecoponto Moema e, 22 minutos depois, no Ecoponto Vila Mariana.",
    motivo: [
      "Duas leituras do mesmo código em equipamentos diferentes.",
      "Intervalo de 22 minutos para um trajeto estimado em 35 minutos.",
      "Segunda leitura sem confirmação de pesagem.",
    ],
    data: "2026-08-23T16:30:00-03:00",
    usuario: "usr-44712",
    ecopontoId: "eco-010",
    ecoponto: "Ecoponto Moema",
    cidade: "São Paulo",
    status: "resolvido",
    recomendacao:
      "Invalidar a segunda leitura e revisar a sincronização de relógio dos dois totens, que apresentavam 4 minutos de defasagem.",
    eventosRelacionados: 2,
  },
  {
    id: "anm-008",
    tipo: "volume-incompativel",
    titulo: "Peso de vidro acima da capacidade do contêiner",
    riskScore: 63,
    descricao:
      "Registro de 310 kg de vidro em contêiner cuja capacidade nominal é de 240 kg no Ecoponto Osasco Centro.",
    motivo: [
      "Peso declarado 29% acima da capacidade nominal do contêiner.",
      "Sem registro de esvaziamento entre as duas entregas do dia.",
      "Divergência de 68 kg em relação à pesagem da coleta.",
    ],
    data: "2026-08-22T11:52:00-03:00",
    usuario: "usr-15376",
    ecopontoId: "eco-036",
    ecoponto: "Ecoponto Osasco Centro",
    cidade: "Osasco",
    status: "resolvido",
    recomendacao:
      "Corrigir o lançamento para o peso aferido na coleta e recalibrar a balança do equipamento, que estava com desvio de 22%.",
    eventosRelacionados: 2,
  },
  {
    id: "anm-009",
    tipo: "geolocalizacao-divergente",
    titulo: "Sequência de leituras em municípios distintos",
    riskScore: 55,
    descricao:
      "Duas validações da mesma conta em Santo André e na Zona Norte com 26 minutos de diferença.",
    motivo: [
      "Distância de 31 km entre os dois pontos de leitura.",
      "Intervalo de 26 minutos, inviável no trânsito do horário.",
      "As duas leituras usaram o mesmo identificador de aparelho.",
    ],
    data: "2026-08-21T18:20:00-03:00",
    usuario: "usr-33940",
    ecopontoId: "eco-031",
    ecoponto: "Ecoponto Santo André Centro",
    cidade: "Santo André",
    status: "em-analise",
    recomendacao:
      "Confirmar com o usuário se houve empréstimo do aplicativo a terceiros e, em caso positivo, orientar sobre a vedação de uso compartilhado.",
    eventosRelacionados: 2,
  },
  {
    id: "anm-010",
    tipo: "frequencia-atipica",
    titulo: "Concentração de validações no fechamento",
    riskScore: 47,
    descricao:
      "Doze contas concentraram 61% das validações do dia nos últimos 20 minutos de operação do Ecoponto Lapa.",
    motivo: [
      "61% das validações do dia em uma janela de 20 minutos.",
      "Padrão repetido em 4 dos últimos 7 dias úteis.",
      "Triagem do material feita apenas no dia seguinte, sem conferência imediata.",
    ],
    data: "2026-08-20T18:55:00-03:00",
    usuario: "usr-diversos",
    ecopontoId: "eco-004",
    ecoponto: "Ecoponto Lapa",
    cidade: "São Paulo",
    status: "aberto",
    recomendacao:
      "Antecipar em 30 minutos o encerramento das validações e escalar um operador extra para conferência no último turno.",
    eventosRelacionados: 34,
  },
  {
    id: "anm-011",
    tipo: "conta-multipla",
    titulo: "Contas com mesmo comprovante de endereço",
    riskScore: 41,
    descricao:
      "Três cadastros anexaram a mesma conta de energia como comprovante de residência.",
    motivo: [
      "Mesmo número de unidade consumidora em 3 cadastros distintos.",
      "Datas de criação em um intervalo de 6 dias.",
      "Todas as contas ativas e com descartes no mesmo equipamento.",
    ],
    data: "2026-08-19T09:34:00-03:00",
    usuario: "usr-29018",
    ecopontoId: "eco-024",
    ecoponto: "Ecoponto Cidade Tiradentes",
    cidade: "São Paulo",
    status: "descartado",
    recomendacao:
      "Nenhuma medida necessária: a conferência documental confirmou tratar-se de três moradores adultos do mesmo domicílio, situação permitida pelo regulamento.",
    eventosRelacionados: 3,
  },
  {
    id: "anm-012",
    tipo: "frequencia-atipica",
    titulo: "Intervalo curto entre leituras consecutivas",
    riskScore: 34,
    descricao:
      "Cinco validações da mesma conta com menos de 3 minutos entre elas no Ecoponto Pinheiros.",
    motivo: [
      "Intervalo médio de 2 minutos e 40 segundos entre leituras.",
      "Materiais diferentes declarados em cada leitura.",
      "Peso total de 18,6 kg, compatível com o histórico da conta.",
    ],
    data: "2026-08-18T08:12:00-03:00",
    usuario: "usr-40273",
    ecopontoId: "eco-001",
    ecoponto: "Ecoponto Pinheiros",
    cidade: "São Paulo",
    status: "descartado",
    recomendacao:
      "Nenhuma medida necessária: o comportamento corresponde à separação correta por material em uma única visita; ajustar a regra para não disparar quando o material declarado muda.",
    eventosRelacionados: 5,
  },
];

/** Soma de `previsto` = R$ 42.500.000. Soma de `executado` = R$ 27.840.000. */
export const BUDGET_LINES: BudgetLine[] = [
  {
    id: "orc-operacao",
    categoria: "Operação e manutenção de ecopontos",
    previsto: 12800000,
    executado: 8640000,
    descricao:
      "Equipes de plantão, limpeza, segurança e reparos nos 42 equipamentos da rede.",
  },
  {
    id: "orc-logistica",
    categoria: "Logística e transporte de resíduos",
    previsto: 9600000,
    executado: 6320000,
    descricao:
      "Coleta programada, transbordo e transporte até cooperativas e recicladores.",
  },
  {
    id: "orc-educacao",
    categoria: "Campanhas de educação ambiental",
    previsto: 5400000,
    executado: 3480000,
    descricao:
      "Mutirões, oficinas em escolas e comunicação de bairro sobre separação na fonte.",
  },
  {
    id: "orc-tecnologia",
    categoria: "Tecnologia e plataforma digital",
    previsto: 4900000,
    executado: 3260000,
    descricao:
      "Totens de validação, integração de balanças e sustentação da plataforma.",
  },
  {
    id: "orc-incentivos",
    categoria: "Incentivos e recompensas a munícipes",
    previsto: 4200000,
    executado: 2940000,
    descricao:
      "Contrapartida financeira dos EcoPontos resgatados junto aos parceiros.",
  },
  {
    id: "orc-ampliacao",
    categoria: "Ampliação da rede de ecopontos",
    previsto: 3800000,
    executado: 2180000,
    descricao:
      "Obras civis e instalação de novos equipamentos nas regiões com menor cobertura.",
  },
  {
    id: "orc-fiscalizacao",
    categoria: "Fiscalização e auditoria",
    previsto: 1800000,
    executado: 1020000,
    descricao:
      "Conferência de pesagens, auditoria de destinação final e apuração de anomalias.",
  },
];

/** Soma = 86.400 t, igual ao total consolidado em `REGIONS`. */
export const GOVERNMENT_MATERIAL_SPLIT: {
  materialId: MaterialId;
  toneladas: number;
}[] = [
  { materialId: "papel", toneladas: 26840 },
  { materialId: "plastico", toneladas: 21320 },
  { materialId: "vidro", toneladas: 12760 },
  { materialId: "metal", toneladas: 9480 },
  { materialId: "organico", toneladas: 8940 },
  { materialId: "eletronico", toneladas: 4320 },
  { materialId: "oleo", toneladas: 2740 },
];
