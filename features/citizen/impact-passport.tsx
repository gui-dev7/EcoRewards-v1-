"use client";

import * as React from "react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { DownloadSimple, ShareNetwork } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { LeafMark } from "@/components/brand/leaf-mark";
import { useWalletStore } from "@/stores";
import { useBadges } from "@/hooks/use-progress";
import { useHydrated } from "@/hooks/use-hydrated";
import { calculateEcoLevel, calculateEcoScore, impactEquivalences } from "@/lib/eco";
import { formatNumber } from "@/lib/format";
import { CITIZEN, CITIZEN_ECO_SCORE_INPUT } from "@/mocks/citizen";

/**
 * Impact Passport — o resumo compartilhável do impacto do usuário.
 * O cartão exportado é renderizado num nó de 1080x1350 posicionado fora
 * da tela, para que a imagem saia na proporção de redes sociais
 * independentemente do tamanho da janela.
 */
export function ImpactPassport() {
  const hydrated = useHydrated();
  const cartaoRef = React.useRef<HTMLDivElement>(null);
  const [gerando, setGerando] = React.useState(false);

  const saldo = useWalletStore((s) => s.ecoPontos);
  const xp = useWalletStore((s) => s.xp);
  const kg = useWalletStore((s) => s.kgReciclados);
  const co2 = useWalletStore((s) => s.co2EvitadoKg);
  const medalhas = useBadges();

  const dados = {
    saldo: hydrated ? saldo : CITIZEN.ecoPontos,
    xp: hydrated ? xp : CITIZEN.xp,
    kg: hydrated ? kg : CITIZEN.kgReciclados,
    co2: hydrated ? co2 : CITIZEN.co2EvitadoKg,
    medalhas: hydrated ? medalhas.filter((m) => m.desbloqueada).length : 0,
  };

  const nivel = calculateEcoLevel(dados.xp);
  const score = calculateEcoScore(CITIZEN_ECO_SCORE_INPUT).total;
  const equivalencias = impactEquivalences(dados.co2);
  const desde = new Date(CITIZEN.membroDesde).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const compartilhar = async () => {
    const no = cartaoRef.current;
    if (!no) return;

    setGerando(true);
    try {
      const url = await toPng(no, {
        width: 1080,
        height: 1350,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: getComputedStyle(document.documentElement)
          .getPropertyValue("--surface")
          .trim(),
      });

      const link = document.createElement("a");
      link.download = `impact-passport-${CITIZEN.nome.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = url;
      link.click();

      toast.success("Impact Passport gerado", {
        description: "A imagem 1080x1350 foi baixada e está pronta para publicar.",
      });
    } catch {
      toast.error("Não foi possível gerar a imagem", {
        description: "Tente novamente em alguns instantes.",
      });
    } finally {
      setGerando(false);
    }
  };

  return (
    <section aria-labelledby="impact-passport">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <p className="eyebrow">Compartilhável</p>
          <h2 id="impact-passport" className="mt-2 font-display text-h3 text-[var(--fg)]">
            Impact Passport
          </h2>
          <p className="mt-1.5 max-w-[54ch] text-[13px] leading-relaxed text-[var(--fg-muted)]">
            Um retrato do que você já evitou de ir para o aterro, no formato certo
            para publicar.
          </p>
        </div>
        <Button onClick={compartilhar} loading={gerando}>
          {!gerando && <ShareNetwork weight="bold" />}
          Compartilhar Impact Passport
        </Button>
      </div>

      {/* Visualização na página */}
      <div className="mt-6 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
        <div className="relative p-6 lg:p-8">
          <div aria-hidden className="grid-texture absolute inset-0 opacity-40" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
                  Impact Passport
                </p>
                <p className="mt-3 font-display text-h2 text-[var(--fg)]">
                  {CITIZEN.nome}
                </p>
                <p className="mt-1 text-[13px] text-[var(--fg-muted)]">
                  {CITIZEN.cidade}, {CITIZEN.estado} · reciclando desde {desde}
                </p>
              </div>
              <LeafMark className="size-9 shrink-0 text-[var(--accent)]" />
            </div>

            <dl className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
              {[
                { rotulo: "Material reciclado", valor: `${formatNumber(dados.kg, 1)} kg` },
                { rotulo: "CO2 evitado", valor: `${formatNumber(dados.co2)} kg` },
                { rotulo: "EcoPontos", valor: formatNumber(dados.saldo) },
                { rotulo: "Medalhas", valor: String(dados.medalhas) },
              ].map((item) => (
                <div key={item.rotulo} className="bg-[var(--surface)] px-5 py-4">
                  <dt className="text-[11.5px] text-[var(--fg-muted)]">
                    {item.rotulo}
                  </dt>
                  <dd className="mt-1.5 font-display text-[24px] font-semibold tabular tracking-[-0.03em] text-[var(--fg)]">
                    {item.valor}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
              <div>
                <p className="text-[11.5px] text-[var(--fg-muted)]">Nível atual</p>
                <p className="mt-1 font-display text-[17px] font-semibold text-[var(--accent)]">
                  {nivel.atual.nome}
                </p>
              </div>
              <div>
                <p className="text-[11.5px] text-[var(--fg-muted)]">Eco Score</p>
                <p className="mt-1 font-display text-[17px] font-semibold tabular text-[var(--accent)]">
                  {score}
                  <span className="text-[12px] font-medium text-[var(--fg-muted)]">
                    /100
                  </span>
                </p>
              </div>
              <div>
                <p className="text-[11.5px] text-[var(--fg-muted)]">Sequência</p>
                <p className="mt-1 font-display text-[17px] font-semibold tabular text-[var(--accent)]">
                  {CITIZEN.streakSemanas} semanas
                </p>
              </div>
            </div>

            {/* Equivalências: o que 641 kg de CO2 significam de fato */}
            <div className="mt-8 border-t border-[var(--border)] pt-5">
              <p className="eyebrow mb-3">O que isso equivale</p>
              <ul className="grid gap-4 sm:grid-cols-3">
                {equivalencias.map((item) => (
                  <li key={item.id}>
                    <p className="font-display text-[20px] font-semibold tabular tracking-[-0.02em] text-[var(--fg)]">
                      {formatNumber(item.valor)}
                      <span className="ml-1 text-[13px] font-medium text-[var(--fg-muted)]">
                        {item.unidade}
                      </span>
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-[var(--fg-muted)]">
                      {item.descricao}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-[var(--fg-subtle)]">
        <DownloadSimple className="size-3.5" />
        A imagem é gerada no seu navegador, em 1080x1350, e não é enviada a
        nenhum servidor.
      </p>

      {/* Nó exportado — fora da tela, em proporção de rede social */}
      <div className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden>
        <PassportCard
          ref={cartaoRef}
          dados={dados}
          nivel={nivel.atual.nome}
          score={score}
          desde={desde}
          equivalencias={equivalencias}
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cartão exportado                                                    */
/* ------------------------------------------------------------------ */

interface PassportCardProps {
  dados: { saldo: number; kg: number; co2: number; medalhas: number };
  nivel: string;
  score: number;
  desde: string;
  equivalencias: { id: string; valor: number; unidade: string; descricao: string }[];
}

const PassportCard = React.forwardRef<HTMLDivElement, PassportCardProps>(
  function PassportCard({ dados, nivel, score, desde, equivalencias }, ref) {
    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1350,
          background: "var(--surface)",
          color: "var(--fg)",
          padding: 96,
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-geist), sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p
              style={{
                fontSize: 22,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--fg-subtle)",
                fontWeight: 600,
              }}
            >
              Impact Passport
            </p>
            <p
              style={{
                marginTop: 28,
                fontSize: 76,
                fontWeight: 600,
                letterSpacing: "-0.035em",
                fontFamily: "var(--font-sora), sans-serif",
              }}
            >
              {CITIZEN.nome}
            </p>
            <p style={{ marginTop: 14, fontSize: 28, color: "var(--fg-muted)" }}>
              {CITIZEN.cidade}, {CITIZEN.estado} · desde {desde}
            </p>
          </div>
          <LeafMark style={{ width: 88, height: 88, color: "var(--accent)" }} />
        </div>

        <div
          style={{
            marginTop: 88,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {[
            { rotulo: "Material reciclado", valor: `${formatNumber(dados.kg, 1)} kg` },
            { rotulo: "CO2 evitado", valor: `${formatNumber(dados.co2)} kg` },
            { rotulo: "EcoPontos acumulados", valor: formatNumber(dados.saldo) },
            { rotulo: "Medalhas conquistadas", valor: String(dados.medalhas) },
          ].map((item) => (
            <div key={item.rotulo} style={{ background: "var(--surface)", padding: "36px 40px" }}>
              <p style={{ fontSize: 24, color: "var(--fg-muted)" }}>{item.rotulo}</p>
              <p
                style={{
                  marginTop: 14,
                  fontSize: 62,
                  fontWeight: 600,
                  letterSpacing: "-0.035em",
                  fontFamily: "var(--font-sora), sans-serif",
                }}
              >
                {item.valor}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 56, display: "flex", gap: 72 }}>
          <div>
            <p style={{ fontSize: 24, color: "var(--fg-muted)" }}>Nível</p>
            <p
              style={{
                marginTop: 10,
                fontSize: 40,
                fontWeight: 600,
                color: "var(--accent)",
                fontFamily: "var(--font-sora), sans-serif",
              }}
            >
              {nivel}
            </p>
          </div>
          <div>
            <p style={{ fontSize: 24, color: "var(--fg-muted)" }}>Eco Score</p>
            <p
              style={{
                marginTop: 10,
                fontSize: 40,
                fontWeight: 600,
                color: "var(--accent)",
                fontFamily: "var(--font-sora), sans-serif",
              }}
            >
              {score}/100
            </p>
          </div>
          <div>
            <p style={{ fontSize: 24, color: "var(--fg-muted)" }}>Sequência</p>
            <p
              style={{
                marginTop: 10,
                fontSize: 40,
                fontWeight: 600,
                color: "var(--accent)",
                fontFamily: "var(--font-sora), sans-serif",
              }}
            >
              {CITIZEN.streakSemanas} semanas
            </p>
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            paddingTop: 56,
            borderTop: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: 22,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--fg-subtle)",
              fontWeight: 600,
            }}
          >
            O que isso equivale
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 56 }}>
            {equivalencias.map((item) => (
              <div key={item.id} style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 46,
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    fontFamily: "var(--font-sora), sans-serif",
                  }}
                >
                  {formatNumber(item.valor)}{" "}
                  <span style={{ fontSize: 26, color: "var(--fg-muted)" }}>
                    {item.unidade}
                  </span>
                </p>
                <p style={{ marginTop: 8, fontSize: 22, color: "var(--fg-muted)", lineHeight: 1.4 }}>
                  {item.descricao}
                </p>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 56, fontSize: 22, color: "var(--fg-subtle)" }}>
            ecorewards.app · dados demonstrativos
          </p>
        </div>
      </div>
    );
  },
);
