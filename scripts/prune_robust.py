import re, os, glob, sys

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

def load_terms(path):
    src = open(path, encoding='utf-8').read()
    out = []
    for o in extract_objects(get_array_content(src)):
        tid = field(o, 'id').strip()
        en = field(o, 'en').strip()
        zh = field(o, 'zh').strip()
        if tid and en and zh:
            out.append({'id': tid, 'en': en, 'zh': zh, 'block': o})
    return src, out

target = sys.argv[1] if len(sys.argv) > 1 else 'src/data/seed-43.ts'
all_files = sorted(glob.glob('src/data/seed-*.ts'))

# baseline = every other seed file
used_en = set(); used_zh = set()
for f in all_files:
    if os.path.abspath(f) == os.path.abspath(target):
        continue
    _, terms = load_terms(f)
    for t in terms:
        used_en.add(t['en'].lower()); used_zh.add(t['zh'])

# rewrite target, dropping terms that collide with baseline (keep originals)
src, terms = load_terms(target)
kept = []; dropped = 0
for t in terms:
    if t['en'].lower() in used_en or t['zh'] in used_zh:
        dropped += 1
        continue
    kept.append(t)
    used_en.add(t['en'].lower()); used_zh.add(t['zh'])

const_name = re.search(r"export const (\w+)", src).group(1)
hi = src.index('export const')
header = src[:hi].rstrip('\n')
out = [header, '', f"export const {const_name}: Term[] = ["]
for idx, t in enumerate(kept):
    out.append("  {")
    for line in t['block'].split('\n'):
        out.append(line)
    out.append("  }" + ("," if idx < len(kept) - 1 else ""))
out.append("]")
open(target, 'w', encoding='utf-8').write("\n".join(out) + "\n")
print(f"{os.path.basename(target)}: kept={len(kept)} dropped={dropped}  (collisions removed, originals kept)")
