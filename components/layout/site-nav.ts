/**
 * Navegação do site público — só dados, sem ícones.
 *
 * Fica separado de `nav-config.tsx` de propósito: o rodapé é um Server
 * Component, e importar o barrel de ícones aqui faria o React Context do
 * Phosphor ser avaliado no servidor.
 */

export const PUBLIC_NAV = [
  { href: "/sobre", label: "Sobre" },
  { href: "/impacto", label: "Impacto" },
  { href: "/ecopontos", label: "Ecopontos" },
  { href: "/recompensas", label: "Recompensas" },
  { href: "/imprensa", label: "Imprensa" },
] as const;

export const FOOTER_NAV = [
  {
    titulo: "Produto",
    links: [
      { href: "/app", label: "Portal do cidadão" },
      { href: "/empresa", label: "Soluções para empresas" },
      { href: "/governo", label: "Governo e cidades" },
      { href: "/ecopontos", label: "Rede de ecopontos" },
      { href: "/recompensas", label: "Catálogo de recompensas" },
    ],
  },
  {
    titulo: "Empresa",
    links: [
      { href: "/sobre", label: "Sobre nós" },
      { href: "/impacto", label: "Nosso impacto" },
      { href: "/carreiras", label: "Carreiras" },
      { href: "/imprensa", label: "Imprensa" },
      { href: "/contato", label: "Contato" },
    ],
  },
  {
    titulo: "Demonstração",
    links: [
      { href: "/demo", label: "Escolher ambiente" },
      { href: "/login", label: "Entrar" },
      { href: "/cadastro", label: "Criar conta" },
    ],
  },
] as const;
