import type { JobOpening } from "@/types";

/**
 * Vagas abertas da página de carreiras. Conteúdo autoral criado para a
 * demonstração — não corresponde a processos seletivos reais.
 */
export const JOB_OPENINGS: JobOpening[] = [
  {
    id: "job-001",
    slug: "pessoa-engenheira-de-software-senior-front-end",
    titulo: "Pessoa Engenheira de Software Sênior (Front-end)",
    area: "Engenharia",
    localizacao: "São Paulo, SP",
    modalidade: "hibrido",
    senioridade: "senior",
    resumo:
      "Liderar tecnicamente a interface dos três ambientes da plataforma, com foco em performance percebida e acessibilidade.",
    descricao: [
      "Você será responsável pela camada de interface dos ambientes cidadão, empresa e governo, hoje construídos em Next.js e TypeScript.",
      "O trabalho envolve decisões de arquitetura de componentes, orçamento de performance e definição dos padrões que o restante do time de front-end segue.",
      "Boa parte dos usuários acessa a plataforma por celulares intermediários em rede móvel, o que torna tempo de carregamento uma restrição de produto, não um detalhe técnico.",
      "Você trabalhará em par com design e produto desde a fase de exploração, e não apenas na entrega de telas já definidas.",
      "Também caberá a você a mentoria técnica de duas pessoas desenvolvedoras plenas do time.",
    ],
    requisitos: [
      "Experiência sólida com React e TypeScript em produtos com usuários reais.",
      "Domínio de renderização no servidor e das implicações de hidratação em aplicações Next.js.",
      "Prática consistente de acessibilidade: navegação por teclado, semântica e leitores de tela.",
      "Familiaridade com métricas de performance web e capacidade de defendê-las em decisões de escopo.",
      "Experiência em revisão de código e mentoria de pessoas menos experientes.",
    ],
    diferenciais: [
      "Vivência com visualização de dados e bibliotecas de gráficos.",
      "Experiência com aplicações que funcionam bem em conexões instáveis.",
      "Contribuições relevantes em projetos de código aberto.",
      "Conhecimento de mapas interativos e dados geoespaciais no navegador.",
    ],
    beneficios: [
      "Plano de saúde e odontológico sem coparticipação, extensivo a dependentes.",
      "Vale-refeição ou alimentação de livre escolha, sem distinção de uso.",
      "Auxílio de R$ 2.500 para montagem do espaço de trabalho em casa.",
      "Bolsa anual de R$ 6.000 para cursos, conferências e certificações.",
      "Dois dias presenciais por semana, com os demais definidos por você.",
    ],
    publicadaEm: "2026-08-25",
  },
  {
    id: "job-002",
    slug: "pessoa-engenheira-de-software-pleno-back-end",
    titulo: "Pessoa Engenheira de Software Pleno (Back-end)",
    area: "Engenharia",
    localizacao: "Remoto (Brasil)",
    modalidade: "remoto",
    senioridade: "pleno",
    resumo:
      "Construir e sustentar os serviços de validação de descartes, pontuação e integração com balanças dos ecopontos.",
    descricao: [
      "O time de back-end mantém os serviços que registram descartes, calculam EcoPontos e conciliam as pesagens vindas dos equipamentos em campo.",
      "Você vai trabalhar em integrações com hardware de terceiros, onde falha de rede e dado inconsistente são a regra, não a exceção.",
      "Parte relevante do trabalho é desenhar mecanismos de reconciliação: o que fazer quando a leitura do totem e a pesagem da balança discordam.",
      "Você participará das decisões de modelagem de dados e do desenho das regras de detecção de anomalias operacionais.",
      "O time opera com plantão distribuído e você entrará na escala após o período de adaptação.",
    ],
    requisitos: [
      "Experiência com Node.js ou Go em serviços de produção.",
      "Modelagem e otimização de bancos relacionais, com noções claras de índice e plano de execução.",
      "Prática com filas, processamento assíncrono e idempotência.",
      "Escrita de testes automatizados como parte do fluxo normal de trabalho.",
      "Boa comunicação escrita, requisito real em um time distribuído.",
    ],
    diferenciais: [
      "Experiência com integração de dispositivos IoT ou hardware embarcado.",
      "Conhecimento de sistemas de conciliação financeira ou de estoque.",
      "Vivência com observabilidade: métricas, tracing distribuído e alertas úteis.",
      "Experiência prévia em produtos do setor público ou regulado.",
    ],
    beneficios: [
      "Trabalho 100% remoto dentro do Brasil, com encontros presenciais trimestrais.",
      "Plano de saúde nacional e odontológico sem coparticipação.",
      "Auxílio mensal de R$ 400 para internet e energia.",
      "Licença parental estendida de 6 meses para qualquer configuração familiar.",
      "Bolsa anual de R$ 6.000 para desenvolvimento profissional.",
    ],
    publicadaEm: "2026-08-18",
  },
  {
    id: "job-003",
    slug: "pessoa-engenheira-de-plataforma-confiabilidade",
    titulo: "Pessoa Engenheira de Plataforma (Confiabilidade)",
    area: "Engenharia",
    localizacao: "Remoto (Brasil)",
    modalidade: "remoto",
    senioridade: "senior",
    resumo:
      "Sustentar a infraestrutura que atende 42 ecopontos e centenas de milhares de contas ativas, com foco em disponibilidade previsível.",
    descricao: [
      "Você cuidará da infraestrutura, dos pipelines de entrega e das práticas de confiabilidade da plataforma.",
      "Os totens dos ecopontos operam com conectividade instável, o que exige tolerância a falhas no lado do servidor e filas resilientes.",
      "Será sua responsabilidade definir os indicadores de nível de serviço junto aos times de produto e traduzi-los em alertas acionáveis.",
      "Você conduzirá as análises pós-incidente, com foco em causa sistêmica e não em responsabilização individual.",
      "O trabalho inclui gestão de custo de infraestrutura, hoje um item relevante do orçamento anual.",
    ],
    requisitos: [
      "Experiência operando serviços em nuvem com contêineres em produção.",
      "Domínio de infraestrutura como código e de pipelines de entrega contínua.",
      "Prática consolidada em observabilidade e resposta a incidentes.",
      "Conhecimento sólido de redes, DNS e TLS aplicado a problemas reais.",
      "Capacidade de escrever documentação que outras pessoas realmente usam.",
    ],
    diferenciais: [
      "Experiência com dispositivos em campo e sincronização intermitente.",
      "Vivência com requisitos de conformidade e auditoria de dados.",
      "Conhecimento de otimização de custo em nuvem com resultado mensurável.",
      "Experiência em times que adotam plantão distribuído de forma sustentável.",
    ],
    beneficios: [
      "Trabalho 100% remoto dentro do Brasil.",
      "Adicional de plantão pago à parte e folga compensatória garantida.",
      "Plano de saúde nacional e odontológico sem coparticipação.",
      "Auxílio de R$ 2.500 para montagem do espaço de trabalho em casa.",
      "Bolsa anual de R$ 6.000 para certificações e conferências.",
    ],
    publicadaEm: "2026-08-11",
  },
  {
    id: "job-004",
    slug: "product-manager-pleno-ambiente-cidadao",
    titulo: "Product Manager Pleno — Ambiente Cidadão",
    area: "Produto",
    localizacao: "São Paulo, SP",
    modalidade: "hibrido",
    senioridade: "pleno",
    resumo:
      "Conduzir a evolução da experiência do cidadão: carteira de pontos, desafios, conquistas e marketplace de recompensas.",
    descricao: [
      "Você será responsável pelo ambiente com maior número de usuários da plataforma, do primeiro descarte ao resgate de recompensas.",
      "O desafio central é retenção: converter interesse inicial em hábito que sobreviva ao terceiro e ao sexto mês.",
      "Você trabalhará com dados de comportamento reais e conduzirá pesquisa qualitativa em campo, nos próprios ecopontos.",
      "Cabe a esta posição decidir o que não será feito — o backlog é maior do que a capacidade do time, e priorizar é a parte difícil.",
      "Você apresentará resultados e trade-offs diretamente à liderança, com números e não com adjetivos.",
    ],
    requisitos: [
      "Experiência conduzindo produtos digitais voltados ao consumidor final.",
      "Confortável com análise quantitativa: definir métrica, montar consulta e interpretar resultado.",
      "Prática de pesquisa com usuários, incluindo entrevistas e observação em campo.",
      "Capacidade de escrever documentos de decisão claros e defensáveis.",
      "Experiência trabalhando lado a lado com engenharia e design desde a descoberta.",
    ],
    diferenciais: [
      "Vivência com mecânicas de gamificação e sistemas de progressão.",
      "Experiência em marketplace ou programa de fidelidade.",
      "Conhecimento do setor de resíduos, saneamento ou serviços públicos.",
      "Repertório em economia comportamental aplicada a produto.",
    ],
    beneficios: [
      "Plano de saúde e odontológico sem coparticipação, extensivo a dependentes.",
      "Vale-refeição ou alimentação de livre escolha.",
      "Dois dias presenciais por semana na unidade de São Paulo.",
      "Bolsa anual de R$ 6.000 para cursos e conferências.",
      "Licença parental estendida de 6 meses.",
    ],
    publicadaEm: "2026-08-20",
  },
  {
    id: "job-005",
    slug: "estagio-em-produto",
    titulo: "Estágio em Produto",
    area: "Produto",
    localizacao: "São Paulo, SP",
    modalidade: "presencial",
    senioridade: "estagio",
    resumo:
      "Apoiar a descoberta e a análise dos três ambientes da plataforma, com acompanhamento próximo e trabalho real desde a primeira semana.",
    descricao: [
      "Você acompanhará o ciclo completo de produto: descoberta, definição, acompanhamento de entrega e leitura de resultado.",
      "Parte do trabalho é organizar e sintetizar pesquisa com usuários, incluindo visitas a ecopontos da rede.",
      "Você produzirá análises de uso que alimentam decisões reais de priorização, com apoio direto de uma pessoa mentora.",
      "Não existe tarefa de estágio separada do trabalho do time: você participa das mesmas reuniões e das mesmas decisões.",
      "A jornada é de 6 horas diárias, com flexibilidade em período de provas.",
    ],
    requisitos: [
      "Cursando graduação com previsão de conclusão a partir de dezembro de 2027.",
      "Boa escrita em português, com clareza para sintetizar informação.",
      "Confortável com planilhas e disposição para aprender consultas em SQL.",
      "Curiosidade genuína por comportamento das pessoas e por problemas urbanos.",
    ],
    diferenciais: [
      "Familiaridade com ferramentas de análise de produto.",
      "Participação em projetos de extensão, empresa júnior ou iniciação científica.",
      "Noções de design de interface ou de pesquisa qualitativa.",
      "Interesse demonstrado por temas socioambientais.",
    ],
    beneficios: [
      "Bolsa-auxílio de R$ 2.400 para jornada de 30 horas semanais.",
      "Vale-refeição e vale-transporte.",
      "Plano de saúde sem coparticipação.",
      "Mentoria estruturada com encontros quinzenais.",
      "Prioridade em processos internos de efetivação.",
    ],
    publicadaEm: "2026-08-04",
  },
  {
    id: "job-006",
    slug: "product-designer-senior",
    titulo: "Product Designer Sênior",
    area: "Design",
    localizacao: "Remoto (Brasil)",
    modalidade: "remoto",
    senioridade: "senior",
    resumo:
      "Desenhar interfaces densas em dados para os painéis de empresa e governo, sem sacrificar clareza nem acessibilidade.",
    descricao: [
      "Você atuará nos ambientes empresa e governo, onde a informação é densa e a leitura precisa ser rápida e correta.",
      "O trabalho combina desenho de interface, arquitetura de informação e definição de padrões de visualização de dados.",
      "Você será responsável por manter o sistema de design coerente entre os três ambientes, que têm públicos muito diferentes.",
      "Acessibilidade é requisito de entrega, não etapa de revisão: contraste, foco visível e navegação por teclado entram desde o primeiro protótipo.",
      "Você conduzirá testes de usabilidade com gestores públicos e responsáveis por sustentabilidade em empresas.",
    ],
    requisitos: [
      "Portfólio com produtos digitais complexos, preferencialmente painéis analíticos.",
      "Domínio de sistemas de design e de componentização.",
      "Conhecimento aplicado de acessibilidade digital, incluindo critérios WCAG.",
      "Prática de teste de usabilidade e capacidade de mudar de rota com base no resultado.",
      "Confortável para trabalhar diretamente no código de estilos quando necessário.",
    ],
    diferenciais: [
      "Experiência com visualização de dados e cartografia.",
      "Vivência em produtos B2B ou de governo digital.",
      "Conhecimento de HTML e CSS suficiente para prototipar em navegador.",
      "Repertório em design de conteúdo e escrita de interface.",
    ],
    beneficios: [
      "Trabalho 100% remoto dentro do Brasil.",
      "Plano de saúde nacional e odontológico sem coparticipação.",
      "Auxílio de R$ 2.500 para montagem do espaço de trabalho.",
      "Bolsa anual de R$ 6.000 para formação.",
      "Encontros presenciais trimestrais com o time, com viagem custeada.",
    ],
    publicadaEm: "2026-08-13",
  },
  {
    id: "job-007",
    slug: "analista-de-dados-pleno",
    titulo: "Analista de Dados Pleno",
    area: "Dados",
    localizacao: "São Paulo, SP",
    modalidade: "hibrido",
    senioridade: "pleno",
    resumo:
      "Transformar os registros de descarte, pontuação e resgate em análises que sustentam decisões de produto e de operação.",
    descricao: [
      "Você trabalhará com dados de descartes, pesagens, resgates e ocupação de ecopontos para responder perguntas de produto e de operação.",
      "Parte do trabalho é definir métricas junto aos times e garantir que elas signifiquem a mesma coisa em todos os painéis.",
      "Você construirá análises sobre retenção, sazonalidade e cobertura geográfica da rede.",
      "Também apoiará a área de integridade operacional na calibragem dos limiares das regras de detecção de anomalias.",
      "As entregas incluem tanto análises pontuais quanto painéis que outras pessoas usam sozinhas.",
    ],
    requisitos: [
      "SQL avançado, incluindo funções de janela e otimização de consultas pesadas.",
      "Python ou R para análise, com prática em manipulação de dados.",
      "Capacidade de traduzir uma pergunta vaga de negócio em uma análise bem definida.",
      "Experiência com ferramentas de visualização e construção de painéis.",
      "Rigor estatístico básico: entender variação amostral e evitar conclusão apressada.",
    ],
    diferenciais: [
      "Experiência com dados geoespaciais e consultas espaciais.",
      "Vivência com análise de séries temporais e sazonalidade.",
      "Conhecimento de modelagem dimensional e boas práticas de camada analítica.",
      "Experiência em produtos com componente de gamificação.",
    ],
    beneficios: [
      "Plano de saúde e odontológico sem coparticipação.",
      "Vale-refeição ou alimentação de livre escolha.",
      "Dois dias presenciais por semana na unidade de São Paulo.",
      "Bolsa anual de R$ 6.000 para cursos e conferências.",
      "Licença parental estendida de 6 meses.",
    ],
    publicadaEm: "2026-08-22",
  },
  {
    id: "job-008",
    slug: "pessoa-engenheira-de-dados-senior",
    titulo: "Pessoa Engenheira de Dados Sênior",
    area: "Dados",
    localizacao: "Remoto (Brasil)",
    modalidade: "remoto",
    senioridade: "senior",
    resumo:
      "Estruturar a camada analítica que alimenta os painéis de empresa, governo e a operação da rede de ecopontos.",
    descricao: [
      "Você desenhará e manterá os pipelines que levam os eventos operacionais até a camada analítica consumida pelos painéis.",
      "O volume não é o desafio principal; a qualidade e a rastreabilidade do dado são, porque relatórios públicos dependem deles.",
      "Você definirá contratos de dados com os times de back-end e os testes que impedem regressão silenciosa.",
      "Parte do trabalho é reduzir o tempo entre o evento em campo e sua disponibilidade nos painéis operacionais.",
      "Você atuará junto à análise de dados na modelagem das tabelas que sustentam as métricas oficiais.",
    ],
    requisitos: [
      "Experiência construindo pipelines de dados em produção, com orquestração e monitoramento.",
      "SQL avançado e domínio de modelagem para consumo analítico.",
      "Python aplicado a processamento e transformação de dados.",
      "Prática com testes de qualidade de dado e detecção de anomalia em pipeline.",
      "Capacidade de documentar linhagem e significado de cada métrica.",
    ],
    diferenciais: [
      "Experiência com dados geoespaciais em escala.",
      "Conhecimento de captura de mudanças e ingestão quase em tempo real.",
      "Vivência com requisitos de auditoria e retenção de dados.",
      "Experiência prévia em setor público ou regulado.",
    ],
    beneficios: [
      "Trabalho 100% remoto dentro do Brasil.",
      "Plano de saúde nacional e odontológico sem coparticipação.",
      "Auxílio mensal de R$ 400 para internet e energia.",
      "Bolsa anual de R$ 6.000 para desenvolvimento profissional.",
      "Encontros presenciais trimestrais com viagem custeada.",
    ],
    publicadaEm: "2026-07-30",
  },
  {
    id: "job-009",
    slug: "coordenacao-de-operacoes-de-ecopontos",
    titulo: "Coordenação de Operações de Ecopontos",
    area: "Operações",
    localizacao: "Campinas, SP",
    modalidade: "presencial",
    senioridade: "lideranca",
    resumo:
      "Liderar a operação de campo dos 42 equipamentos da rede: rotas de coleta, manutenção, equipe local e relação com cooperativas.",
    descricao: [
      "Você responderá pela operação diária da rede: disponibilidade dos equipamentos, rotas de coleta e conferência de pesagens.",
      "A posição lidera uma equipe distribuída entre as regiões atendidas e coordena a relação com sete cooperativas parceiras.",
      "Cabe a você reduzir o tempo de indisponibilidade dos ecopontos, hoje concentrado em manutenção corretiva de prensas e balanças.",
      "Você atuará junto ao time de dados para antecipar lotação e ajustar frequência de coleta por região.",
      "A função exige presença regular em campo, com deslocamento pela Região Metropolitana de São Paulo.",
    ],
    requisitos: [
      "Experiência em liderança de operação logística ou de campo com equipe própria.",
      "Domínio de planejamento de rotas e gestão de indicadores operacionais.",
      "Prática em manutenção preventiva de equipamentos e gestão de contratos de terceiros.",
      "Capacidade de negociar com cooperativas, poder público e fornecedores.",
      "Carteira de habilitação categoria B e disponibilidade para deslocamento diário.",
    ],
    diferenciais: [
      "Experiência no setor de resíduos sólidos ou saneamento.",
      "Vivência com cooperativas de catadores e economia solidária.",
      "Conhecimento de licenciamento ambiental de pontos de entrega voluntária.",
      "Familiaridade com sistemas de rastreabilidade de destinação.",
    ],
    beneficios: [
      "Plano de saúde e odontológico sem coparticipação, extensivo a dependentes.",
      "Veículo da empresa para deslocamento operacional.",
      "Vale-refeição ou alimentação de livre escolha.",
      "Participação nos resultados atrelada a indicadores da rede.",
      "Bolsa anual de R$ 6.000 para formação técnica.",
    ],
    publicadaEm: "2026-08-08",
  },
  {
    id: "job-010",
    slug: "executiva-de-contas-b2b",
    titulo: "Executiva ou Executivo de Contas B2B",
    area: "Comercial",
    localizacao: "São Paulo, SP",
    modalidade: "hibrido",
    senioridade: "pleno",
    resumo:
      "Conduzir o ciclo comercial completo com empresas que querem estruturar programas internos de resíduo e indicadores ESG.",
    descricao: [
      "Você será responsável pelo ciclo comercial com médias e grandes empresas, da prospecção ao fechamento.",
      "O interlocutor típico é a área de sustentabilidade ou de facilities, com participação frequente de compras e jurídico.",
      "A venda é consultiva: envolve diagnóstico do resíduo gerado, desenho de metas e projeção de indicadores ESG.",
      "Você trabalhará junto ao time de sustentabilidade na construção das propostas técnicas.",
      "A posição também acompanha as contas nos primeiros meses, até a operação estabilizar.",
    ],
    requisitos: [
      "Experiência em venda consultiva B2B com ciclo longo e múltiplos decisores.",
      "Capacidade de construir proposta de valor a partir de dados do cliente.",
      "Boa escrita e desenvoltura para apresentar a diretorias.",
      "Organização de funil e disciplina de registro em CRM.",
      "Disponibilidade para visitas presenciais na Grande São Paulo.",
    ],
    diferenciais: [
      "Vivência com temas ESG ou de sustentabilidade corporativa.",
      "Experiência vendendo para áreas de facilities ou compras.",
      "Conhecimento de legislação de resíduos aplicada a empresas.",
      "Rede de contatos no setor de sustentabilidade corporativa.",
    ],
    beneficios: [
      "Remuneração fixa mais variável sem teto, com regra pública de cálculo.",
      "Plano de saúde e odontológico sem coparticipação.",
      "Vale-refeição ou alimentação de livre escolha.",
      "Dois dias presenciais por semana, além das visitas a clientes.",
      "Bolsa anual de R$ 6.000 para formação.",
    ],
    publicadaEm: "2026-08-27",
  },
  {
    id: "job-011",
    slug: "analista-de-sustentabilidade-junior",
    titulo: "Analista de Sustentabilidade Júnior",
    area: "Sustentabilidade",
    localizacao: "Campinas, SP",
    modalidade: "hibrido",
    senioridade: "junior",
    resumo:
      "Apoiar o cálculo de indicadores ambientais, a rastreabilidade de destinação e a construção dos relatórios ESG dos clientes.",
    descricao: [
      "Você apoiará o cálculo dos indicadores ambientais da plataforma e dos programas corporativos atendidos.",
      "Parte central do trabalho é a rastreabilidade: conferir comprovantes de destinação final e cobrar o que estiver pendente.",
      "Você ajudará a montar os relatórios entregues a empresas e órgãos públicos, com atenção à origem de cada número.",
      "A função envolve pesquisa de fatores de emissão e de referências metodológicas para os cálculos de CO2 evitado.",
      "Você acompanhará visitas técnicas a clientes e a cooperativas parceiras.",
    ],
    requisitos: [
      "Graduação concluída ou em conclusão em engenharia ambiental, gestão ambiental ou área correlata.",
      "Domínio de planilhas para cálculo e conferência de indicadores.",
      "Boa escrita técnica em português, com atenção a fontes e premissas.",
      "Organização e cuidado com documentação — a rastreabilidade depende disso.",
    ],
    diferenciais: [
      "Conhecimento de protocolos de inventário de emissões.",
      "Familiaridade com a Política Nacional de Resíduos Sólidos.",
      "Noções de SQL ou de ferramentas de análise de dados.",
      "Experiência prévia com relatórios de sustentabilidade.",
    ],
    beneficios: [
      "Plano de saúde e odontológico sem coparticipação.",
      "Vale-refeição ou alimentação de livre escolha.",
      "Três dias presenciais por semana na filial de Campinas.",
      "Bolsa anual de R$ 6.000 para cursos e certificações.",
      "Licença parental estendida de 6 meses.",
    ],
    publicadaEm: "2026-08-15",
  },
  {
    id: "job-012",
    slug: "analista-de-marketing-de-conteudo",
    titulo: "Analista de Marketing de Conteúdo",
    area: "Marketing",
    localizacao: "Porto Alegre, RS",
    modalidade: "hibrido",
    senioridade: "pleno",
    resumo:
      "Produzir conteúdo que explique economia circular sem simplificação enganosa, para públicos com repertórios muito diferentes.",
    descricao: [
      "Você produzirá o conteúdo editorial da plataforma: sala de imprensa, materiais para empresas e comunicação com cidadãos.",
      "O desafio é explicar temas técnicos — logística reversa, fatores de emissão, rastreabilidade — sem simplificação que distorça.",
      "Você trabalhará com dados reais da operação e precisará confirmar cada número antes de publicá-lo.",
      "A posição envolve também a comunicação de campo nas regiões atendidas, com peças adaptadas ao contexto local.",
      "Você acompanhará o desempenho do conteúdo e ajustará a pauta com base no que efetivamente informa as pessoas.",
    ],
    requisitos: [
      "Experiência com produção de conteúdo para produtos digitais.",
      "Excelente escrita em português, com capacidade de adaptar registro por público.",
      "Prática em apuração: checar dado, citar fonte e recusar afirmação sem lastro.",
      "Conhecimento de SEO aplicado a conteúdo editorial de qualidade.",
      "Autonomia para conduzir pauta do início ao fim.",
    ],
    diferenciais: [
      "Formação ou experiência em jornalismo.",
      "Repertório em temas ambientais ou de cidades.",
      "Experiência com comunicação para setor público.",
      "Noções de design suficientes para prototipar uma peça.",
    ],
    beneficios: [
      "Plano de saúde e odontológico sem coparticipação.",
      "Vale-refeição ou alimentação de livre escolha.",
      "Dois dias presenciais por semana na filial de Porto Alegre.",
      "Bolsa anual de R$ 6.000 para cursos e conferências.",
      "Auxílio de R$ 2.500 para montagem do espaço de trabalho em casa.",
    ],
    publicadaEm: "2026-07-28",
  },
];

