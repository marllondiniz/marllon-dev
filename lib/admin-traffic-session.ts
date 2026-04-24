const STORAGE_KEY = "marllon_admin_traffic_session_v1";

export function saveAdminTrafficSession(secret: string) {
  try {
    if (typeof window === "undefined") return;
    const s = secret.trim();
    if (!s) return;
    sessionStorage.setItem(STORAGE_KEY, s);
  } catch {
    /* quota / modo privado */
  }
}

export function readAdminTrafficSession(): string | null {
  try {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearAdminTrafficSession() {
  try {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* */
  }
}
