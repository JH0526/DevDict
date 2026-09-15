import re, glob, os

REWRITE = True  # apply rewrite

def get_array_content(src):
    m = re.search(r"=\s*\[", src)
    i = m.end() - 1  # index of the outer '['
    depth = 0; j = i
    n = len(src)
    while j < n:
        if src[j] == '[':
            depth += 1
        elif src[j] == ']':
            depth -= 1
            if depth == 0:
                break
        j += 1
    return src[i+1:j]

def split_objects(content):
    # top-level objects are delimited by '  },' + newline + '  {'
    parts = re.split(r"  \},\n  \{", content)
    objs = []
    for p in parts:
        p = p.strip('\n')
        if not p.strip():
            continue
        objs.append(p)
    return objs

def field(block, name):
    m = re.search(rf"{name}:\s*'([^']*)'", block)
    return m.group(1) if m else ''

files = sorted(glob.glob('src/data/seed-*.ts'))
used_en = set()
used_zh = set()
total_kept = 0
total_dropped = 0
for f in files:
    src = open(f, encoding='utf-8').read()
    content = get_array_content(src)
    objs = split_objects(content)
    header = src[:src.index('export const')]
    const_line = re.search(r"export const \w+", src).group(0)
    kept = []
    dropped = 0
    for o in objs:
        en = field(o, 'en').strip().lower()
        zh = field(o, 'zh').strip()
        tid = field(o, 'id').strip()
        if en in used_en or zh in used_zh:
            dropped += 1
            continue
        if not en or not zh:
            # keep terms that lack en/zh? should not happen; keep to be safe
            kept.append(o)
            continue
        used_en.add(en); used_zh.add(zh)
        kept.append(o)
        total_kept += 1
    total_dropped += dropped
    print(f"{os.path.basename(f):16} objs={len(objs):3} kept={len(kept):3} dropped={dropped}")
    if REWRITE and dropped > 0:
        body = ',\n'.join(kept)
        out = f"{header}{const_line}: Term[] = [\n{body}\n]\n"
        open(f, 'w', encoding='utf-8').write(out)
        print(f"   -> rewrote {f}")

print(f"\nTOTAL kept={total_kept} dropped={total_dropped}")
print(f"Original seeds 01-34 contributed first; remaining kept = new unique terms")
