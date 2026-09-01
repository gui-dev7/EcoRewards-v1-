"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowClockwise,
  ArrowRight,
  Check,
  CheckCircle,
  MapPin,
  QrCode,
  Scan,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWalletStore } from "@/stores";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCountUp } from "@/hooks/use-count-up";
import { calculateEcoPoints, estimateCarbonAvoided } from "@/lib/eco";
import { formatNumber } from "@/lib/format";
import { COLLECTION_POINTS } from "@/mocks/collection-points";
import { MATERIAL_BY_ID } from "@/mocks/materials";
import { CITIZEN } from "@/mocks/citizen";
import { cn } from "@/lib/utils";
import type { CollectionPoint, MaterialId } from "@/types";

/* ------------------------------------------------------------------ */
/* Máquina de estados da leitura                                       */
/* ------------------------------------------------------------------ */

const ETAPAS = [
  { id: "ecoponto", rotulo: "Identificando ecoponto", duracao: 1100 },
  { id: "material", rotulo: "Validando material", duracao: 1200 },
  { id: "impacto", rotulo: "Calculando impacto", duracao: 1000 },
  { id: "credito", rotulo: "Creditando EcoPontos", duracao: 900 },
] as const;

type Fase = "ocioso" | "lendo" | "validando" | "concluido";

interface Leitura {
  codigo: string;
  ecoponto: CollectionPoint;
  materialId: MaterialId;
  pesoKg: number;
  pontos: number;
  co2Kg: number;
}

/** Sorteia uma leitura plausível a partir do que o ecoponto de fato aceita. */
function gerarLeitura(): Leitura {
  const disponiveis = COLLECTION_POINTS.filter(
    (ponto) => ponto.status !== "manutencao" && ponto.materiais.length > 0,
  );
  const ecoponto = disponiveis[Math.floor(Math.random() * disponiveis.length)];
  const materialId =
    ecoponto.materiais[Math.floor(Math.random() * ecoponto.materiais.length)];

  // Peso entre 1,2 kg e 8,4 kg, com uma casa decimal.
  const pesoKg = Number((1.2 + Math.random() * 7.2).toFixed(1));

  return {
    codigo: `ECO-QR-${ecoponto.id.replace("eco-", "")}-${Math.floor(1000 + Math.random() * 8999)}`,
    ecoponto,
    materialId,
    pesoKg,
    pontos: calculateEcoPoints(materialId, pesoKg, CITIZEN.streakSemanas),
    co2Kg: estimateCarbonAvoided(materialId, pesoKg),
  };
}

