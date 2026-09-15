import re, glob, os, collections

def get_array_content(src):
    m = re.search(r"=\s*\[", src)
    i = m.end() - 1
    depth = 0; j = i; n = len(src)
    while j < n:
        if src[j] == '[':
            depth += 1
        elif src[j] == ']':
            depth -= 1
            if depth == 0:
                break
        j += 1
    return src[i+1:j]

def extract_objects(content):
    """Brace-match top-level {...} objects inside the array content."""
    objs = []
    k = 0; L = len(content)
    while k < L:
        while k < L and content[k] in ' \t\r\n':
            k += 1
        if k >= L:
            break
        if content[k] == '{':
            d = 0; start = k
            while k < L:
                c = content[k]
                if c == '{':
                    d += 1
                elif c == '}':
                    d -= 1
                    if d == 0:
                        objs.append(content[start:k+1])
                        k += 1
                        break
                k += 1
        else:
            k += 1
    return objs

def field(block, name):
    m = re.search(rf"{name}:\s*'([^']*)'", block)
    return m.group(1) if m else ''

files = sorted(glob.glob('src/data/seed-*.ts'))
all_real = []
for f in files:
    src = open(f, encoding='utf-8').read()
    for o in extract_objects(get_array_content(src)):
        tid = field(o, 'id').strip()
        en = field(o, 'en').strip()
        zh = field(o, 'zh').strip()
        cat = field(o, 'category').strip()
        if tid and en and zh:
            all_real.append({'id': tid, 'en': en, 'zh': zh, 'category': cat, 'file': os.path.basename(f)})

print("TOTAL_TERMS:", len(all_real))
en_map = collections.defaultdict(list)
zh_map = collections.defaultdict(list)
for t in all_real:
    en_map[t['en'].lower()].append(t)
    zh_map[t['zh']].append(t)
dup_en = {k:v for k,v in en_map.items() if len(v)>1}
dup_zh = {k:v for k,v in zh_map.items() if len(v)>1}
print("UNIQUE_EN:", len(en_map), "DUP_EN:", len(dup_en))
print("UNIQUE_ZH:", len(zh_map), "DUP_ZH:", len(dup_zh))
for k,v in sorted(dup_en.items()):
    print("  EN_DUP:", k, "->", " | ".join(f"{x['file']}:{x['id']}" for x in v))
for k,v in sorted(dup_zh.items()):
    print("  ZH_DUP:", k, "->", " | ".join(f"{x['file']}:{x['id']}" for x in v))
cat = collections.Counter(t['category'] for t in all_real)
print("\n=== PER CATEGORY ===")
for k,vv in sorted(cat.items(), key=lambda x:-x[1]):
    print(f"  {k}: {vv}")
