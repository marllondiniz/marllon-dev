import type { Metadata } from "next";
import Landing72hContent from "./Landing72hContent";

export const metadata: Metadata = {
  title: "Landing em 72h — Bonita, pronta pra converter, sem preço de agência",
  description:
    "Landing page premium em até 72h: copy + design + rastreamento + integrações. Você manda o link do Instagram e eu faço o resto. 72h ou não paga.",
  openGraph: {
    title: "Landing em 72h | zinid.tech",
    description: "Landing bonita e feita pra converter em até 72h — sem preço de agência.",
  },
};

export default function Landing72hPage() {
  return <Landing72hContent />;
}
