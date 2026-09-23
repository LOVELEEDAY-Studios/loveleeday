// Cleans text coming back from the chat model (gpt-oss-120b on Cerebras) before
// it is shown or emailed. The model writes typographic characters that read as
// errors on screen: December<U+202F>31<U+202F>2026 (narrow no-break spaces, comma
// dropped) rendered as one word, and master<U+2011>plan used a non-breaking
// hyphen. Found 2026-09-23 in the Kalamazoo Ask Arthur answers. Mirrors
// ~/arthur/lib/text/clean-model-text.js.
//
// Character classes are built from code points so this file never contains the
// characters it removes (scripts/unicode-lint.mjs would flag them).
const cls = (codes: number[]) => "[" + codes.map((c) => String.fromCharCode(c)).join("") + "]";
const SPACES = new RegExp(cls([0x00a0, 0x2007, 0x2009, 0x200a, 0x202f]), "g");
const HYPHENS = new RegExp(cls([0x2010, 0x2011]), "g");
const ZERO_WIDTH = new RegExp(cls([0x200b, 0x200c, 0x200d, 0x2060, 0xfeff]), "g");
const MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December";
const DATE_NO_COMMA = new RegExp("\\b(" + MONTHS + ") (\\d{1,2}) (\\d{4})\\b", "g");

export function cleanModelText(s: string): string {
  return String(s ?? "")
    .replace(SPACES, " ")
    .replace(HYPHENS, "-")
    .replace(ZERO_WIDTH, "")
    .replace(DATE_NO_COMMA, "$1 $2, $3") // "December 31 2026" -> "December 31, 2026"
    .replace(/(\S) {2,}(?=\S)/g, "$1 ");
}

// One line for the system prompt, so the model gets it right in the first place.
export const DATE_STYLE_RULE =
  "Write dates in words with ordinary spaces and a comma, like December 31, 2026. Use plain ASCII spaces and hyphens only.";
