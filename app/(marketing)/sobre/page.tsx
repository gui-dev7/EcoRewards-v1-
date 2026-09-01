import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { LeafMark } from "@/components/brand/leaf-mark";
import { Timeline } from "@/features/content/timeline";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "Do problema dos resíduos sólidos no Brasil à plataforma que transforma reciclagem em recompensa e indicador público.",
};

const CAPITULOS = [
  {
    numero: "01",
    titulo: "O problema",
    paragrafos: [
      "O Brasil gera cerca de 82 milhões de toneladas de resíduos sólidos urbanos por ano. Pouco mais de 4% do que seria reciclável efetivamente retorna à cadeia produtiva. O restante segue para aterros — quando há aterro — ou para lixões a céu aberto que ainda operam em centenas de municípios.",
      "O gargalo raramente é a falta de tecnologia de reciclagem. É comportamental e logístico. A pessoa que separa o material em casa não vê retorno algum pelo esforço; o município que investe em coleta seletiva não consegue medir o resultado com precisão; a empresa que quer cumprir a logística reversa prevista na Política Nacional de Resíduos Sólidos não tem como comprovar o volume desviado do aterro.",
      "São três atores olhando para o mesmo problema, cada um com uma parte da informação, e nenhum deles com o quadro completo.",
    ],
  },
  {
    numero: "02",
    titulo: "A ideia",
    paragrafos: [
      "O EcoRewards parte de uma premissa simples: a mesma ação — um descarte correto, validado no ponto de coleta — pode gerar valor para os três ao mesmo tempo, desde que seja registrada uma única vez e lida de três formas diferentes.",
      "Para quem recicla, o descarte vira EcoPontos e recompensa concreta: passe de transporte, crédito em mercado, ingresso, desconto na conta de energia. Para a empresa, vira indicador de adesão do time e tonelada comprovadamente desviada do aterro. Para o poder público, vira dado territorial: quanto cada região recicla, quanto custa operar cada ecoponto e quanto o município economiza em destinação final.",
      "A gamificação não é enfeite. Ela existe porque o comportamento sustentável falha justamente na constância — e não no primeiro impulso. Níveis, sequência semanal e desafios atacam esse ponto específico.",
    ],
  },
  {
    numero: "03",
    titulo: "A tecnologia",
    paragrafos: [
      "Cada ecoponto tem um código próprio. A leitura identifica o local, o material declarado é conferido e o peso é registrado na balança do equipamento. Só depois disso a pontuação é creditada. Sem validação não há ponto — é o que impede que o mesmo descarte seja contado duas vezes ou que um volume inexistente entre na conta de alguém.",
      "Os fatores de conversão são públicos e por material: um quilo de alumínio vale mais que um quilo de vidro porque evita mais emissão na cadeia produtiva. O mesmo fator que credita o ponto do cidadão alimenta o cálculo de CO2 evitado no relatório da empresa e no painel do município. Um número só, três leituras.",
      "A detecção de anomalias que roda sobre esses registros é baseada em regras determinísticas — limites de frequência, divergência entre peso declarado e peso aferido, distância improvável entre duas leituras da mesma conta. Não é inteligência artificial, e a plataforma não se apresenta como tal.",
    ],
  },
  {
    numero: "04",
    titulo: "O impacto",
    paragrafos: [
      "Economia circular só funciona quando o material volta para a cadeia produtiva com custo competitivo. Isso depende de volume constante, material limpo e separação na origem — exatamente o que um programa de incentivo bem calibrado produz.",
      "O efeito secundário é o mais interessante. Quando o dado existe e é auditável, a discussão sobre política pública de resíduos deixa de ser sobre intenção e passa a ser sobre custo por tonelada, adesão por região e retorno por real investido. É uma mudança de conversa.",
      "É esse produto que esta demonstração apresenta: os três ambientes, os fluxos completos e os dados coerentes entre si — sem banco de dados, sem cadastro e sem serviço externo.",
    ],
  },
];

export default function SobrePage() {
  return (
    <>
      {/* Abertura */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1360px] px-4 py-20 lg:px-6 lg:py-28">
          <div className="max-w-3xl">
            <p className="eyebrow">Sobre o EcoRewards</p>
            <h1 className="mt-5 text-balance font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--fg)]">
              Reciclar precisa valer a pena para quem recicla — e ser mensurável
              para quem administra.
            </h1>
            <p className="mt-7 max-w-[62ch] text-[17px] leading-relaxed text-[var(--fg-muted)]">
              O EcoRewards nasceu da constatação de que cidadão, empresa e poder
              público olham para o mesmo problema com pedaços diferentes da
              informação. A plataforma junta esses pedaços em um registro único.
            </p>
          </div>
        </div>
      </section>

      {/* Capítulos */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1360px] px-4 lg:px-6">
          {CAPITULOS.map((capitulo, indice) => (
            <article
              key={capitulo.numero}
              className={`grid gap-8 py-16 lg:grid-cols-[220px_1fr] lg:gap-16 lg:py-20 ${
                indice > 0 ? "border-t border-[var(--border)]" : ""
              }`}
            >
              <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
                <span className="font-mono text-[12px] font-medium tracking-[0.14em] text-[var(--accent)]">
                  {capitulo.numero}
                </span>
                <h2 className="mt-3 font-display text-h2 text-[var(--fg)]">
                  {capitulo.titulo}
                </h2>
              </div>

              <div className="max-w-[68ch] space-y-5">
                {capitulo.paragrafos.map((paragrafo, posicao) => (
                  <p
                    key={posicao}
                    className="text-[16px] leading-[1.75] text-[var(--fg-muted)]"
                  >
                    {paragrafo}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <Timeline />

      {/* Fechamento */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="grid-texture pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)]"
        />
        <div className="relative mx-auto max-w-[1360px] px-4 py-24 text-center lg:px-6">
          <LeafMark className="mx-auto size-10 text-[var(--accent)]" />
          <h2 className="mx-auto mt-8 max-w-[20ch] text-balance font-display text-h1 text-[var(--fg)]">
            Veja o produto funcionando de ponta a ponta.
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/demo">
                Explorar demonstração
                <ArrowRight weight="bold" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/carreiras">Trabalhar conosco</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
