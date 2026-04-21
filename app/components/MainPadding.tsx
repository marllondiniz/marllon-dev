"use client";

import { usePathname } from "next/navigation";

export default function MainPadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isCliente = pathname?.startsWith("/cliente");
  const isEnxoval = pathname === "/enxoval";
  const noHeaderPad = isAdmin || isCliente || isEnxoval;
  return <div className={noHeaderPad ? "" : "pt-[4.5rem]"}>{children}</div>;
}
