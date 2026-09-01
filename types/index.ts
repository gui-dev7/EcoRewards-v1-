/**
 * Domínio EcoRewards — tipos compartilhados por toda a aplicação.
 * A plataforma é demonstrativa: não há banco de dados nem persistência remota.
 */

export type Environment = "cidadao" | "empresa" | "governo";

export type MaterialId =
  | "plastico"
  | "papel"
  | "vidro"
  | "metal"
  | "eletronico"
  | "organico"
  | "oleo";

export interface Material {
  id: MaterialId;
  nome: string;
  /** EcoPontos concedidos por quilograma. */
  pontosPorKg: number;
  /** kg de CO2 evitado por kg reciclado. */
  co2PorKg: number;
  /** Peso médio de uma unidade, em kg — usado pelo simulador de impacto. */
  pesoUnitarioKg: number;
  cor: string;
  icone: string;
  descricao: string;
}

/* ------------------------------------------------------------------ */
/* Cidadão                                                             */
/* ------------------------------------------------------------------ */

export type EcoLevelId =
  | "semente"
  | "broto"
  | "folha"
  | "arvore"
  | "floresta"
  | "guardiao";

export interface EcoLevel {
  id: EcoLevelId;
  nome: string;
  ordem: number;
  /** XP mínimo para alcançar o nível. */
  xpMinimo: number;
  descricao: string;
}

export interface CitizenProfile {
  id: string;
  nome: string;
  email: string;
  avatarIniciais: string;
  cidade: string;
  estado: string;
  membroDesde: string;
  ecoPontos: number;
  xp: number;
  ecoScore: number;
  streakSemanas: number;
  kgReciclados: number;
  co2EvitadoKg: number;
  descartes: number;
  posicaoRankingGlobal: number;
  posicaoRankingCidade: number;
  totalUsuariosGlobal: number;
}

export type TransactionKind = "ganho" | "gasto" | "bonus" | "estorno";

export interface WalletTransaction {
  id: string;
  data: string;
  descricao: string;
  origem: string;
  tipo: TransactionKind;
  pontos: number;
  status: "concluido" | "pendente" | "cancelado";
  materialId?: MaterialId;
  pesoKg?: number;
}

export type ChallengeCadence = "diario" | "semanal" | "mensal" | "comunitario";

export interface Challenge {
  id: string;
  titulo: string;
  descricao: string;
  cadencia: ChallengeCadence;
  meta: number;
  progresso: number;
  unidade: string;
  recompensaPontos: number;
  expiraEm: string;
  icone: string;
  concluido?: boolean;
  participantes?: number;
}

export type BadgeRarity = "bronze" | "prata" | "ouro" | "lendaria";

export interface Badge {
  id: string;
  nome: string;
  descricao: string;
  raridade: BadgeRarity;
  icone: string;
  xp: number;
  desbloqueada: boolean;
  desbloqueadaEm?: string;
  requisito: string;
  progresso?: number;
  meta?: number;
}

export type RewardCategory =
  | "mobilidade"
  | "alimentacao"
  | "cultura"
  | "streaming"
  | "energia"
  | "produtos"
  | "experiencias";

export interface Reward {
  id: string;
  nome: string;
  parceiro: string;
  categoria: RewardCategory;
  descricao: string;
  detalhes: string;
  pontos: number;
  valorEstimado: number;
  disponibilidade: number;
  validade: string;
  destaque?: boolean;
  termos: string[];
}

export interface Redemption {
  id: string;
  rewardId: string;
  nome: string;
  parceiro: string;
  codigo: string;
  pontos: number;
  resgatadoEm: string;
  validade: string;
  status: "ativo" | "usado" | "expirado";
}

export interface RankingEntry {
  posicao: number;
  nome: string;
  iniciais: string;
  cidade: string;
  pontos: number;
  variacao: number;
  nivel: EcoLevelId;
  ehUsuarioAtual?: boolean;
}

export type NotificationKind =
  | "pontos"
  | "recompensa"
  | "desafio"
  | "conquista"
  | "ecoponto"
  | "sistema";

export interface AppNotification {
  id: string;
  tipo: NotificationKind;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  href?: string;
}

export interface ActivityEntry {
  id: string;
  descricao: string;
  detalhe: string;
  data: string;
  icone: string;
  pontos?: number;
}

/* ------------------------------------------------------------------ */
/* Ecopontos                                                           */
/* ------------------------------------------------------------------ */

export type CollectionPointStatus =
  | "operacional"
  | "quase-cheio"
  | "lotado"
  | "manutencao";

