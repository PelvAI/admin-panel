/**
 * Isologo ALMA: símbolo + wordmark, como exige el manual de marca
 * ("Separar el símbolo del wordmark sin autorización" es un uso prohibido).
 * El archivo que existía antes (public/logo.svg) era solo el símbolo,
 * mal orientado, estirado dentro de cajas rectangulares anchas — nunca
 * mostraba la palabra "ALMA" en ningún lugar del panel.
 *
 * `layout="stacked"` es la versión principal del manual (símbolo arriba,
 * wordmark abajo); `layout="inline"` es una adaptación propia para chrome
 * de producto angosto (la barra lateral), que el manual no cubre.
 */

const tones = {
  light: "#0D1A3E", // Midnight, sobre fondo claro
  dark: "#F5EFE6", // Ivory, sobre fondo oscuro
  color: "#F5EFE6", // Ivory, sobre Rose Dust u otro color sólido
} as const;

function Symbol({ tone, className }: { tone: keyof typeof tones; className?: string }) {
  const stroke = tones[tone];
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" stroke={stroke} strokeWidth="1.4" opacity={tone === "light" ? 1 : 0.85} />
      <path
        d="M 12 63 C 20 36 34 16 40 4 C 46 16 60 36 68 63"
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function AlmaLogo({
  tone = "light",
  layout = "inline",
  tagline = false,
  className,
}: {
  tone?: keyof typeof tones;
  layout?: "stacked" | "inline";
  tagline?: boolean;
  className?: string;
}) {
  const textColor = tone === "light" ? "text-primary" : "text-[#F5EFE6]";

  if (layout === "stacked") {
    return (
      <div className={`flex flex-col items-center gap-3 ${className ?? ""}`}>
        <Symbol tone={tone} className="h-16 w-16" />
        <div className={`font-heading font-light uppercase tracking-wordmark-lg text-3xl leading-none ${textColor}`}>
          ALMA
        </div>
        {tagline && (
          <div className="font-sans text-[11px] font-normal uppercase tracking-wordmark text-silver -mt-1">
            Health Intelligence System
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <Symbol tone={tone} className="h-7 w-7 shrink-0" />
      <div className={`font-heading font-light uppercase tracking-wordmark text-xl leading-none ${textColor}`}>
        ALMA
      </div>
    </div>
  );
}
