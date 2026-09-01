import { cn } from "@/lib/utils";

interface LeafMarkProps extends React.SVGProps<SVGSVGElement> {
  /** Espessura do traço no desenho de contorno. */
  strokeWidth?: number;
  /** `solid` preenche a lâmina; `outline` mantém apenas o traçado. */
  variant?: "solid" | "outline";
  title?: string;
}

/**
 * A folha EcoRewards.
 *
 * Construção geométrica: uma lente formada por dois arcos espelhados
 * sobre a diagonal, nervura central e cinco nervuras alternadas.
 * Cada traço carrega um `data-leaf-*` para que o GSAP possa desenhá-los
 * em sequência sem que o componente precise conhecer a animação.
 */
export function LeafMark({
  className,
  strokeWidth = 1.6,
  variant = "solid",
  title,
  ...props
}: LeafMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      className={cn("h-6 w-6", className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}

      <path
        data-leaf-blade
        d="M10 38 C10 22 22 10 38 10 C38 26 26 38 10 38 Z"
        fill={variant === "solid" ? "currentColor" : "none"}
        fillOpacity={variant === "solid" ? 0.14 : 0}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />

      <path
        data-leaf-midrib
        d="M10 38 L38 10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      <g
        data-leaf-veins
        stroke="currentColor"
        strokeWidth={strokeWidth * 0.72}
        strokeLinecap="round"
        opacity={0.72}
      >
        <path data-leaf-vein d="M17 31 C15.4 29.8 13.6 27.8 12.4 26.2" />
        <path data-leaf-vein d="M22.6 25.4 C24.2 26.9 26.4 29.1 28.1 30.9" />
        <path data-leaf-vein d="M28.2 19.8 C26.9 18.4 25.1 16.6 23.7 15.3" />
        <path data-leaf-vein d="M33.8 14.2 C34.6 15 35.6 16 36.2 16.7" />
      </g>
    </svg>
  );
}

/**
 * Variante em traço contínuo usada na animação do hero: a folha inteira
 * é um único caminho, o que permite desenhá-la de ponta a ponta.
 */
export function LeafOutlinePath({ className }: { className?: string }) {
  return (
    <path
      className={className}
      d="M10 38 C10 22 22 10 38 10 C38 26 26 38 10 38 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  );
}
