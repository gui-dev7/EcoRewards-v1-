import Link from "next/link";
import { InstagramLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/brand/logo";
import { FOOTER_NAV } from "./site-nav";

const REDES = [
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramLogo },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedinLogo },
  { href: "https://x.com", label: "X", Icon: XLogo },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-[1360px] px-4 py-14 lg:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[280px] text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
              Transformamos ação sustentável em valor mensurável para cidadãos,
              empresas e governos.
            </p>
            <div className="mt-5 flex items-center gap-1">
              {REDES.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-[var(--radius-sm)] p-2 text-[var(--fg-subtle)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--accent)]"
                >
                  <Icon className="size-[18px]" weight="fill" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_NAV.map((coluna) => (
            <div key={coluna.titulo}>
              <h3 className="eyebrow mb-4">{coluna.titulo}</h3>
              <ul className="space-y-2.5">
                {coluna.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-[var(--fg-muted)] transition-colors hover:text-[var(--accent)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--border)] pt-6 text-[12.5px] text-[var(--fg-subtle)] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 EcoRewards. Projeto demonstrativo.</p>
          <p className="max-w-md sm:text-right">
            Todos os números exibidos são demonstrativos. A aplicação não possui
            banco de dados nem integrações externas de persistência.
          </p>
        </div>
      </div>
    </footer>
  );
}
