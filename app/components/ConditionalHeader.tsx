"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/cliente") ||
    pathname === "/enxoval"
  ) {
    return null;
  }
  return <Header />;
}
