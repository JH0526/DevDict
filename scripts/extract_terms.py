import re, glob, collections

files = sorted(glob.glob('src/data/seed-*.ts'))
terms = []
for f in files:
    txt = open(f, encoding='utf-8').read()
    blocks = re.split(r"\n\s*\{\s*\n", txt)
    for b in blocks:
        mid = re.search(r"id:\s*'([^']*)'", b)
        men = re.search(r"en:\s*'([^']*)'", b)
        mzh = re.search(r"zh:\s*'([^']*)'", b)
        mcat = re.search(r"category:\s*'([^']*)'", b)
        if men and mzh:
            terms.append({
                'id': mid.group(1) if mid else '',
                'en': men.group(1),
                'zh': mzh.group(1),
                'category': mcat.group(1) if mcat else '',
            })

print("TOTAL_TERMS:", len(terms))
ens = [t['en'].strip().lower() for t in terms]
zhs = [t['zh'].strip() for t in terms]
print("UNIQUE_EN:", len(set(ens)), "UNIQUE_ZH:", len(set(zhs)))
print("DUP_EN_GROUPS:", len(ens)-len(set(ens)), "DUP_ZH_GROUPS:", len(zhs)-len(set(zhs)))

cat = collections.Counter(t['category'] for t in terms)
print("\n=== PER CATEGORY ===")
for k,v in sorted(cat.items(), key=lambda x:-x[1]):
    print(f"{k}: {v}")

print("\n=== ALL EN (lower) ===")
for e in sorted(set(ens)):
    print(e)