export const JOB_OPENING_BY_SLUG: Record<string, JobOpening> =
  Object.fromEntries(JOB_OPENINGS.map((j) => [j.slug, j]));

export const CAREER_AREAS: string[] = [
  "Engenharia",
  "Produto",
  "Design",
  "Dados",
  "Operações",
  "Comercial",
  "Sustentabilidade",
  "Marketing",
];

export const CAREER_LOCATIONS: string[] = [
  "São Paulo, SP",
  "Campinas, SP",
  "Porto Alegre, RS",
  "Remoto (Brasil)",
];

export const CULTURE_VALUES: {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
}[] = [
  {
    id: "cul-honestidade",
    titulo: "Número honesto",
    descricao:
      "Nenhuma métrica sai daqui sem origem verificável. Preferimos um resultado menor e correto a um número redondo que não se sustenta.",
    icone: "scales",
  },
  {
    id: "cul-campo",
    titulo: "Decisão com pé no chão",
    descricao:
      "Quem decide sobre o produto visita ecoponto, conversa com operador e vê o material sendo separado. Suposição de escritório custa caro.",
    icone: "map-pin",
  },
  {
    id: "cul-simplicidade",
    titulo: "Simples antes de sofisticado",
    descricao:
      "Uma regra que qualquer pessoa consegue explicar vale mais do que um modelo impressionante que ninguém audita.",
    icone: "circles-three",
  },
  {
    id: "cul-acesso",
    titulo: "Feito para todo mundo",
    descricao:
      "Acessibilidade e desempenho em celular modesto são requisitos de entrega. Um produto que só funciona bem no aparelho novo exclui quem mais precisa dele.",
    icone: "users-three",
  },
  {
    id: "cul-longo-prazo",
    titulo: "Hábito, não campanha",
    descricao:
      "Medimos o sexto mês, não a primeira semana. O que importa é o que continua acontecendo depois que a novidade passa.",
    icone: "calendar-check",
  },
  {
    id: "cul-erro",
    titulo: "Erro sem culpado",
    descricao:
      "Incidente vira análise de causa sistêmica e mudança de processo. Procurar responsável só ensina o time a esconder problema.",
    icone: "lifebuoy",
  },
];
