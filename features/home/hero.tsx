"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Play } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { MagneticCta } from "./magnetic-cta";
import { formatCompact } from "@/lib/format";
import { PLATFORM_STATS } from "@/mocks/platform";

/**
 * Composição do hero.
 *
 * A folha não é um ícone posto na tela: ela é desenhada. A nervura cresce
 * como uma linha, a lâmina se fecha em volta dela, as nervuras menores
 * ramificam e só então as partículas — os materiais reciclados — aparecem
 * orbitando. Sob `prefers-reduced-motion` tudo isso é substituído pelo
 * estado final, imediato.
 */
export function Hero() {
  const escopo = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          animar: "(prefers-reduced-motion: no-preference)",
          estatico: "(prefers-reduced-motion: reduce)",
        },
        (contexto) => {
          const { animar } = contexto.conditions as { animar: boolean };

          if (!animar) {
            gsap.set(
              "[data-hero-midrib], [data-hero-blade], [data-hero-vein], [data-hero-particula], [data-hero-anel], [data-hero-texto]",
              { opacity: 1, strokeDashoffset: 0, y: 0, scale: 1 },
            );
            return;
          }

          const traçados = gsap.utils.toArray<SVGPathElement>(
            "[data-hero-midrib], [data-hero-blade], [data-hero-vein]",
          );

          traçados.forEach((path) => {
            const comprimento = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: comprimento,
              strokeDashoffset: comprimento,
              opacity: 1,
            });
          });

          const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

          tl.to("[data-hero-midrib]", { strokeDashoffset: 0, duration: 1.1 })
            .to(
              "[data-hero-blade]",
              { strokeDashoffset: 0, duration: 1.5 },
              "-=0.65",
            )
            .to(
              "[data-hero-blade]",
              { fillOpacity: 0.1, duration: 0.9 },
              "-=0.5",
            )
            .to(
              "[data-hero-vein]",
              { strokeDashoffset: 0, duration: 0.7, stagger: 0.09 },
              "-=0.9",
            )
            .fromTo(
              "[data-hero-anel]",
              { scale: 0.7, opacity: 0, transformOrigin: "center" },
              { scale: 1, opacity: 1, duration: 1, stagger: 0.12 },
              "-=0.8",
            )
            .fromTo(
              "[data-hero-particula]",
              { scale: 0, opacity: 0, transformOrigin: "center" },
              {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: { each: 0.05, from: "random" },
              },
              "-=0.7",
            )
            .fromTo(
              "[data-hero-texto]",
              { y: 14, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
              "-=1.2",
            );

          // Deriva contínua das partículas depois da entrada.
          gsap.utils
            .toArray<SVGElement>("[data-hero-particula]")
            .forEach((particula, indice) => {
              gsap.to(particula, {
                y: indice % 2 === 0 ? -7 : 7,
                x: indice % 3 === 0 ? 4 : -4,
                duration: 3.4 + (indice % 5) * 0.4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 1.8 + indice * 0.08,
              });
            });
        },
      );

      return () => mm.revert();
    },
    { scope: escopo },
  );

  return (
    <section
      ref={escopo}
      className="relative overflow-hidden border-b border-[var(--border)]"
    >
      {/* Grade técnica de fundo, esmaecida nas bordas. */}
      <div
        aria-hidden
        className="grid-texture pointer-events-none absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(ellipse_75%_60%_at_60%_35%,black,transparent)]"
      />

      <div className="relative mx-auto grid max-w-[1360px] gap-12 px-4 pb-20 pt-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-8 lg:px-6 lg:pb-28 lg:pt-24">
        <div>
          <p data-hero-texto className="eyebrow opacity-0">
            Plataforma de impacto ambiental
          </p>

          <h1
            data-hero-texto
            className="mt-5 max-w-[13ch] text-balance font-display text-[clamp(2.5rem,6.2vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--fg)] opacity-0"
          >
            Transforme impacto em recompensa.
          </h1>

          <p
            data-hero-texto
            className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-[var(--fg-muted)] opacity-0"
          >
            <span className="font-medium text-[var(--fg)]">
              Recicle. Gere impacto. Ganhe EcoPontos.
            </span>{" "}
            Cada descarte validado vira pontuação, recompensa real e um número
            que cidades e empresas conseguem auditar.
          </p>

          <div data-hero-texto className="mt-9 flex flex-wrap items-center gap-3 opacity-0">
            <MagneticCta>
              <Button asChild size="lg">
                <Link href="/cadastro">
                  Começar agora
                  <ArrowRight weight="bold" />
                </Link>
              </Button>
            </MagneticCta>
            <MagneticCta>
              <Button asChild variant="outline" size="lg">
                <Link href="/demo">
                  <Play weight="fill" />
                  Explorar demonstração
                </Link>
              </Button>
            </MagneticCta>
          </div>

          <dl
            data-hero-texto
            className="mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--border)] opacity-0"
          >
            {PLATFORM_STATS.slice(0, 3).map((stat) => (
              <div key={stat.id} className="bg-[var(--surface)] px-4 py-3.5">
                <dt className="text-[11px] font-medium leading-tight text-[var(--fg-subtle)]">
                  {stat.rotulo}
                </dt>
                <dd className="mt-1.5 font-display text-[19px] font-semibold tabular tracking-[-0.02em] text-[var(--fg)]">
                  {formatCompact(stat.valor)}
                  <span className="ml-0.5 text-[13px] font-medium text-[var(--fg-muted)]">
                    {stat.sufixo}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroComposition />
      </div>
    </section>
  );
}

/** As partículas representam materiais em circulação ao redor da folha. */
const PARTICULAS = [
  { cx: 78, cy: 92, r: 3.4, cor: "var(--series-2)" },
  { cx: 252, cy: 74, r: 2.6, cor: "var(--series-3)" },
  { cx: 296, cy: 168, r: 4.2, cor: "var(--series-1)" },
  { cx: 62, cy: 208, r: 2.8, cor: "var(--series-5)" },
  { cx: 128, cy: 44, r: 2.2, cor: "var(--series-4)" },
  { cx: 318, cy: 248, r: 3, cor: "var(--series-2)" },
  { cx: 44, cy: 148, r: 2.4, cor: "var(--series-3)" },
  { cx: 214, cy: 302, r: 3.6, cor: "var(--series-1)" },
  { cx: 106, cy: 296, r: 2.6, cor: "var(--series-5)" },
  { cx: 274, cy: 118, r: 2, cor: "var(--series-6)" },
  { cx: 158, cy: 330, r: 2.4, cor: "var(--series-2)" },
  { cx: 336, cy: 90, r: 2.8, cor: "var(--series-1)" },
];

function HeroComposition() {
  return (
    <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
      <svg
        viewBox="0 0 384 384"
        fill="none"
        className="w-full"
        role="img"
        aria-label="Composição da folha EcoRewards cercada por materiais em circulação"
      >
        {/* Anéis de órbita — estrutura, não decoração: marcam as camadas
            do ciclo (descarte, validação, recompensa). */}
        <g stroke="var(--border-strong)" strokeWidth="1" fill="none">
          <circle data-hero-anel cx="192" cy="192" r="172" opacity="0" strokeDasharray="2 6" />
          <circle data-hero-anel cx="192" cy="192" r="134" opacity="0" />
          <circle data-hero-anel cx="192" cy="192" r="96" opacity="0" strokeDasharray="2 6" />
        </g>

        {/* Eixos técnicos */}
        <g stroke="var(--border)" strokeWidth="1" opacity="0.8">
          <line x1="192" y1="8" x2="192" y2="52" />
          <line x1="192" y1="332" x2="192" y2="376" />
          <line x1="8" y1="192" x2="52" y2="192" />
          <line x1="332" y1="192" x2="376" y2="192" />
        </g>

        {/* A folha, em escala sobre o centro da composição */}
        <g transform="translate(96 96) scale(4)" className="text-[var(--accent)]">
          <path
            data-hero-blade
            d="M10 38 C10 22 22 10 38 10 C38 26 26 38 10 38 Z"
            fill="currentColor"
            fillOpacity="0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0"
          />
          <path
            data-hero-midrib
            d="M10 38 L38 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0"
          />
          <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.75">
            <path data-hero-vein d="M17 31 C15.4 29.8 13.6 27.8 12.4 26.2" opacity="0" />
            <path data-hero-vein d="M22.6 25.4 C24.2 26.9 26.4 29.1 28.1 30.9" opacity="0" />
            <path data-hero-vein d="M28.2 19.8 C26.9 18.4 25.1 16.6 23.7 15.3" opacity="0" />
            <path data-hero-vein d="M33.8 14.2 C34.6 15 35.6 16 36.2 16.7" opacity="0" />
          </g>
        </g>

        {PARTICULAS.map((particula, indice) => (
          <circle
            key={indice}
            data-hero-particula
            cx={particula.cx}
            cy={particula.cy}
            r={particula.r}
            fill={particula.cor}
            opacity="0"
          />
        ))}
      </svg>
    </div>
  );
}
