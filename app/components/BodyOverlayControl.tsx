"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const NO_OVERLAY_CLASS = "no-global-overlay";

/**
 * Remove scanlines e noise do body em rotas que devem ficar limpas (ex.: demo no iframe do comparativo).
 */
export default function BodyOverlayControl() {
  const pathname = usePathname();
  const hideOverlay = pathname === "/demo-alta-conversao";

  useEffect(() => {
    if (hideOverlay) {
      document.body.classList.add(NO_OVERLAY_CLASS);
    } else {
      document.body.classList.remove(NO_OVERLAY_CLASS);
    }
    return () => document.body.classList.remove(NO_OVERLAY_CLASS);
  }, [hideOverlay]);

  return null;
}
