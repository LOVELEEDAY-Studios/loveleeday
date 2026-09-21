"""The one place a figure about the system may come from.

Every number on these pages describes the ontology, so every number is read
from the ontology at build time. It used to be typed, and within hours of
being typed five of the ticker's eleven fields were wrong -- OBSERVATIONS
said 538 against a real 1,655 and SOURCES said 4 against 7 -- because
connecting a source changes the numbers and nothing tells the page.

The ticker was moved onto this reader first. The stat panels beside it and the
whole firm-concept set were not, so they went on printing 41 objects against a
real 159 and 538 observations against 1,655, three and four times out. A site
whose argument is that evidence beats claims cannot publish figures that no
longer trace to anything -- and it cannot fix that one component at a time.

So the reader lives here and both builds import it. A typed figure in either
build is now a diff, not an oversight nobody can see.
"""

import json
import pathlib
import subprocess

_QUERY = r"""
import('%s/lib/ontology/index.mjs').then(O=>{const db=O.open();
  const q=s=>db.prepare(s).get();
  console.log(JSON.stringify({
    objects: q('select count(*) n from onto_objects').n,
    props:   q('select count(*) n from onto_props').n,
    live:    q('select count(*) n from onto_props where superseded_by is null').n,
    nolin:   q('select count(*) n from onto_props where source_system is null or source_ref is null').n,
    srcs:    db.prepare('select distinct source_system s from onto_props order by 1').all().map(r=>r.s),
    oldest:  q('select min(valid_from) v from onto_props').v,
    last:    q('select max(observed_at) v from onto_props').v,
    watches: q('select count(*) n from onto_watches').n,
    fired:   q('select count(*) n from onto_firings').n}));})
"""

# Measured rather than read from the ontology: these describe the practice, not
# the system it sells. They are asserted here so that the two builds cannot
# disagree about them, and so the next person can see that they are asserted.
SITES_MEASURED = "38"
REBUILDS = "6"

_cache = None


def read_store():
    """Return the live figures, or stop the build. Never returns typed values."""
    global _cache
    if _cache is not None:
        return _cache

    home = str(pathlib.Path.home() / 'arthur')
    out = subprocess.run(['node', '-e', _QUERY % home],
                         capture_output=True, text=True, cwd=home, timeout=60)
    if out.returncode != 0 or not out.stdout.strip():
        raise SystemExit('BUILD STOPPED: could not read the ontology for the figures.\n'
                         'Publishing typed figures is how the band went stale before.\n'
                         + (out.stderr or '')[:400])
    d = json.loads(out.stdout)

    # An unreadable store was never the real risk: open() CREATES the database
    # if it is missing, so a wiped store returns a clean, well-formed set of
    # ZEROS and the build happily publishes "OBSERVATIONS 0". Verified by moving
    # the file aside -- the first version of this guard passed. Assert the shape
    # of a live store, not merely that a query answered.
    if d['objects'] < 1 or d['props'] < 1 or not d['srcs']:
        raise SystemExit(
            'BUILD STOPPED: the ontology answered but is EMPTY '
            f"(objects={d['objects']}, observations={d['props']}, sources={len(d['srcs'])}).\n"
            'open() creates a fresh database when the file is missing, so this is what a\n'
            'wiped or mis-pathed store looks like. Publishing zeros would claim the system\n'
            'is live and prove the opposite.')
    if d['nolin']:
        raise SystemExit(
            f"BUILD STOPPED: {d['nolin']} observation(s) carry no lineage. The pages claim\n"
            '100% lineage cover; it may not be printed while that is untrue.')

    d['sources'] = len(d['srcs'])
    d['cover'] = '100%' if d['nolin'] == 0 else f"{100*(d['props']-d['nolin'])//d['props']}%"
    _cache = d
    return d


def live_ticker():
    """The running band: everything the store can prove about itself."""
    d = read_store()
    return [("OBJECTS", f"{d['objects']:,}", ""),
            ("OBSERVATIONS", f"{d['props']:,}", ""),
            ("IN FORCE", f"{d['live']:,}", ""),
            ("SOURCES", str(d['sources']), ""),
            ("LINEAGE COVER", d['cover'], ""),
            ("WITHOUT LINEAGE", str(d['nolin']), ""),
            ("STANDING CONDITIONS", str(d['watches']), ""),
            ("FIRED", str(d['fired']), ""),
            ("SITES MEASURED", SITES_MEASURED, ""),
            ("REBUILDS", REBUILDS, ""),
            ("OLDEST OBSERVATION", str(d['oldest'])[:10], ""),
            ("LAST WRITE", str(d['last'])[:10], ""),
            ("SOURCE SYSTEMS", " · ".join(d['srcs']), "")]


def live_stats():
    """The four panels: the same four claims, read rather than asserted.

    'Records from four systems' was written when there were four. Naming the
    count in prose is the same failure as naming it in the figure, so the
    sentence now counts them too.
    """
    d = read_store()
    return [("OBJ", f"{d['objects']:,}", "Objects resolved",
             f"Records from {d['sources']} source systems collapsed onto single objects."),
            ("OBS", f"{d['props']:,}", "Property observations",
             "Each carrying its source system and source reference."),
            ("SRC", str(d['sources']), "Live source systems",
             "Coverage is exactly as wide as what is connected."),
            ("UNV", str(d['nolin']), "Unverified values",
             "A write without lineage is refused at the path.")]
