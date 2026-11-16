import assert from "node:assert/strict";
import { test } from "node:test";
import { createPreviewRateLimiter } from "../src/lib/preview-rate-limit.ts";

test("enforces the rolling ceiling without letting rejected requests extend it", () => {
  let t = 0;
  const limit = createPreviewRateLimiter({ now: () => t });
  assert.equal(limit("fixture", 2, 100), false);
  t = 10;
  assert.equal(limit("fixture", 2, 100), false);
  t = 99;
  for (let i = 0; i < 1000; i++) assert.equal(limit("fixture", 2, 100), true);
  t = 100;
  assert.equal(limit("fixture", 2, 100), false);
  assert.equal(limit("fixture", 2, 100), true);
});

test("bounds key growth and reclaims expired buckets without clearing longer-lived ones", () => {
  let t = 0;
  const limit = createPreviewRateLimiter({ now: () => t, maxKeys: 2, sweepIntervalMs: 10 });
  assert.equal(limit("short", 1, 10), false);
  assert.equal(limit("long", 1, 100), false);
  assert.equal(limit("excess", 1, 10), true);
  t = 10;
  assert.equal(limit("replacement", 1, 20), false);
  assert.equal(limit("long", 1, 100), true);
  assert.equal(limit("still excess", 1, 10), true);
});

test("separate preview instances keep separate counters for the same visitor", () => {
  const one = createPreviewRateLimiter({ now: () => 0 });
  const two = createPreviewRateLimiter({ now: () => 0 });
  assert.equal(one("same fixture", 1, 10), false);
  assert.equal(one("same fixture", 1, 10), true);
  assert.equal(two("same fixture", 1, 10), false);
});
