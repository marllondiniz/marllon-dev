"use client";

import { usePathname } from "next/navigation";
import CookieConsent from "./CookieConsent";

/** Exibe o banner de cookies apenas na página inicial. */
export default function CookieConsentOnlyHome() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <CookieConsent />;
}
