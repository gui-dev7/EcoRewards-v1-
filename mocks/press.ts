import type { PressArticle } from "@/types";

export const PRESS_CATEGORIES: string[] = [
  "Institucional",
  "Impacto",
  "Produto",
  "Política Pública",
  "Parcerias",
];

/**
 * Sala de imprensa. Textos autorais escritos para a demonstração —
 * não reproduzem comunicados de organizações reais.
 */
export const PRESS_ARTICLES: PressArticle[] = [
  {
    id: "pra-001",
    slug: "rede-chega-a-42-ecopontos-na-grande-sao-paulo",
    titulo: "A rede chega a 42 ecopontos na Grande São Paulo",
    categoria: "Institucional",
    resumo:
      "Com dois equipamentos inaugurados em agosto, a plataforma passa a cobrir oito municípios e uma população atendida de 21,4 milhões de pessoas.",
    conteudo: [
      "A inauguração do Ecoponto Alto de Pinheiros, no fim de agosto, fechou um ciclo de expansão que levou a rede EcoRewards de 28 para 42 equipamentos em pouco mais de dois anos. A operação cobre agora oito municípios da Região Metropolitana de São Paulo e chega a uma população atendida de 21,4 milhões de pessoas — número que não significa adesão, mas alcance geográfico da infraestrutura.",
      "O critério de escolha dos novos endereços mudou ao longo do caminho. Nas primeiras instalações, o peso maior estava na densidade populacional. Hoje o modelo considera três variáveis combinadas: distância média que o morador precisa percorrer até o ponto mais próximo, ocupação média dos contêineres na região e volume de resíduo reciclável que ainda é enviado ao aterro pela coleta convencional. Onde as três se cruzam, existe uma lacuna real de serviço.",
      "Foi esse cruzamento que explicou a prioridade dada à Zona Norte. A região reúne 2,78 milhões de habitantes e apenas seis equipamentos, o que produz a maior taxa de ocupação da rede: o Ecoponto Brasilândia opera com 96% da capacidade e entra em estado de lotação quase toda semana. Não é um problema de demanda reprimida, e sim de infraestrutura insuficiente para uma demanda que já existe e aparece nos registros.",
      "A contrapartida da expansão é o custo. Cada novo equipamento adiciona obra civil, totem de validação, balança integrada e uma rota fixa de coleta. No orçamento demonstrativo da secretaria parceira, a linha de ampliação da rede responde por R$ 3,8 milhões previstos, dos quais R$ 2,18 milhões já foram executados — a menor taxa de execução entre as sete linhas, justamente porque obras dependem de licenciamento e cronogramas que não se comprimem.",
      "Há um efeito colateral positivo que só ficou visível depois do sexto ou sétimo equipamento: a rede começa a se equilibrar sozinha. Quando o Ecoponto Lapa atinge a lotação, o aplicativo passa a sugerir Perdizes, a 2,1 km, e boa parte dos usuários aceita a troca. Antes de existir uma alternativa próxima, o mesmo aviso simplesmente adiava o descarte — e uma parcela dele nunca acontecia.",
      "O plano para os próximos doze meses é menos ambicioso em número e mais exigente em localização. Em vez de perseguir a marca dos 60 equipamentos, a prioridade é reduzir a distância média até o ecoponto mais próximo nas regiões periféricas, onde ela ainda passa de 3 km. É uma métrica menos vistosa que a contagem de pontos, mas é a que de fato determina se uma pessoa vai ou não separar o resíduo em casa.",
    ],
    autor: "Helena Marques",
    cargoAutor: "Diretora de operações da rede metropolitana",
    data: "2026-08-28T09:00:00-03:00",
    tempoLeitura: 6,
    destaque: true,
  },
  {
    id: "pra-002",
    slug: "125-mil-toneladas-economia-circular-numeros",
    titulo: "125 mil toneladas e o que elas dizem sobre economia circular",
    categoria: "Impacto",
    resumo:
      "O volume acumulado pela plataforma só faz sentido quando comparado ao que continua indo para o aterro. A conta é menos confortável do que o número sugere.",
    conteudo: [
      "A plataforma acumula 125.482 toneladas de material reciclado desde o lançamento. É um número grande o suficiente para caber em qualquer apresentação e pequeno o suficiente para não mudar sozinho o cenário de resíduos do país. O Brasil gera cerca de 82 milhões de toneladas de resíduo sólido urbano por ano, e aproximadamente um terço disso é reciclável em tese. Colocado ao lado dessa base, o volume da plataforma é uma fração modesta.",
      "Reconhecer a escala não diminui o resultado — situa o que ele significa. Economia circular não é um estado que se alcança, é uma taxa que se persegue: quanto do material que entra em circulação volta para a cadeia produtiva em vez de terminar aterrado. Para essa taxa subir, três coisas precisam funcionar ao mesmo tempo, e a coleta é apenas a primeira delas.",
      "A segunda é a triagem. Material reciclável misturado com resíduo orgânico perde valor rapidamente: papel molhado não vira papel de novo, e vidro quebrado misturado a cerâmica compromete o lote inteiro. Nos ecopontos da rede, a separação feita ainda na origem pelo próprio morador é o que sustenta a taxa de aproveitamento — e é também a parte mais difícil de manter constante, porque depende de hábito e não de equipamento.",
      "A terceira é a demanda industrial. Não adianta coletar plástico se não existe comprador para a resina reciclada a um preço que pague a logística. Foi o que aconteceu com o vidro em várias cidades brasileiras: o custo de transporte de um material pesado e de baixo valor unitário chegou a inviabilizar a coleta em regiões distantes das poucas fábricas processadoras. Circularidade também é uma questão de geografia industrial.",
      "Os 26.840 toneladas de papel registrados no último ano na Região Metropolitana ilustram o ponto oposto. Papel e papelão têm cadeia madura, comprador estável e preço razoavelmente previsível — por isso lideram o volume, mesmo não sendo o material de maior impacto por quilo. Metal e eletrônico evitam muito mais CO2 por quilo reciclado, mas aparecem em quantidades bem menores.",
      "É por isso que medir só o peso total distorce a leitura. Uma tonelada de eletrônicos evita cerca de 12,4 toneladas de CO2; uma tonelada de vidro, pouco mais de meia tonelada. Um programa que otimiza para peso e um programa que otimiza para emissão evitada tomam decisões diferentes sobre onde instalar o próximo equipamento e qual material priorizar na comunicação.",
      "A conclusão prática é pouco heroica: o valor de uma plataforma como esta não está no total acumulado, e sim na consistência com que ela reduz o percentual de reciclável que ainda vai para o aterro em cada região atendida. É essa taxa, e não o contador da página inicial, que deveria pautar a próxima decisão de investimento.",
    ],
    autor: "Carolina Menezes",
    cargoAutor: "Especialista em economia circular",
    data: "2026-08-14T10:30:00-03:00",
    tempoLeitura: 7,
  },
  {
    id: "pra-003",
    slug: "logistica-reversa-eletronicos-primeiro-quilometro",
    titulo: "Logística reversa de eletrônicos: o problema é o primeiro quilômetro",
    categoria: "Impacto",
    resumo:
      "A gaveta com cabos, carregadores e celulares antigos é o gargalo real da cadeia. Nenhuma etapa posterior compensa o material que nunca sai de casa.",
    conteudo: [
      "Toda discussão sobre logística reversa de eletrônicos costuma começar pelo destino final: onde o material é desmontado, quem recupera os metais, como se trata o que é perigoso. São perguntas legítimas, mas elas tratam de um problema que só existe se o equipamento sair da casa das pessoas. E, na maior parte dos casos, ele não sai.",
      "O padrão é conhecido de qualquer um que já organizou uma gaveta: carregadores de aparelhos que não existem mais, fones com o cabo partido, dois ou três celulares antigos guardados por precaução. Individualmente é pouco peso. Somado, é o maior estoque disperso de resíduo eletrônico do país, distribuído em milhões de residências e sem nenhum mecanismo que o mobilize.",
      "A explicação não é falta de informação. Pesquisas de comportamento mostram consistentemente que as pessoas sabem que eletrônico não vai no lixo comum. O que falta é uma resposta simples para duas perguntas práticas: onde entrego isso e quando. A distância percebida importa mais do que a distância real — um ponto a 4 km que exige carro é, para efeito de decisão, muito mais longe do que um ponto a 1,5 km no caminho do trabalho.",
      "Foi essa leitura que levou a rede a habilitar eletrônicos em apenas parte dos ecopontos, e não em todos. Manter um contêiner específico, com controle de acesso e retirada quinzenal por cooperativa credenciada, custa caro. Espalhar esse custo por 42 pontos com baixa ocupação em cada um seria pior do que concentrá-lo em 18 pontos bem localizados, com volume suficiente para justificar a rota.",
      "Os números da conta corporativa demonstrativa mostram o efeito de uma coleta interna bem posicionada. A EcoTech Brasil instalou um ponto de recolhimento no terceiro andar da matriz e registrou 612 kg de eletrônicos em menos de dois meses de campanha — material que estava, literalmente, nas gavetas das estações de trabalho. O equipamento não criou o resíduo; ele apenas tornou o descarte mais fácil do que continuar adiando.",
      "A lição vale para políticas públicas de resíduo em geral. Campanhas de conscientização produzem intenção; infraestrutura próxima produz comportamento. Quando as duas andam juntas, a conversão acontece. Quando só existe a primeira, o resultado é uma população bem informada que continua com a mesma gaveta cheia.",
    ],
    autor: "Fernanda Lousada",
    cargoAutor: "Gerente de operações e logística reversa",
    data: "2026-07-22T08:45:00-03:00",
    tempoLeitura: 6,
  },
  {
    id: "pra-004",
    slug: "gamificacao-que-forma-habito-e-nao-so-engajamento",
    titulo: "Gamificação que forma hábito, e não só engajamento",
    categoria: "Produto",
    resumo:
      "Pontos, medalhas e rankings funcionam no primeiro mês. O desafio de projeto é o que acontece no sexto, quando a novidade acaba.",
    conteudo: [
      "Quase todo produto com camada de gamificação apresenta a mesma curva: adesão alta nas primeiras semanas, queda acentuada por volta do segundo mês e um platô bem abaixo do pico. A leitura fácil é que as pessoas perderam o interesse. A leitura mais útil é que o sistema recompensou novidade em vez de recompensar constância.",
      "Na modelagem do EcoRewards, a distinção aparece na forma como os desafios são organizados. Os diários existem para reduzir o atrito da primeira ação do dia e valem pouco: 30 a 60 EcoPontos. Os semanais exigem repetição em janelas curtas e valem entre 320 e 750. Os mensais pedem acumulação e chegam a 1.500. A escala não premia o esforço isolado — premia a sequência que só se sustenta com rotina.",
      "O mesmo raciocínio orienta o multiplicador de sequência aplicado ao cálculo de pontos por descarte. Ele cresce 1% por semana consecutiva, mas para em 1,25x. O teto é deliberado: sem limite, os usuários mais antigos se distanciariam de forma irrecuperável e o ranking deixaria de comunicar qualquer coisa útil a quem entrou depois. Um placar que já está decidido não motiva ninguém.",
      "O Eco Score foi desenhado sob a mesma restrição de honestidade. Ele é uma soma ponderada de cinco fatores observáveis — frequência, consistência, diversidade de materiais, desafios concluídos e quilos reciclados no período — com pesos fixos e visíveis na interface. Não há modelo estatístico, não há aprendizado de máquina e não há qualquer forma de inteligência artificial por trás dele. Chamar de índice o que é uma média ponderada seria vender sofisticação inexistente.",
      "Essa escolha tem custo. Um indicador transparente é mais fácil de manipular: quem entende os pesos sabe exatamente onde investir esforço. Consideramos o custo aceitável porque, neste caso, manipular o indicador significa reciclar mais e com mais variedade de material — o comportamento que o produto existe para incentivar. Nem todo sistema de pontuação tem essa sorte, e por isso nem todo sistema deveria ser transparente da mesma forma.",
      "O que ainda não sabemos responder é o que acontece depois do nível Guardião Verde, no topo da progressão. Um usuário que chega lá não tem mais degrau à frente, e a estrutura de recompensa perde tração. As alternativas em estudo — metas comunitárias, papel de mentoria para novos usuários, desafios sazonais sem teto — têm em comum a tentativa de deslocar a motivação do progresso individual para o resultado coletivo. Nenhuma delas foi validada ainda.",
    ],
    autor: "Tatiana Moura",
    cargoAutor: "Designer de produto sênior",
    data: "2026-06-30T14:00:00-03:00",
    tempoLeitura: 6,
  },
  {
    id: "pra-005",
    slug: "mapa-de-ecopontos-capacidade-rota-acessibilidade",
    titulo: "O mapa de ecopontos agora mostra capacidade, rota e acessibilidade",
    categoria: "Produto",
    resumo:
      "A informação que mais reduz viagem perdida não é o endereço do ponto mais próximo — é o quanto ele já está cheio.",
    conteudo: [
      "A primeira versão do mapa fazia uma coisa só: mostrava os ecopontos mais próximos e o caminho até eles. Funcionava, mas produzia um problema recorrente. Usuários chegavam a equipamentos lotados, não conseguiam descartar e voltavam com o material. Uma parcela desses descartes simplesmente não acontecia depois.",
      "A nova versão exibe a ocupação de cada ponto em quatro estados: operacional, quase cheio, lotado e em manutenção. O dado vem da leitura das balanças integradas e do registro de esvaziamento das rotas de coleta. Não é tempo real no sentido estrito — há uma defasagem de algumas horas — mas é suficiente para evitar a viagem perdida, que era o problema concreto.",
      "Junto veio a informação de acessibilidade, que estava ausente e não deveria estar. Nem todos os equipamentos da rede têm rampa, piso regular e altura de contêiner compatível com cadeira de rodas. Dos 42 pontos, 33 atendem aos critérios. Exibir isso no mapa é menos confortável do que omitir, mas omitir transferia para o usuário o custo de descobrir na porta.",
      "A busca por material também mudou de lógica. Antes, todos os pontos apareciam e o usuário descobria as restrições ao chegar. Agora o filtro parte do que a pessoa quer descartar: quem seleciona óleo de cozinha vê apenas os 16 equipamentos habilitados a recebê-lo, com o aviso de que o material precisa estar em recipiente fechado.",
      "Quando a geolocalização é negada — e ela é negada com frequência, por motivo legítimo —, o mapa abre centrado na Avenida Paulista e oferece busca por bairro. Tratar a recusa de permissão como um caminho normal, e não como erro, elimina uma tela de bloqueio que interrompia o fluxo sem necessidade.",
      "O que fica pendente é a rota multimodal. Hoje o mapa calcula distância em linha reta e por via, mas não considera que boa parte dos descartes é feita a pé, com peso, e que 800 metros carregando 8 kg de vidro é uma distância muito diferente de 800 metros de caminhada livre. Modelar esse esforço percebido é o próximo problema da fila.",
    ],
    autor: "Amanda Guerreiro",
    cargoAutor: "Pesquisadora de experiência",
    data: "2026-05-19T11:20:00-03:00",
    tempoLeitura: 5,
  },
  {
    id: "pra-006",
    slug: "politica-nacional-de-residuos-solidos-o-que-o-incentivo-mudou",
    titulo: "Política de resíduos: o que muda quando existe incentivo ao morador",
    categoria: "Política Pública",
    resumo:
      "Metas de destinação e coleta seletiva obrigatória endereçam a oferta do serviço. A separação na origem, que decide o resultado, depende de outra alavanca.",
    conteudo: [
      "A Política Nacional de Resíduos Sólidos estabeleceu obrigações claras para municípios e para o setor produtivo: planos de gestão, coleta seletiva, logística reversa para categorias específicas, encerramento de lixões. Foi um avanço regulatório relevante e mudou de forma concreta a infraestrutura disponível em milhares de cidades brasileiras.",
      "O que a regulação não consegue determinar por decreto é o gesto que acontece dentro de casa. Nenhuma meta municipal separa vidro de orgânico na pia da cozinha. Esse é um comportamento privado, repetido diariamente, e ele responde a incentivos bem mais próximos do cotidiano do que a um plano diretor de resíduos.",
      "É aí que programas de contrapartida entram — e é aí também que costumam ser mal avaliados. A pergunta que importa não é quantas pessoas se cadastraram, mas quantas continuavam separando o resíduo seis meses depois. Cadastro mede curiosidade; retenção mede se o hábito se formou. Muitos programas municipais nunca chegaram a medir a segunda coisa.",
      "Nos dados demonstrativos da rede metropolitana, a diferença entre regiões é maior do que a diferença entre faixas de renda. O Centro Expandido registra 72% de adesão entre os domicílios cadastrados, contra 41% em Guarulhos. A variável que melhor acompanha essa diferença não é renda média, e sim distância até o equipamento mais próximo e regularidade da coleta convencional.",
      "Isso sugere um desenho de política pública menos glamouroso do que campanhas de conscientização: a alavanca mais eficiente costuma ser reduzir o atrito físico do descarte correto. Um ponto de entrega a menos de 1 km, aberto em horário compatível com quem trabalha fora, faz mais pela taxa de separação do que uma campanha bem produzida sem infraestrutura por trás.",
      "O incentivo financeiro, quando existe, cumpre um papel específico e limitado: encurta o período entre a intenção e o primeiro gesto. Ele não sustenta o hábito sozinho. O que sustenta é a experiência do descarte ser previsível — o ponto estar aberto, o contêiner ter espaço, o registro aparecer no aplicativo. Constância operacional é a política pública que menos aparece em discurso e mais aparece em resultado.",
    ],
    autor: "Helena Marques",
    cargoAutor: "Diretora de operações da rede metropolitana",
    data: "2026-04-28T09:15:00-03:00",
    tempoLeitura: 6,
  },
  {
    id: "pra-007",
    slug: "deteccao-de-anomalias-por-regras-transparencia-antes-de-sofisticacao",
    titulo: "Detecção de anomalias por regras: transparência antes de sofisticação",
    categoria: "Política Pública",
    resumo:
      "Todo programa com contrapartida financeira atrai tentativas de burla. A resposta escolhida foi um conjunto de regras auditáveis, não um modelo que ninguém consegue explicar.",
    conteudo: [
      "Programas que convertem comportamento em benefício financeiro atraem, inevitavelmente, tentativas de burla. Códigos de validação lidos várias vezes, volumes declarados acima da capacidade física do contêiner, contas múltiplas no mesmo endereço, leituras registradas a quilômetros do equipamento. Ignorar isso comprometeria a legitimidade do programa inteiro perante quem participa de boa-fé.",
      "A tentação, diante desse problema, é anunciar um sistema inteligente de detecção de fraudes. Optamos pelo caminho oposto, e vale explicar por quê. O que existe na plataforma é um conjunto de regras fixas e auditáveis: limiar de leituras por janela de tempo, comparação do peso declarado com a média histórica da conta, distância entre a coordenada do aparelho e a do equipamento, repetição de identificador de dispositivo ou de comprovante de endereço entre cadastros distintos.",
      "O risk score exibido no painel é a soma ponderada das regras violadas por uma ocorrência. Nada além disso. Não há modelo estatístico treinado, não há aprendizado de máquina e não há inteligência artificial envolvida em nenhuma etapa. Quem abre uma ocorrência consegue ler exatamente quais regras dispararam e reconstruir o número à mão.",
      "Essa escolha tem consequências práticas. Regras fixas produzem mais falsos positivos do que um modelo bem calibrado — e produziram. A ocorrência de menor pontuação do painel demonstrativo, com risk score 34, era simplesmente um usuário separando corretamente cinco materiais diferentes em uma única visita. A regra de intervalo curto entre leituras disparou sobre um comportamento exemplar.",
      "Ainda assim, o falso positivo é o erro preferível quando a alternativa é bloquear um cidadão com base em um cálculo que ninguém consegue explicar. Em contexto de política pública, uma medida administrativa precisa ser justificável em linguagem comum, para o servidor que decide e para o cidadão que recebe a decisão. Um escore opaco não atende a nenhum dos dois.",
      "Por isso nenhuma ocorrência gera bloqueio automático. Toda anomalia entra em fila de conferência humana com uma recomendação operacional concreta — pedir o vídeo do totem em determinado intervalo, reter o crédito por 72 horas, recalibrar uma balança com desvio detectado. O sistema aponta onde olhar; quem decide é sempre uma pessoa, e o registro dessa decisão fica auditável.",
      "Se um modelo estatístico for adotado no futuro, a exigência será a mesma: capacidade de explicar, caso a caso, por que determinada ocorrência foi sinalizada. Sofisticação técnica que não sobrevive a essa pergunta não tem lugar em um programa público.",
    ],
    autor: "Rafael Quintela",
    cargoAutor: "Analista de integridade operacional",
    data: "2026-03-31T16:40:00-03:00",
    tempoLeitura: 7,
  },
  {
    id: "pra-008",
    slug: "ecotech-brasil-escritorio-zero-waste-esg",
    titulo: "EcoTech Brasil: o que um escritório zero waste exige de verdade",
    categoria: "Parcerias",
    resumo:
      "A empresa desviou 1.360 kg do aterro em seis meses. O relato interno mostra que a parte difícil não foi trocar os copos descartáveis.",
    conteudo: [
      "Quando a EcoTech Brasil anunciou a campanha Escritório Zero Waste para suas três unidades, a expectativa interna era de que a etapa mais complicada seria a substituição de copos e talheres descartáveis. Foi a mais rápida: quatro semanas, uma caneca institucional por colaborador e o problema estava resolvido em duas das três unidades.",
      "A parte difícil apareceu depois, na separação correta do que sobrava. Uma copa com quatro lixeiras coloridas não garante que o resíduo chegue certo em cada uma. Restos de comida em embalagem de papel contaminam o lote de papel; guardanapo usado não é reciclável apesar de parecer; cápsula de café tem plástico, alumínio e orgânico no mesmo objeto. Nenhuma dessas distinções é óbvia para quem está apressado no intervalo do almoço.",
      "A solução que funcionou foi menos sofisticada do que a equipe esperava: reduzir o número de lixeiras e colocar exemplos fotográficos do que vai em cada uma, com os itens reais consumidos naquela copa. A taxa de contaminação dos lotes caiu de forma consistente nos dois meses seguintes, e a mudança custou o preço de placas impressas.",
      "O resultado agregado é de 1.360 kg desviados do aterro contra uma meta anual de 2.000 kg, com 146 dos 182 colaboradores participando. O ritmo atual coloca a meta ao alcance antes do prazo de dezembro, mas a empresa optou por não antecipar o encerramento — a campanha vale mais como rotina estabelecida do que como número atingido.",
      "Do ponto de vista de indicadores ESG, o número que a diretoria acompanha com mais atenção não é o volume, e sim a rastreabilidade da destinação, hoje em 94%. É a métrica que sustenta qualquer afirmação pública sobre resíduo: sem comprovante de destinação final arquivado, o material desviado do aterro é uma alegação, não um dado. Os 6% pendentes correspondem a cargas antigas de cooperativas que ainda não digitalizaram o processo.",
      "O balanço interno registra também o que não funcionou. A campanha de redução de impressão, focada na filial de Porto Alegre, está pausada em 740 kg de uma meta de 1.200 kg: o arquivo morto do setor financeiro tem exigências legais de guarda que a equipe não mapeou antes de definir a meta. Nesse caso, o erro foi de planejamento, não de adesão.",
    ],
    autor: "Rodrigo Peixoto",
    cargoAutor: "Coordenador de sustentabilidade da EcoTech Brasil",
    data: "2026-08-06T13:10:00-03:00",
    tempoLeitura: 6,
  },
  {
    id: "pra-009",
    slug: "solar-coop-e-mercado-verde-ampliam-catalogo-de-recompensas",
    titulo: "Solar Coop e Mercado Verde ampliam o catálogo de recompensas",
    categoria: "Parcerias",
    resumo:
      "Crédito na conta de luz e cesta orgânica entram no catálogo. A escolha das categorias segue um critério: recompensa que reforça o próprio comportamento.",
    conteudo: [
      "O catálogo de recompensas ganhou duas famílias de itens em agosto. A Solar Coop passou a oferecer crédito direto na conta de energia, em faixas de R$ 30 e R$ 100, além de cotas semestrais de energia solar compartilhada. O Mercado Verde ampliou a oferta com cesta orgânica semanal de produtores da Grande São Paulo e assinatura mensal de hortifrúti.",
      "A seleção de parceiros segue um critério que vale explicitar, porque não é o mais óbvio comercialmente. Recompensas com maior apelo imediato — eletrônicos, vale-presente genérico, dinheiro — costumam converter melhor no curto prazo. Elas foram deliberadamente deixadas de fora do catálogo.",
      "O motivo é de coerência. Um programa que incentiva reduzir consumo material e depois entrega bens de consumo como prêmio trabalha contra o próprio objetivo. Crédito de energia, transporte público, alimento de produtor local e experiências ao ar livre reforçam a lógica que trouxe a pessoa até ali. É uma restrição que custa conversão e preserva sentido.",
      "A conversão adotada é linear e pública: cada EcoPonto equivale a aproximadamente R$ 0,02 no valor estimado da recompensa. Não há escalonamento que favoreça resgates grandes nem taxa oculta em itens de maior valor. Um passe de metrô de 1.200 pontos e uma cota de energia de 12.000 pontos seguem a mesma proporção.",
      "Para os parceiros, o modelo funciona como canal de aquisição com custo previsível. A contrapartida financeira sai da linha orçamentária de incentivos, hoje com R$ 2,94 milhões executados de R$ 4,2 milhões previstos no orçamento demonstrativo. O parceiro recebe clientes com perfil definido; o programa entrega uma recompensa que não precisa produzir.",
      "As próximas categorias em avaliação são serviços de reparo — conserto de eletrodomésticos, manutenção de bicicleta, reforma de móveis. É o encaixe mais direto com economia circular que o catálogo pode ter: estender a vida útil de um objeto evita o resíduo antes que ele exista, o que é sempre melhor do que reciclá-lo depois.",
    ],
    autor: "Eduardo Vilela",
    cargoAutor: "Gerente de parcerias",
    data: "2026-08-19T15:25:00-03:00",
    tempoLeitura: 5,
  },
];

export const PRESS_ARTICLE_BY_SLUG: Record<string, PressArticle> =
  Object.fromEntries(PRESS_ARTICLES.map((a) => [a.slug, a]));
