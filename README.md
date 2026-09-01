# EcoRewards

[![Produção](https://img.shields.io/badge/produção-online-0E9F6E)](https://ecorewards-platform.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000)](https://nextjs.org/)
[![Repositório](https://img.shields.io/badge/GitHub-EcoRewards--v1--181717)](https://github.com/gui-dev7/EcoRewards-v1-)

**Produção:** [ecorewards-platform.vercel.app](https://ecorewards-platform.vercel.app)

**Transforme impacto em recompensa.** Plataforma que converte reciclagem validada em
EcoPontos, recompensas reais e indicadores auditáveis — para cidadãos, empresas e
governos, sobre o mesmo registro.

> **Projeto demonstrativo.** Não há banco de dados, back-end, autenticação real nem
> integração de persistência. Toda a experiência roda no navegador, sobre uma camada
> de dados mockados determinísticos.

---

## Conceito

O ciclo do produto é único e atende três leituras:

```
RECICLAGEM → VALIDAÇÃO → ECOPONTOS → RECOMPENSAS → IMPACTO
```

Cada ecoponto tem um código próprio. A leitura identifica o local, confere o
material declarado e registra o peso. Só depois disso a pontuação é creditada —
é o que impede que o mesmo descarte seja contado duas vezes.

Os fatores de conversão são por material e ficam abertos: um quilo de alumínio
vale mais EcoPontos que um quilo de vidro porque evita mais emissão. O mesmo
fator que credita o ponto do cidadão alimenta o CO2 evitado no relatório da
empresa e no painel do município.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) · React 19 |
| Linguagem | TypeScript (estrito, sem `any`) |
| Estilo | Tailwind CSS 4 com design system em tokens CSS |
| Componentes | Radix UI + variantes próprias (padrão shadcn/ui) |
| Ícones | Phosphor Icons |
| Animação | GSAP + ScrollTrigger (hero e scrollytelling) · Motion (layout, tabs, transições) |
| Gráficos | Recharts, sobre um kit próprio com paleta validada |
| Mapas | MapLibre GL JS (sem chave de API) |
| Formulários | React Hook Form + Zod |
| Estado | Zustand com persistência local |
| Notificações | Sonner |
| Exportação | html-to-image + jsPDF (PDF gerado no cliente) |

---

## Como executar

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # produção
npm run lint                 # ESLint (inclui as regras do React Compiler)
npx tsc --noEmit             # verificação de tipos
```

Requer Node 20 ou superior. Nenhuma variável de ambiente é necessária.

---

## Contas demo

Senha única: **`EcoDemo@2026`**

| Ambiente | E-mail | Perfil |
|---|---|---|
| Cidadão | `cidadao.demo@ecorewards.app` | João Silva · 4.250 EcoPontos · nível Árvore |
| Empresa | `empresa.demo@ecorewards.app` | EcoTech Brasil · 182 colaboradores · 3 unidades |
| Governo | `governo.demo@ecorewards.app` | Secretaria de Meio Ambiente — Demo · 8 municípios |

Há três caminhos de acesso:

1. **`/demo`** — cartões dos três ambientes, entrada em um clique.
2. **`/login` → Explorar demonstração** — botões que autenticam e redirecionam direto.
3. **`/login` → Preencher credenciais** — preenche o formulário e valida localmente.

Dentro da aplicação, o **seletor de ambiente** no rodapé da barra lateral alterna
entre cidadão, empresa e governo sem sair da sessão. O mesmo menu traz
**Restaurar dados demo**, que devolve saldo, resgates, desafios, notificações e
campanhas ao estado inicial.

---

## Experiência B2C — Cidadão

Rotas em `/app`.

- **Visão geral** — saldo, EcoLevel, XP, Eco Score, sequência semanal, ranking, impacto e atividade recente.
- **EcoLevel** — progressão em seis estágios: Semente, Broto, Folha, Árvore, Floresta, Guardião Verde.
- **Eco Score** — nota de 0 a 100 com modal explicando cada fator. É um indicador interno demonstrativo, calculado por soma ponderada de pesos fixos e visíveis.
- **Sequência sustentável** — 52 semanas em grade de contribuição, com multiplicador de pontuação.
- **Scanner** — leitura simulada encadeando as quatro etapas de validação (identificar ecoponto → validar material → calcular impacto → creditar pontos), com contagem animada dos EcoPontos e atualização do saldo.
- **Carteira** — extrato com origem, data, status e agrupamento por mês; filtros por tipo e período.
- **Recompensas** — 28 itens em 7 categorias, com busca, filtros, favoritos, detalhe e resgate real: verifica saldo, pede confirmação, desconta, gera voucher com código (`ECO-7X4P-92AB`) e registra no histórico.
- **Desafios** — diários, semanais, mensais e comunitários, com progresso e crédito ao concluir.
- **Conquistas** — 18 medalhas em quatro raridades, com animação própria de desbloqueio.
- **Ranking** — global, cidade, semanal e mensal; a posição do usuário aparece destacada mesmo fora do Top 10.
- **Ecopontos** — mapa MapLibre com clustering, filtros por material e status, distância calculada, painel lateral e rota externa.
- **Perfil** — cinco abas e o **Impact Passport**, exportável como imagem 1080×1350 gerada no navegador.

No mobile, a barra lateral vira gaveta e há navegação inferior com o scanner como
ação central destacada.

---

## Experiência B2B — Empresa

Rotas em `/empresa`.

- **Visão geral** — KPIs, ritmo em relação à meta anual, adesão por departamento, composição por material e comunicados.
- **Analytics** — filtros combináveis de período, unidade, departamento e campanha que recalculam todos os gráficos; busca global em departamentos, colaboradores e campanhas.
- **Colaboradores** — ranking em três recortes (pessoas, equipes, departamentos), com tabela ordenável e filtros.
- **Campanhas** — CRUD completo local: criar, editar, pausar, encerrar e excluir, com formulário validado.
- **ESG** — indicadores nos três pilares, progresso da meta anual e projeção linear pelo ritmo atual (rotulada como extrapolação, não previsão).
- **Relatórios** — construtor de relatório ESG com seleção de período, métricas e gráficos, e exportação em PDF gerada no cliente.

---

## Experiência B2G — Governo

Rotas em `/governo`.

- **Painel executivo** — volume, aterro evitado, CO2, usuários, orçamento e alertas, além do **EcoRewards Live**, um feed de atividades em intervalo fixo.
- **Mapa** — cinco camadas operacionais alternáveis sobre heatmaps de volume reciclado, adesão populacional e risco operacional, com legenda sempre visível.
- **Regiões** — comparação entre as oito regiões por seis métricas (per capita, crescimento, adesão, custo por tonelada, economia, retorno operacional).
- **Ecopontos** — gestão da rede de 42 equipamentos, com filtros e detalhe operacional.
- **Risk & Fraud Center** — eventos com Risk Score de 0 a 100, drawer com as regras acionadas, contexto e recomendação.
- **Orçamento** — previsto contra executado por linha, com economia gerada.
- **Relatórios** — três tipos de documento com exportação em PDF.

> **Sobre a detecção de anomalias.** O Risk Score vem de regras determinísticas
> explícitas — limites de frequência, divergência entre peso declarado e aferido,
> distância improvável entre leituras — aplicadas a dados fictícios. Não há modelo
> de aprendizado de máquina nem inteligência artificial envolvidos, e a interface
> diz isso em todos os pontos onde o número aparece.

---

## Arquitetura

```
app/
  (marketing)/        home, sobre, impacto, ecopontos, recompensas,
                      imprensa/[slug], carreiras/[slug], contato, demo
  (auth)/             login, cadastro, recuperar-senha
  (app)/              app/*, empresa/*, governo/*, configuracoes
  globals.css         design system completo em tokens
components/
  ui/                 primitivos sobre Radix (botão, diálogo, campos, tabelas…)
  brand/              a folha EcoRewards em SVG autoral
  layout/             casca da aplicação, sidebar, navbar, command palette
  charts/             kit de gráficos com paleta validada
  maps/               MapLibre: base, ecopontos, mapa governamental
  pwa/                convite de instalação e registro do service worker
features/             home, auth, citizen, company, government, content
mocks/                camada de dados demonstrativos
stores/               Zustand: auth, wallet, progress, notifications, campaigns
hooks/                hidratação, viewport, contagem, geolocalização, motion
lib/                  formatação, regras de negócio, armazenamento, PDF
types/                domínio completo
legacy/               projeto original em HTML/CSS/JS, preservado como referência
```

### Regras de negócio

Ficam em `lib/eco.ts`, nunca dentro do JSX:

`calculateEcoPoints()` · `calculateEcoLevel()` · `calculateEcoScore()` ·
`estimateCarbonAvoided()` · `calculateChallengeProgress()` · `impactEquivalences()`

A formatação (`formatEcoPoints`, `formatCurrency`, `formatWeight`, `formatRelative`…)
está em `lib/format.ts`, toda em pt-BR.

### Dados

Todos os datasets são determinísticos e coerentes entre si. Nada muda entre
recarregamentos. Se a EcoTech Brasil tem 182 colaboradores, a soma dos
departamentos dá exatamente 182; se a rede tem 42 ecopontos, a soma por região
também dá 42.

### Persistência

Apenas `localStorage`, através de `lib/storage.ts` e do adaptador em
`stores/persist-adapter.ts` — nenhum componente acessa o armazenamento
diretamente. Em modo privado ou com cookies bloqueados a aplicação continua
funcionando, sem persistir.

---

## Design system

Identidade climate tech sóbria e editorial: superfícies de papel no tema claro,
superfícies de carbono no escuro, hierarquia construída com espaço negativo,
tipografia e fios de 1px em vez de sombras e cartões empilhados.

- **Tipografia** — Sora nos títulos, Geist na interface, Geist Mono nos números, via `next/font`.
- **Acento por ambiente** — cidadão `#0E9F6E`, empresa `#0D8F85`, governo `#24479E`, trocados por `data-env`. A estrutura não muda entre ambientes, de propósito.
- **Dark mode** — paleta própria, não uma inversão: superfícies, bordas, gráficos, mapas e estados foram escolhidos para o fundo escuro. A preferência fica salva localmente.
- **Paleta de gráficos** — seis cores categóricas validadas nos dois modos quanto a faixa de luminosidade, piso de croma, separação para daltonismo (protanopia, deuteranopia, tritanopia) e contraste com a superfície. A ordem é fixa: um filtro que reduz o número de séries nunca repinta as sobreviventes. Rampa sequencial de matiz única para magnitude, par divergente com cinza neutro para polaridade, e cores de status reservadas que nunca viram série de dados.
- **Gráficos** — nenhum eixo Y duplo em lugar algum. Onde há medidas de escalas diferentes, elas são indexadas a uma base comum ou separadas em gráficos distintos. Todo gráfico tem alternância para tabela.

---

## Acessibilidade e performance

- WCAG 2.2 AA: navegação por teclado, `focus-visible`, rótulos, `aria`, diálogos com título e hierarquia de headings correta.
- Nenhuma informação depende só de cor — status sempre acompanha ícone e rótulo.
- `prefers-reduced-motion` respeitado em toda animação decorativa, inclusive nas linhas do tempo do GSAP (via `gsap.matchMedia()`) e na rotação do feed ao vivo.
- Todos os estados de UI previstos: carregamento com esqueletos que imitam o layout final, vazio com microcopy útil e erro.
- Server Components por padrão; MapLibre e GSAP carregados apenas onde são usados, via `next/dynamic`.
- PWA: manifesto, ícones gerados em tempo de build, atalhos, service worker com app shell e página offline própria.

---

## Roadmap

- [ ] Internacionalização (a estrutura de textos já está centralizada em pt-BR)
- [ ] Leitura real de QR pela câmera, com fallback para o fluxo simulado
- [ ] Camadas geográficas por polígono no mapa governamental
- [ ] Comparação entre períodos nos relatórios corporativos
- [ ] Testes end-to-end dos fluxos de resgate e validação

---

## Migração

A versão anterior — HTML, CSS e JavaScript estáticos, com gráficos desenhados em
CSS e mapa ilustrativo — está preservada em `legacy/`, junto do esquema SQL
original. Todo o universo do produto foi mantido: os três ambientes, as páginas
institucionais e o conceito de gamificação. O que mudou foi a base: dados
coerentes no lugar de números soltos, gráficos reais no lugar de barras em CSS,
mapa de verdade no lugar de uma imagem, e uma camada de estado que faz cada botão
da demonstração realmente funcionar.
