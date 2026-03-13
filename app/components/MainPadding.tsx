"use client";

import { usePathname } from "next/navigation";

export default function MainPadding({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isEnxoval = pathname === "/enxoval";
  return <div className={isAdmin || isEnxoval ? "" : "pt-[4.5rem]"}>{children}</div>;
}
