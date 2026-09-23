// Cleans text coming back from the chat model (gpt-oss-120b on Cerebras) before
// it is shown or emailed. The model writes typographic characters that read as
// errors on screen: "December 31 2026" (narrow no-break spaces, comma
// dropped) rendered as one word, and "master‑plan" used a non-breaking
// hyphen. Found 2026-09-23 in the Kalamazoo Ask Arthur answers.
const MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December";

export function cleanModelText(s: string): string {
  return String(s ?? "")
    .replace(/[     ]/g, " ") // no-break / thin spaces -> space
    .replace(/[‐‑]/g, "-") // (non-breaking) hyphen -> hyphen
    .replace(/[​-‍⁠﻿]/g, "") // zero-width characters
    .replace(new RegExp(`\\b(${MONTHS}) (\\d{1,2}) (\\d{4})\\b`, "g"), "$1 $2, $3") // "December 31 2026" -> "December 31, 2026"
    .replace(/ {2,}/g, " ");
}

// One line for the system prompt, so the model gets it right in the first place.
export const DATE_STYLE_RULE =
  "Write dates in words with ordinary spaces and a comma, like December 31, 2026. Use plain ASCII spaces and hyphens only.";
