/**
 * Períodos do seletor de tráfego Meta (alinhado ao Ads Manager / Insights).
 * IDs devem bater com `insightDateParamsFromPreset` e com a rota `meta-insights`.
 */
export const TRAFFIC_DATE_PRESETS: { id: string; label: string }[] = [
  { id: "today", label: "Hoje" },
  { id: "yesterday", label: "Ontem" },
  { id: "today_yesterday", label: "Hoje e ontem" },
  { id: "last_7d", label: "Últimos 7 dias" },
  { id: "last_14d", label: "Últimos 14 dias" },
  { id: "last_28d", label: "Últimos 28 dias" },
  { id: "last_30d", label: "Últimos 30 dias" },
  { id: "this_week_mon_today", label: "Esta semana" },
  { id: "last_week_mon_sun", label: "Semana passada" },
  { id: "this_month", label: "Este mês" },
  { id: "last_month", label: "Mês passado" },
  { id: "maximum", label: "Máximo" },
];

export const TRAFFIC_DEFAULT_PRESET = "last_30d";

/** Preset legado ainda aceito pela API (ex.: favoritos com URL antiga). */
export const TRAFFIC_LEGACY_PRESETS: { id: string; label: string }[] = [
  { id: "last_90d", label: "Últimos 90 dias" },
  { id: "last_37_months", label: "Histórico longo (~37 meses Meta)" },
];

export const TRAFFIC_LEGACY_PRESET_IDS = TRAFFIC_LEGACY_PRESETS.map((x) => x.id);

export const ALL_TRAFFIC_PRESET_IDS = new Set<string>([
  ...TRAFFIC_DATE_PRESETS.map((x) => x.id),
  ...TRAFFIC_LEGACY_PRESET_IDS,
]);

export function getTrafficPresetLabel(presetId: string): string {
  return (
    TRAFFIC_DATE_PRESETS.find((x) => x.id === presetId)?.label ||
    TRAFFIC_LEGACY_PRESETS.find((x) => x.id === presetId)?.label ||
    presetId
  );
}
