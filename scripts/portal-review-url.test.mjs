import assert from "node:assert/strict";
import { test } from "node:test";
import { portalReviewUrl } from "../src/lib/portal-review-url.ts";

const origin = "https://loveleedaystudios.com";

test("standard reviews link to the requested deliverable if present", () => {
  assert.equal(portalReviewUrl("fixture", { standard: true }, "brief"), origin + "/p/fixture/brief");
  assert.equal(portalReviewUrl("fixture", { standard: true }), origin + "/p/fixture");
});

test("each named review links to its own route instead of falling through to portfolio", () => {
  for (const kind of ["bogan", "portfolio", "doorlight", "nowkalamazoo", "wightman", "studio", "civic", "compliance"]) {
    assert.equal(portalReviewUrl("fixture", { [kind]: true }, "brief"), origin + "/p/" + kind + "/fixture");
  }
  assert.equal(portalReviewUrl("fixture", { hub: true, civic: true }), origin + "/p/hub/fixture");
});

test("segments cannot introduce additional path, query, or fragment components", () => {
  assert.equal(portalReviewUrl("one/two?three#four", { doorlight: true }), origin + "/p/doorlight/one%2Ftwo%3Fthree%23four");
});
