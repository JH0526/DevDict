import re, glob, collections

def parse_terms(path):
    """Return list of real term dicts from a seed file, plus the set of ref strings."""
    txt = open(path, encoding='utf-8').read()
    blocks = re.split(r"\n\s*\{\s*\n", txt)
    real = []
    refs = set()
    for b in blocks:
        mid = re.search(r"id:\s*'([^']*)'", b)
        men = re.search(r"en:\s*'([^']*)'", b)
        mzh = re.search(r"zh:\s*'([^']*)'", b)
        mcat = re.search(r"category:\s*'([^']*)'", b)
        # a REAL term always has a non-empty id: (pairs sub-objects have no id)
        if mid and mid.group(1) and men and mzh:
            real.append({
                'id': mid.group(1),
                'en': men.group(1).strip(),
                'zh': mzh.group(1).strip(),
                'category': mcat.group(1) if mcat else '',
                'file': path,
            })
        # collect pair/related refs (skip the term's own en/zh)
        for r in re.findall(r"(?:en|related):\s*\[?\s*'([^']*)'", b):
            refs.add(r.strip().lower())
    return real, refs

files = sorted(glob.glob('src/data/seed-*.ts'))
all_real = []
all_refs = set()
for f in files:
    real, refs = parse_terms(f)
    all_real += real
    all_refs.update(refs)

print("FILES:", len(files))
print("TOTAL_TERMS:", len(all_real))

# en uniqueness
en_map = collections.defaultdict(list)
for t in all_real:
    en_map[t['en'].lower()].append(t)
dup_en = {k:v for k,v in en_map.items() if len(v) > 1}
print("UNIQUE_EN:", len(en_map), " DUP_EN:", len(dup_en))
for k, v in sorted(dup_en.items()):
    print(f"  EN_DUP: '{k}' -> " + " | ".join(f"{x['file'].split('/')[-1]}:{x['id']}({x['zh']})" for x in v))

# zh uniqueness
zh_map = collections.defaultdict(list)
for t in all_real:
    zh_map[t['zh']].append(t)
dup_zh = {k:v for k,v in zh_map.items() if len(v) > 1}
print("UNIQUE_ZH:", len(zh_map), " DUP_ZH:", len(dup_zh))
for k, v in sorted(dup_zh.items()):
    print(f"  ZH_DUP: '{k}' -> " + " | ".join(f"{x['file'].split('/')[-1]}:{x['id']}" for x in v))

# per-category
cat = collections.Counter(t['category'] for t in all_real)
print("\n=== PER CATEGORY ===")
for k,v in sorted(cat.items(), key=lambda x:-x[1]):
    print(f"  {k}: {v}")

# ref resolution: a ref should match some real term's en (lower) OR id
real_en = {t['en'].lower() for t in all_real}
real_id = {t['id'] for t in all_real}
# the term's own en/zh are also in refs; filter those by checking membership
unresolved = sorted(r for r in all_refs if r not in real_en and r not in real_id and r != '')
print("\nUNRESOLVED_REFS (not matching any en/id):", len(unresolved))
for r in unresolved:
    print(f"  UNRESOLVED: '{r}'")
