import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ecorewards-platform.vercel.app"),
  title: {
    default: "EcoRewards — Transforme impacto em recompensa",
    template: "%s · EcoRewards",
  },
  description:
    "Plataforma que transforma reciclagem em EcoPontos, recompensas e impacto ambiental mensurável para cidadãos, empresas e governos.",
  applicationName: "EcoRewards",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "EcoRewards",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "EcoRewards",
    title: "EcoRewards — Transforme impacto em recompensa",
    description:
      "Recicle. Gere impacto. Ganhe EcoPontos. Uma demonstração completa de plataforma climate tech.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfa" },
    { media: "(prefers-color-scheme: dark)", color: "#080b0c" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${sora.variable}`}
    >
      <body className="min-h-dvh bg-[var(--bg)] text-[var(--fg)] antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-sm)] focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-[var(--accent-fg)]"
        >
          Pular para o conteúdo
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
