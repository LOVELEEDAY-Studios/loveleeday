// Routes the proposal "Ask Arthur" boxes through Arthur's core (the hosted arthur-ask service:
// capability gate, agent loop and a figure-by-figure claim check) instead of calling the model
// directly. Each route still builds its evidence the same way (totals computed in code); this sends
// that evidence plus the route's own rules to Arthur and returns Arthur's reply in the
// chat-completions shape the route already parses, so every route changes by one word.
//
// If Arthur's core is unreachable the original model call runs instead, and that is logged, so a
// client never loses an answer and a fallback is never silent.

type ChatMessage = { role: string; content: string };

function splitContext(user: string) {
  const m = user.match(/^CONTEXT\n([\s\S]*?)\n\nQUESTION\n([\s\S]*)$/);
  return m ? { evidence: m[1], question: m[2] } : null;
}

export async function arthurFetch(api: string, init: RequestInit): Promise<Response> {
  const url = process.env.ARTHUR_ASK_URL;
  const token = process.env.ARTHUR_ASK_TOKEN;
  try {
    const body = JSON.parse(String(init.body ?? "{}"));
    const messages: ChatMessage[] = body.messages ?? [];
    const system = messages.find((m) => m.role === "system")?.content ?? "";
    const parts = splitContext(messages.find((m) => m.role === "user")?.content ?? "");
    if (url && token && parts) {
      const res = await fetch(`${url}/ask`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ question: parts.question, evidence: parts.evidence, instructions: system }),
        signal: AbortSignal.timeout(45_000),
      });
      if (res.ok) {
        const r = await res.json();
        if (r.status === "completed" && r.answer) {
          console.log(`arthur-core answered (${r.elapsedMs}ms, figures supported ${r.supportedRatio ?? "n/a"})`);
          return new Response(JSON.stringify({ choices: [{ message: { content: r.answer } }], arthur: { claims: r.claims, supportedRatio: r.supportedRatio } }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
        console.error("arthur-core: not completed, falling back to model call", r.status, r.reason);
      } else {
        console.error("arthur-core: HTTP", res.status, "falling back to model call");
      }
    } else if (!url || !token) {
      console.error("arthur-core: ARTHUR_ASK_URL/ARTHUR_ASK_TOKEN not set, falling back to model call");
    }
  } catch (e) {
    console.error("arthur-core: unreachable, falling back to model call", (e as Error).message);
  }
  return fetch(api, init);
}
