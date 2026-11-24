// Memory guard for a single server instance, not a shared tenant or billing quota.
export function createPreviewRateLimiter({
  now = Date.now,
  maxKeys = 50_000,
  sweepIntervalMs = 60_000,
}: { now?: () => number; maxKeys?: number; sweepIntervalMs?: number } = {}) {
  const buckets = new Map<string, { times: number[]; expiresAt: number }>();
  let nextSweep = 0;

  return function limited(key: string, max: number, windowMs: number): boolean {
    const current = now();
    if (current >= nextSweep) {
      for (const [id, bucket] of buckets) {
        if (bucket.expiresAt <= current) buckets.delete(id);
      }
      nextSweep = current + sweepIntervalMs;
    }

    let bucket = buckets.get(key);
    if (!bucket) {
      if (buckets.size >= maxKeys) return true;
      bucket = { times: [], expiresAt: current };
      buckets.set(key, bucket);
    }

    bucket.times = bucket.times.filter(time => current - time < windowMs);
    if (bucket.times.length >= max) return true;
    bucket.times.push(current);
    bucket.expiresAt = current + windowMs;
    return false;
  };
}
