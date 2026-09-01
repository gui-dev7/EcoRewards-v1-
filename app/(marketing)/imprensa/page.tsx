import type { Metadata } from "next";
import { PressIndex } from "@/features/content/press-index";

export const metadata: Metadata = {
  title: "Imprensa",
  description:
    "Notícias, análises e material institucional sobre economia circular, logística reversa e política pública de resíduos.",
};

export default function ImprensaPage() {
  return (
    <>
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1360px] px-4 py-20 lg:px-6 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Imprensa</p>
            <h1 className="mt-5 text-balance font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--fg)]">
              O que estamos publicando.
            </h1>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed text-[var(--fg-muted)]">
              Análises sobre economia circular, dados da rede e posicionamentos
              institucionais. Para contato com a assessoria, escreva pela página
              de contato.
            </p>
          </div>
        </div>
      </section>

      <PressIndex />
    </>
  );
}
