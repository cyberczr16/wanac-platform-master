/** Unwrap Laravel-style JSON: raw array, { data: [] }, or nested resources. */
export function habitsListToArray(val: unknown): Record<string, unknown>[] {
  if (Array.isArray(val)) return val as Record<string, unknown>[];
  if (val && typeof val === 'object') {
    const o = val as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data as Record<string, unknown>[];
    const inner = o.data;
    if (inner && typeof inner === 'object' && Array.isArray((inner as { data?: unknown }).data)) {
      return (inner as { data: Record<string, unknown>[] }).data;
    }
    if (Array.isArray(o.daily_habits)) return o.daily_habits as Record<string, unknown>[];
    if (Array.isArray(o.whole_life_scores)) return o.whole_life_scores as Record<string, unknown>[];
  }
  return [];
}

function num(v: unknown): number {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

const DAILY_KEYS = ['sleep', 'exercise', 'nutrition', 'mood', 'productivity'] as const;
const WHOLE_KEYS = [
  'health',
  'relationship',
  'career',
  'finances',
  'personal_growth',
  'recreation',
  'spirituality',
  'community',
] as const;

function averageDailyScore(row: Record<string, unknown>): number {
  const existing = num(row.score);
  if (!Number.isNaN(existing) && existing >= 1 && existing <= 5) return existing;
  const vals = DAILY_KEYS.map((k) => num(row[k])).filter((n) => !Number.isNaN(n) && n >= 1 && n <= 5);
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function averageWholeLifeScore(row: Record<string, unknown>): number {
  const existing = num(row.score);
  if (!Number.isNaN(existing) && existing >= 1 && existing <= 10) return existing;
  const vals = WHOLE_KEYS.map((k) => num(row[k])).filter((n) => !Number.isNaN(n) && n >= 1 && n <= 10);
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function getRowTime(row: Record<string, unknown>): number {
  const s = row.created_at ?? row.date ?? row.updated_at;
  if (typeof s === 'string' || s instanceof Date) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) return d.getTime();
  }
  return 0;
}

export type DailyChartPoint = { day: string; score: number };
export type WholeLifeChartPoint = { month: string; score: number };

/** Map API daily habit rows to Recharts bar data (chronological). */
export function normalizeDailyHabitsForChart(raw: unknown): DailyChartPoint[] {
  const rows = habitsListToArray(raw);
  const mapped = rows.map((row, idx) => {
    const t = getRowTime(row);
    const score = averageDailyScore(row);
    const d = t ? new Date(t) : null;
    const day = d
      ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      : `#${idx + 1}`;
    return {
      day,
      score: Math.round(score * 10) / 10,
      _t: t || idx,
    };
  });
  mapped.sort((a, b) => a._t - b._t);
  return mapped.map(({ day, score }) => ({ day, score }));
}

/** Map API whole-life rows to Recharts line data (chronological). */
export function normalizeWholeLifeForChart(raw: unknown): WholeLifeChartPoint[] {
  const rows = habitsListToArray(raw);
  const mapped = rows.map((row, idx) => {
    const t = getRowTime(row);
    const score = averageWholeLifeScore(row);
    const d = t ? new Date(t) : null;
    const month = d
      ? d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
      : `Entry ${idx + 1}`;
    return {
      month,
      score: Math.round(score * 10) / 10,
      _t: t || idx,
    };
  });
  mapped.sort((a, b) => a._t - b._t);
  return mapped.map(({ month, score }) => ({ month, score }));
}