export interface CollectionPoint {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
  regiaoId: string;
  lat: number;
  lng: number;
  materiais: MaterialId[];
  horario: string;
  capacidadePercentual: number;
  status: CollectionPointStatus;
  descartesMes: number;
  kgMes: number;
  acessibilidade: boolean;
  instaladoEm: string;
}

/* ------------------------------------------------------------------ */
/* Empresa (B2B)                                                       */
/* ------------------------------------------------------------------ */

export interface CompanyProfile {
  id: string;
  nome: string;
  email: string;
  segmento: string;
  cnpj: string;
  cidade: string;
  colaboradores: number;
  colaboradoresAtivos: number;
  unidades: string[];
  membroDesde: string;
  pontosDistribuidos: number;
  orcamentoAnual: number;
  orcamentoUtilizado: number;
  toneladasRecicladas: number;
  co2EvitadoToneladas: number;
  metaAnualToneladas: number;
}

export interface Department {
  id: string;
  nome: string;
  unidade: string;
  colaboradores: number;
  adesaoPercentual: number;
  kgReciclados: number;
  pontos: number;
  variacaoMensal: number;
}

export interface Employee {
  id: string;
  nome: string;
  iniciais: string;
  cargo: string;
  departamentoId: string;
  unidade: string;
  pontos: number;
  kgReciclados: number;
  descartes: number;
  nivel: EcoLevelId;
  ativo: boolean;
  desde: string;
}

export type CampaignStatus = "ativa" | "pausada" | "encerrada" | "rascunho";

export interface Campaign {
  id: string;
  nome: string;
  descricao: string;
  status: CampaignStatus;
  metaKg: number;
  progressoKg: number;
  participantes: number;
  recompensaPontos: number;
  inicio: string;
  fim: string;
  unidade: string;
  departamentos: string[];
}

export interface EsgIndicator {
  id: string;
  nome: string;
  valor: number;
  unidade: string;
  meta: number;
  variacao: number;
  pilar: "ambiental" | "social" | "governanca";
  descricao: string;
}

/* ------------------------------------------------------------------ */
/* Governo (B2G)                                                       */
/* ------------------------------------------------------------------ */

export interface GovernmentProfile {
  id: string;
  orgao: string;
  email: string;
  responsavel: string;
  abrangencia: string;
  municipios: number;
  populacaoAtendida: number;
  ecopontosAtivos: number;
  usuariosAtivos: number;
  orcamentoAnual: number;
  orcamentoExecutado: number;
  economiaAterro: number;
  membroDesde: string;
}

export interface Region {
  id: string;
  nome: string;
  municipio: string;
  populacao: number;
  usuariosAtivos: number;
  ecopontos: number;
  toneladasRecicladas: number;
  aterroEvitadoToneladas: number;
  co2EvitadoToneladas: number;
  adesaoPercentual: number;
  crescimentoPercentual: number;
  custoOperacional: number;
  economiaEstimada: number;
  riscoOperacional: number;
  lat: number;
  lng: number;
}

export type AnomalyType =
  | "duplicacao-qr"
  | "volume-incompativel"
  | "frequencia-atipica"
  | "geolocalizacao-divergente"
  | "conta-multipla";

export interface Anomaly {
  id: string;
  tipo: AnomalyType;
  titulo: string;
  riskScore: number;
  descricao: string;
  motivo: string[];
  data: string;
  usuario: string;
  ecopontoId: string;
  ecoponto: string;
  cidade: string;
  status: "aberto" | "em-analise" | "resolvido" | "descartado";
  recomendacao: string;
  eventosRelacionados: number;
}

export interface BudgetLine {
  id: string;
  categoria: string;
  previsto: number;
  executado: number;
  descricao: string;
}

/* ------------------------------------------------------------------ */
/* Conteúdo institucional                                              */
/* ------------------------------------------------------------------ */

export interface PressArticle {
  id: string;
  slug: string;
  titulo: string;
  categoria: string;
  resumo: string;
  conteudo: string[];
  autor: string;
  cargoAutor: string;
  data: string;
  tempoLeitura: number;
  destaque?: boolean;
}

export interface JobOpening {
  id: string;
  slug: string;
  titulo: string;
  area: string;
  localizacao: string;
  modalidade: "remoto" | "hibrido" | "presencial";
  senioridade: "estagio" | "junior" | "pleno" | "senior" | "lideranca";
  resumo: string;
  descricao: string[];
  requisitos: string[];
  diferenciais: string[];
  beneficios: string[];
  publicadaEm: string;
}

export interface LiveEvent {
  id: string;
  mensagem: string;
  detalhe: string;
  tipo: "descarte" | "meta" | "ecoponto" | "resgate" | "conquista";
  cidade: string;
}

export interface TimePoint {
  periodo: string;
  [serie: string]: string | number;
}
