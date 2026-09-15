import re, os

FILES = ['src/data/seed-36.ts','src/data/seed-37.ts','src/data/seed-38.ts',
         'src/data/seed-39.ts','src/data/seed-40.ts','src/data/seed-41.ts','src/data/seed-42.ts']

def repair(path):
    src = open(path, encoding='utf-8').read()
    hi = src.index('export const')
    header = src[:hi]
    m = re.search(r"=\s*\[", src)
    ai = m.end() - 1  # index of '['
    depth = 0; j = ai; n = len(src)
    while j < n:
        if src[j] == '[':
            depth += 1
        elif src[j] == ']':
            depth -= 1
            if depth == 0:
                break
        j += 1
    body = src[ai+1:j]  # between [ and ]
    pieces = re.split(r"(?=\n\s*id:\s*')", body)
    objs = []
    for p in pieces:
        if "id: '" not in p:
            continue
        p = p.strip('\n')
        p = p.rstrip()
        # strip trailing commas and a stray closing brace (handles '],', '],,', '...]  }')
        while p.endswith(',') or p.endswith('}'):
            p = p[:-1].rstrip()
        if not p:
            continue
        objs.append(p)
    const_name = re.search(r"export const (\w+)", src).group(1)
    out = [header.rstrip('\n'), '', f"export const {const_name}: Term[] = ["]
    for idx, o in enumerate(objs):
        out.append("  {")
        for line in o.split('\n'):
            out.append(line)
        out.append("  }" + ("," if idx < len(objs) - 1 else ""))
    out.append("]")
    open(path, 'w', encoding='utf-8').write("\n".join(out) + "\n")
    print(f"{os.path.basename(path)}: {len(objs)} objects repaired")

for f in FILES:
    repair(f)
