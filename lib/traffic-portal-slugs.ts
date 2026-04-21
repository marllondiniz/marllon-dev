/**
 * Slugs de `/cliente/trafego/[slug]` — manter alinhado a `META_CLIENT_*_SLUG` no `.env`.
 */
export const TRAFEGO_SLUG_EASYBEE = "easybee";
export const TRAFEGO_SLUG_LUZ_DO_LUAR = "luz-do-luar";

export type TrafficPortalKind = "easybee" | "luzdoluar" | "default";

export function trafficPortalKind(slug: string): TrafficPortalKind {
  const s = slug.toLowerCase();
  if (s === TRAFEGO_SLUG_EASYBEE) return "easybee";
  if (s === TRAFEGO_SLUG_LUZ_DO_LUAR) return "luzdoluar";
  return "default";
}
