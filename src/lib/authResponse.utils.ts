/**
 * Normalize auth API payloads that may use token, access_token, or nested data.* shapes.
 */
export function extractAuthToken(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const p = payload as Record<string, unknown>;
  const direct = p.token ?? p.access_token;
  if (typeof direct === "string" && direct.length > 0) return direct;
  const data = p.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const nested = d.token ?? d.access_token;
    if (typeof nested === "string" && nested.length > 0) return nested;
  }
  return undefined;
}

export function extractAuthUser(
  payload: unknown
): Record<string, unknown> | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const p = payload as Record<string, unknown>;
  if (p.user && typeof p.user === "object") {
    return p.user as Record<string, unknown>;
  }
  const data = p.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (d.user && typeof d.user === "object") {
      return d.user as Record<string, unknown>;
    }
  }
  return undefined;
}
