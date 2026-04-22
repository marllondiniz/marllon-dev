import {
  Activity,
  Coins,
  Eye,
  LineChart,
  Link2,
  MessageCircle,
  MousePointerClick,
  Percent,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

/**
 * Prévia estática alinhada ao painel de métricas (Meta) — dados fictícios.
 */
export function TrafficMetricsDashboardExample() {
  return (
    <figure
      className="mx-auto max-w-5xl"
      aria-label="Exemplo ilustrativo de painel de métricas (dados fictícios)"
    >
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 shadow-[0_0_0_1px_rgba(34,197,94,0.12),0_24px_48px_rgba(0,0,0,0.45)]">
        {/* Chrome + título */}
        <div className="flex items-center gap-2 border-b border-zinc-800/80 bg-zinc-900/50 px-3 py-2">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
          </div>
          <div className="mx-auto min-w-0 max-w-sm flex-1 truncate rounded-md border border-zinc-800/80 bg-zinc-950/60 px-2 py-1 text-center font-mono text-[10px] text-zinc-500">
            Métricas Meta Ads · visão geral
          </div>
        </div>

        <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">
          {/* Controles: período + export fictício */}
          <div className="flex flex-col gap-3 border-b border-zinc-800/60 pb-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
            <div className="flex flex-1 flex-wrap items-end gap-2 sm:gap-3">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Período
                </p>
                <div className="inline-flex min-h-[32px] items-center rounded-lg border border-zinc-700/80 bg-zinc-900 px-2.5 py-1.5 font-mono text-xs text-zinc-300">
                  Últimos 30 dias
                </div>
              </div>
              <div className="font-mono text-[10px] text-zinc-500 sm:pb-0.5">
                <span className="text-zinc-600">de</span> 2024-04-01{" "}
                <span className="text-zinc-600">até</span> 2024-04-30
              </div>
            </div>
            <div className="inline-flex w-fit max-w-full items-center gap-0.5 rounded-xl border border-zinc-700/90 bg-zinc-950/80 p-0.5 font-mono text-[9px] text-zinc-400">
              <span className="rounded-md px-2 py-1.5 sm:px-2.5">.md</span>
              <span className="text-zinc-600">|</span>
              <span className="rounded-md px-2 py-1.5 sm:px-2.5">.pdf</span>
            </div>
          </div>

          {/* Resumo da consulta */}
          <div className="flex flex-col gap-2 rounded-lg border border-zinc-800/80 bg-zinc-950/40 px-2.5 py-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5 sm:px-3">
            <span className="inline-flex w-fit items-center rounded-full border border-[#22c55e]/35 bg-[#22c55e]/10 px-2 py-0.5 text-[10px] font-medium text-[#86efac]">
              Últimos 30 dias
            </span>
            <span className="hidden h-3 w-px bg-zinc-700 sm:block" aria-hidden />
            <span className="font-mono text-[10px] text-zinc-500">act_8040532568…</span>
            <span className="hidden sm:inline" aria-hidden>
              <span className="text-zinc-700">·</span>
            </span>
            <span className="truncate text-[10px] text-zinc-500 sm:max-w-[14rem]">Conta: exemplo@marca</span>
          </div>

          {/* Hero KPIs */}
          <div>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
              Conta (período)
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-4">
              {[
                { icon: Wallet, label: "Investimento", value: "R$ 4.250,00", k: "hero" },
                { icon: Eye, label: "Impressões", value: "128.400" },
                { icon: MousePointerClick, label: "Cliques (todos)", value: "3.842" },
                { icon: Target, label: "Alcance", value: "89.200" },
              ].map((item) => {
                const Icon = item.icon;
                const isHero = item.k === "hero";
                return (
                  <div
                    key={item.label}
                    className={
                      "rounded-xl border p-2.5 sm:p-3 " +
                      (isHero
                        ? "border-[#22c55e]/35 bg-gradient-to-br from-[#22c55e]/[0.12] via-zinc-900/50 to-zinc-900/30"
                        : "border-zinc-800/90 bg-zinc-900/40")
                    }
                  >
                    <div className="flex min-w-0 items-center gap-1.5 text-[9px] font-medium uppercase tracking-wide text-zinc-500 sm:text-[10px]">
                      <span
                        className={
                          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md " +
                          (isHero ? "bg-[#22c55e]/20 text-[#4ade80]" : "bg-zinc-800/80 text-zinc-500")
                        }
                      >
                        <Icon className="h-3 w-3" />
                      </span>
                      <span className="min-w-0 leading-tight">{item.label}</span>
                    </div>
                    <p
                      className={
                        "mt-1.5 break-words font-semibold tabular-nums sm:mt-2 sm:text-lg " +
                        (isHero ? "text-[#86efac]" : "text-white")
                      }
                    >
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Taxas principais */}
          <div>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
              Taxas médias
            </p>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 sm:gap-2">
              {[
                { icon: Percent, l: "CTR", v: "2,18%" },
                { icon: TrendingUp, l: "CPC médio", v: "R$ 1,11" },
                { icon: LineChart, l: "CPM", v: "R$ 12,40" },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.l}
                    className="flex min-h-[40px] items-center justify-between gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900/30 px-2.5 py-1.5 sm:px-3 sm:py-2"
                  >
                    <span className="flex min-w-0 items-center gap-1.5 text-[10px] text-zinc-500">
                      <Icon className="h-3 w-3 shrink-0" />
                      {row.l}
                    </span>
                    <span className="shrink-0 font-mono text-xs font-medium text-[#86efac]">
                      {row.v}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* KPIs secundários */}
          <div>
            <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
              Indicadores adicionais
            </p>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2 lg:grid-cols-5">
              {[
                { icon: Activity, l: "Frequência", v: "1,44" },
                { icon: Coins, l: "CPP", v: "R$ 8,20" },
                { icon: Link2, l: "Cliques no link", v: "1.920" },
                { icon: Link2, l: "CPC no link", v: "R$ 2,21" },
                { icon: MessageCircle, l: "Conv. msg. (7d)", v: "142" },
              ].map((row) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.l}
                    className="min-w-0 rounded-lg border border-zinc-800/90 bg-zinc-900/35 p-2 sm:p-2.5"
                  >
                    <div className="flex items-start gap-1.5 text-[9px] uppercase leading-tight tracking-wide text-zinc-500 sm:text-[10px]">
                      <Icon className="mt-0.5 h-3 w-3 shrink-0" />
                      <span className="line-clamp-2">{row.l}</span>
                    </div>
                    <p className="mt-1 break-words text-sm font-semibold tabular-nums text-white sm:text-base">
                      {row.v}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hierarquia resumida */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500 sm:text-[10px]">
                Campanhas · conjuntos · anúncios
              </span>
              <span className="h-px min-w-0 flex-1 bg-zinc-800" />
            </div>
            <div className="overflow-x-auto rounded-lg border border-zinc-800/80">
              <table className="w-full min-w-[520px] text-left text-[10px] sm:min-w-0 sm:text-xs">
                <thead>
                  <tr className="border-b border-zinc-800/90 bg-zinc-900/60 text-zinc-500">
                    <th className="px-2 py-1.5 font-medium sm:px-3 sm:py-2">Nível / nome</th>
                    <th className="px-2 py-1.5 text-right font-mono font-medium sm:px-3">Invest.</th>
                    <th className="px-2 py-1.5 text-right font-mono font-medium sm:px-3">Cliques</th>
                    <th className="px-2 py-1.5 text-right font-mono font-medium sm:px-3">CTR</th>
                    <th className="hidden px-2 py-1.5 text-right font-mono font-medium sm:table-cell sm:px-3">
                      Resultado
                    </th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300">
                  {[
                    {
                      n: "Campanha · Aquisição (tráfego frio)",
                      inv: "R$ 1.890,00",
                      clk: "1.240",
                      ctr: "1,9%",
                      res: "412 leads",
                    },
                    {
                      n: "  └ Conj. · Intenção + interesse",
                      inv: "R$ 1.100,00",
                      clk: "890",
                      ctr: "2,3%",
                      res: "—",
                    },
                    {
                      n: "Campanha · Remarketing (visitantes 14d)",
                      inv: "R$ 980,00",
                      clk: "612",
                      ctr: "2,8%",
                      res: "R$ 38 CPL",
                    },
                    {
                      n: "Anúncio · Criativo A / vídeo 15s",
                      inv: "R$ 380,00",
                      clk: "210",
                      ctr: "3,1%",
                      res: "melhor CPV",
                    },
                  ].map((row) => (
                    <tr
                      key={row.n}
                      className="border-b border-zinc-800/50 last:border-0 odd:bg-zinc-950/30"
                    >
                      <td className="max-w-[200px] truncate px-2 py-1.5 font-mono sm:max-w-none sm:px-3 sm:py-2">
                        {row.n}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono text-[#a7f3d0]/90 sm:px-3">
                        {row.inv}
                      </td>
                      <td className="px-2 py-1.5 text-right font-mono sm:px-3">{row.clk}</td>
                      <td className="px-2 py-1.5 text-right font-mono sm:px-3">{row.ctr}</td>
                      <td className="hidden px-2 py-1.5 text-right text-zinc-500 sm:table-cell sm:px-3">
                        {row.res}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-1.5 text-[9px] text-zinc-600">Linhas de exemplo; no painel real há expansão por campanha, conjunto e anúncio.</p>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-zinc-500">
        Exemplo ilustrativo — números, nomes e IDs são fictícios. O painel varia por conta, período e
        implementação.
      </figcaption>
    </figure>
  );
}
