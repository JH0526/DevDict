import re, glob

def parse_terms(path):
    txt = open(path, encoding='utf-8').read()
    blocks = re.split(r"\n\s*\{\s*\n", txt)
    real = {}
    refs = set()
    for b in blocks:
        mid = re.search(r"id:\s*'([^']*)'", b)
        men = re.search(r"en:\s*'([^']*)'", b)
        mzh = re.search(r"zh:\s*'([^']*)'", b)
        if men and mzh:
            real[men.group(1).strip().lower()] = (mid.group(1) if mid else '', mzh.group(1))
        # collect pair/related refs
        for r in re.findall(r"(?:en|related):\s*\[?'([^']*)'", b):
            refs.add(r.strip().lower())
    return real, refs

# existing real terms from seed-01..34
existing_real = {}
existing_refs = set()
for f in sorted(glob.glob('src/data/seed-0*.ts')) + sorted(glob.glob('src/data/seed-1*.ts')) + sorted(glob.glob('src/data/seed-2*.ts')) + sorted(glob.glob('src/data/seed-3[0-4].ts')):
    real, refs = parse_terms(f)
    existing_real.update(real)
    existing_refs.update(refs)

# seed-35 real terms
s35_real, s35_refs = parse_terms('src/data/seed-35.ts')

print("existing real term count:", len(existing_real))
print("seed-35 real term count:", len(s35_real))
print("\n=== seed-35 en colliding with EXISTING REAL terms ===")
collide = []
for en in sorted(s35_real):
    if en in existing_real:
        collide.append((en, existing_real[en]))
for en, (eid, zh) in collide:
    print(f"  COLLIDE: '{en}'  (existing id={eid}, zh={zh})")
print(f"total collisions: {len(collide)}")

print("\n=== seed-35 en colliding with EXISTING refs (may be ok) ===")
for en in sorted(s35_real):
    if en in existing_refs and en not in existing_real:
        print(f"  ref-only: '{en}'")
