"use client";

import {
  Gift,
  ExternalLink,
  Shirt,
  Baby,
  Footprints,
  Thermometer,
  Bath,
  Bed,
  Car,
  Droplets,
  Wind,
  Sparkles,
  Star,
  ShoppingBag,
  Layers,
  Shield,
  Radio,
  Scissors,
  Hand,
  Smile,
  Link,
  type LucideIcon,
} from "lucide-react";
import type { EnxovalItemWithStatus } from "./types";

const ITEM_ICON_RULES: [RegExp, LucideIcon][] = [
  [/bod(y|ies)|macacão|macacões|casaquinho|culote|mijão|babador|conjunto.*lã/i, Shirt],
  [/cueiro|manta|cobertor|fralda.*tecido/i, Layers],
  [/meia|sapat/i, Footprints],
  [/luva/i, Hand],
  [/touca|gorro/i, Baby],
  [/saída.*maternidade|faixa.*umbigo/i, Baby],
  [/mamadeira|bico.*mamadeira/i, Baby],
  [/chupeta/i, Smile],
  [/prendedor.*chupeta/i, Link],
  [/aspirador/i, Wind],
  [/esterilizador/i, Sparkles],
  [/termômetro/i, Thermometer],
  [/umidificador/i, Wind],
  [/babá.*eletrônica/i, Radio],
  [/canguru|sling/i, Baby],
  [/mordedor/i, Smile],
  [/escova.*mamadeira|pinça/i, Scissors],
  [/lençol|fronha|kit.*berço/i, Bed],
  [/sofá.*cama/i, Bed],
  [/móbile/i, Star],
  [/cortina/i, Layers],
  [/banheira|suporte.*banho/i, Bath],
  [/toalha|esponja/i, Droplets],
  [/trocador/i, Baby],
  [/algodão|sabonete|saboneteira/i, Droplets],
  [/escova.*cabelo|massageador|manicure/i, Scissors],
  [/carrinho|bebê.*conforto|encosto.*cabeça/i, Car],
  [/capa.*carrinho/i, Shield],
  [/bolsa/i, ShoppingBag],
  [/lenço.*umedecido/i, Droplets],
];

function getItemIcon(name: string): LucideIcon {
  for (const [regex, icon] of ITEM_ICON_RULES) {
    if (regex.test(name)) return icon;
  }
  return Gift;
}

type Props = {
  item: EnxovalItemWithStatus;
  categoryName: string;
  color: { bg: string; icon: string };
  size?: "sm" | "md" | "lg";
};

export default function ProductImage({ item, categoryName, color, size = "md" }: Props) {
  const sizeCls =
    size === "sm" ? "h-12 w-12" : size === "lg" ? "h-14 w-14" : "h-14 w-14";

  const Icon = getItemIcon(item.name);
  const iconSize = size === "sm" ? "h-5 w-5" : "h-6 w-6";

  if (item.link) {
    const isAmazon = item.link.includes("amazon");
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${sizeCls} relative shrink-0 flex items-center justify-center rounded-xl ${color.bg} transition hover:brightness-125 group`}
        title={isAmazon ? "Ver na Amazon" : "Ver produto"}
      >
        <Icon className={`${iconSize} ${color.icon}`} />
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-[#042f2e] ${
            isAmazon ? "bg-[#ff9900]" : "bg-white/20"
          }`}
        >
          <ExternalLink
            className={`h-2 w-2 ${isAmazon ? "text-[#232f3e]" : "text-white/70"}`}
          />
        </span>
      </a>
    );
  }

  return (
    <div className={`${sizeCls} shrink-0 flex items-center justify-center rounded-xl ${color.bg}`}>
      <Icon className={`${iconSize} ${color.icon}`} />
    </div>
  );
}
