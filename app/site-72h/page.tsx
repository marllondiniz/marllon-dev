import type { Metadata } from "next";
import Site72hContent from "./Site72hContent";

export const metadata: Metadata = {
  title: "Seu site em 72h — Com identidade, pronto pra converter | zinid.tech",
  description:
    "Seu site premium em até 72h: copy, design, rastreamento e integrações. Com identidade, não template. Você manda o link do Instagram e eu faço o resto. 72h ou não paga.",
  openGraph: {
    title: "Seu site em 72h | zinid.tech",
    description: "Site com identidade e feito pra converter em até 72h.",
  },
};

export default function Site72hPage() {
  return <Site72hContent />;
}
