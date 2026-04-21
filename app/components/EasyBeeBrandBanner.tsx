import Image from "next/image";

type Props = {
  /** Texto abaixo da logo */
  subtitle?: string;
  /** `login` = área maior no card; `compact` = faixa no topo do dashboard */
  variant?: "login" | "compact";
  className?: string;
};

/**
 * Logo Easybee com fundo claro para contraste (marca escura sobre claro).
 */
export function EasyBeeBrandBanner({
  subtitle = "Painel de métricas",
  variant = "login",
  className = "",
}: Props) {
  const isLogin = variant === "login";
  return (
    <div
      className={
        "flex flex-col items-center justify-center gap-1 rounded-xl bg-gradient-to-b from-amber-50 via-white to-amber-100/95 " +
        "ring-1 ring-amber-300/55 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] " +
        (isLogin ? "px-6 py-5 " : "px-4 py-3 ") +
        className
      }
    >
      <Image
        src="/easybee-logo.png"
        alt="Easybee"
        width={220}
        height={72}
        className={
          (isLogin ? "max-h-16 " : "max-h-12 ") +
          "h-auto w-auto max-w-[220px] object-contain object-center"
        }
        priority={isLogin}
      />
      {subtitle ? (
        <p
          className={
            (isLogin ? "text-sm " : "text-[11px] ") +
            "font-medium text-amber-950/65"
          }
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
