import Image from "next/image";
import { LuzDoLuarManualLink } from "@/app/components/LuzDoLuarManualLink";

type Props = {
  subtitle?: string;
  variant?: "login" | "compact";
  /**
   * Manual no banner: no login fica abaixo do formulário (use `LuzDoLuarManualLink` na página).
   * Padrão: só no painel (`compact`).
   */
  showManualLink?: boolean;
  className?: string;
};

/**
 * Logo Luz do Luar (ouro sobre navy no arquivo). Container escuro para combinar com a arte.
 */
export function LuzDoLuarBrandBanner({
  subtitle = "Painel de métricas",
  variant = "login",
  showManualLink,
  className = "",
}: Props) {
  const isLogin = variant === "login";
  const showManualInBanner =
    showManualLink === false
      ? false
      : showManualLink === true
        ? true
        : variant === "compact";
  return (
    <div
      className={
        "flex flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#121620] " +
        "ring-1 ring-[#c5a47e]/40 shadow-[inset_0_1px_0_0_rgba(197,164,126,0.12)] " +
        (isLogin ? "px-4 py-4 " : "px-3 py-2.5 ") +
        className
      }
    >
      <Image
        src="/logo-luz-do-luar.jpeg"
        alt="Luz do Luar Nail Studio"
        width={320}
        height={160}
        className={
          (isLogin ? "max-h-[7.5rem] " : "max-h-14 ") +
          "h-auto w-full max-w-[280px] rounded-md object-cover object-center"
        }
        priority={isLogin}
      />
      {subtitle ? (
        <p
          className={
            (isLogin ? "text-sm " : "text-[11px] ") +
            "font-medium tracking-wide text-[#d4bc96]/90"
          }
        >
          {subtitle}
        </p>
      ) : null}
      {showManualInBanner ? <LuzDoLuarManualLink variant="compact" /> : null}
    </div>
  );
}
