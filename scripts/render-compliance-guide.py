"""Renders data/compliance/registry/registry.json into COMPLIANCE.md: how
LOVELEEDAY becomes compliant, industry by industry, and the state-by-state
matrix. Generated, never hand-edited: re-run after build-compliance-registry.py.

  python3 scripts/render-compliance-guide.py
"""
import json
from pathlib import Path

DIR = Path(__file__).resolve().parent.parent / "data/compliance/registry"
reg = json.loads((DIR / "registry.json").read_text())
items = reg["items"]

INDUSTRIES = [
    ("education", "Schools and education"),
    ("local-government", "Local government"),
    ("nonprofit", "Nonprofits and community organizations"),
    ("hospitality", "Hospitality and experiences"),
    ("retail", "Retail and commerce"),
    ("manufacturing", "Manufacturing and distribution"),
    ("professional-services", "Professional services"),
    ("property", "Property and facilities"),
    ("portfolios", "Groups and portfolios"),
    ("health", "Health data (any client)"),
]


def mark(i):
    return "verified" if i.get("verified") else "UNVERIFIED"


frameworks = [i for i in items if i.get("how_to_comply") is not None or i.get("jurisdiction") == "US"]
out = [
    "# How LOVELEEDAY becomes compliant",
    "",
    f"Generated {reg['generated']} from `registry.json` by `scripts/render-compliance-guide.py`. "
    f"{reg['summary']['items']} requirements, {reg['summary']['verified']} verified against the official "
    "source. Every line traces to a `source_url` in the registry. This is a research register, not legal advice. "
    "Confirm with counsel before relying on it for a contract or bid.",
    "",
    "## By industry",
]
for key, label in INDUSTRIES:
    rel = [i for i in frameworks if key in (i.get("industries") or [])]
    if not rel:
        continue
    out += ["", f"### {label}", ""]
    for i in rel:
        out.append(f"#### {i['title']} ({i.get('citation') or 'n/a'}), {mark(i)}")
        if i.get("triggered_when"):
            out.append(f"- **Applies when:** {i['triggered_when']}")
        if i.get("not_triggered_when"):
            out.append(f"- **Staying out of scope:** {i['not_triggered_when']}")
        if i.get("attestation"):
            out.append(f"- **What a buyer will ask for:** {i['attestation']}")
        if i.get("effort"):
            out.append(f"- **Effort:** {i['effort']}")
        steps = i.get("how_to_comply") or []
        if steps:
            out.append("- **How we comply:**")
            for n, s in enumerate(steps, 1):
                txt = s["step"] if isinstance(s, dict) else str(s)
                out.append(f"  {n}. {txt}")
        out.append(f"- Source: {i['source_url']}")
        out.append("")

all_ind = [i for i in frameworks if "all" in (i.get("industries") or []) and i.get("jurisdiction") == "US"]
if all_ind:
    out += ["### Every industry (baseline)", ""]
    for i in all_ind:
        out.append(f"- **{i['title']}**, {mark(i)}: {i.get('attestation') or ''} ({i['source_url']})")

out += [
    "",
    "## State by state",
    "",
    "What applies to LOVELEEDAY as a vendor holding a client's data. **no law** means the research found "
    "no statute of that kind, and the registry item records what was checked.",
    "",
    "| State | Breach notification: vendor duty | Student-data privacy | Consumer privacy (processor duties) |",
    "|---|---|---|---|",
]
states = sorted({i["jurisdiction"] for i in items if i.get("level") == "state" and i["jurisdiction"] != "US"})


def cell(i):
    if not i:
        return "n/a"
    if i.get("exists") is False:
        return "no law"
    deadline = i.get("notice_deadline")
    tail = f"; {deadline}" if deadline and i["domain"] == "breach-notification" else ""
    return f"{i.get('citation')}{tail}{'' if i.get('verified') else ' (UNVERIFIED)'}".replace("|", "/")


for s in states:
    get = lambda d: next((i for i in items if i["jurisdiction"] == s and i["domain"] == d and "bipa" not in i["id"] and "shield" not in i["id"] and "201-cmr" not in i["id"]), None)
    out.append(f"| {s.removeprefix('US-')} | {cell(get('breach-notification'))} | {cell(get('student-privacy'))} | {cell(get('consumer-privacy'))} |")

extras = [i for i in items if i.get("level") == "state" and any(k in i["id"] for k in ("bipa", "shield", "201-cmr", "health"))]
if extras:
    out += ["", "**Additional state laws in the registry:** " + "; ".join(f"{i['jurisdiction'].removeprefix('US-')}: {i['title']} ({i.get('citation')})" for i in extras)]

open_items = [i["id"] for i in items if i.get("exists", True) and not i.get("verified")]
out += ["", "## Open verification items", "", "Laws that exist but whose official text could not yet be read: " + (", ".join(open_items) or "none") + "."]
(DIR / "COMPLIANCE.md").write_text("\n".join(out) + "\n")
print(f"wrote COMPLIANCE.md: {len(out)} lines, {len(states)} jurisdictions")