export function Scanner() {
  const reduzido = useReducedMotion();
  const registrarDescarte = useWalletStore((s) => s.registrarDescarte);

  const [fase, setFase] = React.useState<Fase>("ocioso");
  const [etapa, setEtapa] = React.useState(-1);
  const [leitura, setLeitura] = React.useState<Leitura | null>(null);
  const timers = React.useRef<number[]>([]);

  React.useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const iniciar = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];

    const nova = gerarLeitura();
    setLeitura(nova);
    setFase("lendo");
    setEtapa(-1);

    // 1. O scanner varre e encontra o código.
    timers.current.push(
      window.setTimeout(() => {
        setFase("validando");
        setEtapa(0);
      }, reduzido ? 200 : 1400),
    );

    // 2. As etapas de validação avançam em sequência.
    let acumulado = reduzido ? 200 : 1400;
    ETAPAS.forEach((etapaAtual, indice) => {
      acumulado += reduzido ? 120 : etapaAtual.duracao;
      timers.current.push(
        window.setTimeout(() => {
          if (indice === ETAPAS.length - 1) {
            registrarDescarte(nova.materialId, nova.pesoKg, nova.ecoponto.nome);
            setEtapa(ETAPAS.length);
            setFase("concluido");
          } else {
            setEtapa(indice + 1);
          }
        }, acumulado),
      );
    });
  };

  const reiniciar = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setFase("ocioso");
    setEtapa(-1);
    setLeitura(null);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
      <ScannerViewport
        fase={fase}
        leitura={leitura}
        onIniciar={iniciar}
        onReiniciar={reiniciar}
        reduzido={reduzido}
      />

      <div className="min-w-0">
        <AnimatePresence mode="wait">
          {fase === "concluido" && leitura ? (
            <motion.div
              key="sucesso"
              initial={reduzido ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <SuccessPanel leitura={leitura} onReiniciar={reiniciar} reduzido={reduzido} />
            </motion.div>
          ) : (
            <motion.div
              key="progresso"
              initial={reduzido ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduzido ? undefined : { opacity: 0 }}
            >
              <ValidationSteps fase={fase} etapa={etapa} leitura={leitura} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Visor                                                               */
/* ------------------------------------------------------------------ */

function ScannerViewport({
  fase,
  leitura,
  onIniciar,
  onReiniciar,
  reduzido,
}: {
  fase: Fase;
  leitura: Leitura | null;
  onIniciar: () => void;
  onReiniciar: () => void;
  reduzido: boolean;
}) {
  const varrendo = fase === "lendo";
  const encontrado = fase === "validando" || fase === "concluido";

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)]">
        <div aria-hidden className="dot-texture absolute inset-0 opacity-40" />

        {/* Moldura de mira */}
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="relative aspect-square w-full max-w-[280px]">
            {[
              "left-0 top-0 border-l-2 border-t-2 rounded-tl-[var(--radius-md)]",
              "right-0 top-0 border-r-2 border-t-2 rounded-tr-[var(--radius-md)]",
              "left-0 bottom-0 border-l-2 border-b-2 rounded-bl-[var(--radius-md)]",
              "right-0 bottom-0 border-r-2 border-b-2 rounded-br-[var(--radius-md)]",
            ].map((posicao) => (
              <span
                key={posicao}
                aria-hidden
                className={cn(
                  "absolute size-10 transition-colors duration-300",
                  posicao,
                  encontrado ? "border-[var(--good)]" : "border-[var(--accent)]",
                )}
              />
            ))}

            {/* Código QR estilizado */}
            <div
              className={cn(
                "absolute inset-10 grid grid-cols-6 gap-1.5 transition-opacity duration-500",
                fase === "ocioso" ? "opacity-25" : "opacity-100",
              )}
              aria-hidden
            >
              {Array.from({ length: 36 }).map((_, indice) => (
                <span
                  key={indice}
                  className={cn(
                    "rounded-[2px] transition-colors duration-300",
                    [0, 1, 2, 6, 8, 12, 13, 14, 3, 5, 9, 11, 17, 20, 22, 26, 28, 30, 33, 35].includes(
                      indice,
                    )
                      ? encontrado
                        ? "bg-[var(--good)]"
                        : "bg-[var(--fg)]"
                      : "bg-transparent",
                  )}
                />
              ))}
            </div>

            {/* Linha de varredura */}
            {varrendo && !reduzido && (
              <motion.span
                aria-hidden
                initial={{ top: "0%" }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
                className="absolute inset-x-0 h-[2px] bg-[var(--accent)] shadow-[0_0_12px_var(--accent-glow)]"
              />
            )}
          </div>
        </div>

        {/* Selo de código encontrado */}
        <AnimatePresence>
          {encontrado && leitura && (
            <motion.div
              initial={reduzido ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-5 bottom-5 flex items-center gap-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5"
            >
              <CheckCircle className="size-4 shrink-0 text-[var(--good)]" weight="fill" />
              <div className="min-w-0">
                <p className="truncate font-mono text-[12px] text-[var(--fg)]">
                  {leitura.codigo}
                </p>
                <p className="truncate text-[11px] text-[var(--fg-subtle)]">
                  Código lido com sucesso
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        {fase === "ocioso" ? (
          <Button size="lg" onClick={onIniciar} className="flex-1 sm:flex-none">
            <Scan weight="bold" />
            Simular leitura
          </Button>
        ) : (
          <Button
            size="lg"
            variant="secondary"
            onClick={onReiniciar}
            className="flex-1 sm:flex-none"
          >
            <ArrowClockwise weight="bold" />
            Nova leitura
          </Button>
        )}
        <Button asChild variant="ghost" size="lg">
          <Link href="/app/ecopontos">
            <MapPin weight="bold" />
            Encontrar um ecoponto
          </Link>
        </Button>
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-[var(--fg-subtle)]">
        Nesta demonstração a leitura é simulada: o ecoponto, o material e o peso
        são sorteados entre os dados reais da rede, e a pontuação usa exatamente
        a mesma regra do aplicativo.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Etapas de validação                                                 */
/* ------------------------------------------------------------------ */

function ValidationSteps({
  fase,
  etapa,
  leitura,
}: {
  fase: Fase;
  etapa: number;
  leitura: Leitura | null;
}) {
  const material = leitura ? MATERIAL_BY_ID[leitura.materialId] : null;

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-6">
      <p className="eyebrow">Validação</p>
      <h2 className="mt-2 font-display text-h3 text-[var(--fg)]">
        {fase === "ocioso"
          ? "Aponte para o QR do ecoponto"
          : fase === "lendo"
            ? "Procurando um código…"
            : "Validando seu descarte"}
      </h2>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
        {fase === "ocioso"
          ? "Cada ecoponto tem um código próprio. A leitura identifica o local, confere o material declarado e registra o peso antes de creditar qualquer ponto."
          : "Sem validação não há pontuação — é o que impede que o mesmo descarte seja contado duas vezes."}
      </p>

      <ol className="mt-7 space-y-1">
        {ETAPAS.map((item, indice) => {
          const concluida = etapa > indice;
          const ativa = etapa === indice;
          const pendente = etapa < indice;

          return (
            <li
              key={item.id}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 transition-colors",
                ativa && "bg-[var(--accent-soft)]",
              )}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular transition-colors",
                  concluida
                    ? "border-[var(--good)] bg-[var(--good)] text-white"
                    : ativa
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-[var(--border-strong)] text-[var(--fg-subtle)]",
                )}
              >
                {concluida ? <Check className="size-3.5" weight="bold" /> : indice + 1}
              </span>

              <span
                className={cn(
                  "flex-1 text-[13.5px] transition-colors",
                  pendente
                    ? "text-[var(--fg-subtle)]"
                    : ativa
                      ? "font-medium text-[var(--fg)]"
                      : "text-[var(--fg-muted)]",
                )}
              >
                {item.rotulo}
              </span>

              {ativa && (
                <span className="flex gap-1" aria-hidden>
                  {[0, 1, 2].map((ponto) => (
                    <span
                      key={ponto}
                      className="size-1 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-[var(--accent)]"
                      style={{ animationDelay: `${ponto * 160}ms` }}
                    />
                  ))}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {/* Dados revelados progressivamente */}
      {leitura && etapa >= 0 && (
        <dl className="mt-7 space-y-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
          <LinhaDado
            rotulo="Ecoponto"
            valor={leitura.ecoponto.nome}
            nota={`${leitura.ecoponto.bairro}, ${leitura.ecoponto.cidade}`}
            visivel={etapa >= 1}
          />
          <LinhaDado
            rotulo="Material"
            valor={material?.nome ?? "—"}
            nota={`${material?.pontosPorKg ?? 0} EcoPontos por quilo`}
            visivel={etapa >= 2}
          />
          <LinhaDado
            rotulo="Peso registrado"
            valor={`${formatNumber(leitura.pesoKg, 1)} kg`}
            nota="Aferido na balança do ecoponto"
            visivel={etapa >= 2}
          />
          <LinhaDado
            rotulo="CO2 evitado"
            valor={`${formatNumber(leitura.co2Kg, 1)} kg`}
            nota="Pelo fator do material"
            visivel={etapa >= 3}
          />
        </dl>
      )}
    </div>
  );
}

function LinhaDado({
  rotulo,
  valor,
  nota,
  visivel,
}: {
  rotulo: string;
  valor: string;
  nota: string;
  visivel: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 bg-[var(--surface)] px-4 py-3">
      <div className="min-w-0">
        <dt className="text-[12.5px] font-medium text-[var(--fg-muted)]">{rotulo}</dt>
        {visivel && (
          <p className="mt-0.5 text-[11.5px] text-[var(--fg-subtle)]">{nota}</p>
        )}
      </div>
      <dd className="shrink-0 text-right">
        {visivel ? (
          <span className="text-[13.5px] font-medium text-[var(--fg)]">{valor}</span>
        ) : (
          <span className="block h-4 w-20 animate-[shimmer_1.6s_ease-in-out_infinite] rounded-[var(--radius-xs)] bg-[var(--surface-2)]" />
        )}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sucesso                                                             */
/* ------------------------------------------------------------------ */

function SuccessPanel({
  leitura,
  onReiniciar,
  reduzido,
}: {
  leitura: Leitura;
  onReiniciar: () => void;
  reduzido: boolean;
}) {
  const pontos = useCountUp(leitura.pontos, { duracao: 1200, casas: 0 });
  const material = MATERIAL_BY_ID[leitura.materialId];
  const saldo = useWalletStore((s) => s.ecoPontos);

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--accent-line)] bg-[var(--surface)] p-6">
      {/* Folhas subindo — discretas, três apenas */}
      {!reduzido && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[
            { left: "18%", delay: 0, size: 14 },
            { left: "52%", delay: 0.25, size: 11 },
            { left: "78%", delay: 0.45, size: 16 },
          ].map((folha) => (
            <motion.svg
              key={folha.left}
              viewBox="0 0 48 48"
              width={folha.size}
              height={folha.size}
              className="absolute bottom-8 text-[var(--accent)]"
              style={{ left: folha.left }}
              initial={{ opacity: 0, y: 0, rotate: 0 }}
              animate={{ opacity: [0, 0.85, 0], y: -140, rotate: 160 }}
              transition={{ duration: 2.4, delay: folha.delay, ease: "easeOut" }}
            >
              <path
                d="M10 38 C10 22 22 10 38 10 C38 26 26 38 10 38 Z"
                fill="currentColor"
                fillOpacity="0.3"
                stroke="currentColor"
                strokeWidth="2"
              />
            </motion.svg>
          ))}
        </div>
      )}

      <div className="relative">
        <span className="flex size-11 items-center justify-center rounded-full bg-[var(--good-soft)] text-[var(--good)]">
          <CheckCircle className="size-6" weight="fill" />
        </span>

        <h2 className="mt-5 font-display text-h3 text-[var(--fg)]">
          Descarte validado.
        </h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
          {formatNumber(leitura.pesoKg, 1)} kg de{" "}
          {material.nome.toLowerCase()} registrados no{" "}
          {leitura.ecoponto.nome}.
        </p>

        <p className="mt-7 font-display text-[44px] font-semibold leading-none tabular tracking-[-0.035em] text-[var(--accent)]">
          +{formatNumber(pontos)}
        </p>
        <p className="mt-2 text-[13px] text-[var(--fg-muted)]">EcoPontos creditados</p>

        <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)]">
          <div className="bg-[var(--surface-2)] px-4 py-3.5">
            <dt className="text-[11.5px] text-[var(--fg-muted)]">Novo saldo</dt>
            <dd className="mt-1 font-display text-[19px] font-semibold tabular text-[var(--fg)]">
              {formatNumber(saldo)}
            </dd>
          </div>
          <div className="bg-[var(--surface-2)] px-4 py-3.5">
            <dt className="text-[11.5px] text-[var(--fg-muted)]">CO2 evitado</dt>
            <dd className="mt-1 font-display text-[19px] font-semibold tabular text-[var(--fg)]">
              {formatNumber(leitura.co2Kg, 1)} kg
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Button onClick={onReiniciar}>
            <QrCode weight="bold" />
            Registrar outro
          </Button>
          <Button asChild variant="outline">
            <Link href="/app/carteira">
              Ver no extrato
              <ArrowRight weight="bold" />
            </Link>
          </Button>
        </div>

        <Badge tone="neutral" className="mt-5">
          Registro demonstrativo · armazenado apenas neste navegador
        </Badge>
      </div>
    </div>
  );
}
