import re, glob, io, sys, collections
sys.stdout.reconfigure(encoding='utf-8')

known = set()
cats = collections.Counter()
for f in glob.glob('src/data/seed-*.ts'):
    s = io.open(f, encoding='utf-8').read()
    known |= set(re.findall(r"^\s*en: '([^']+)',\s*$", s, re.M))
    cats.update(re.findall(r"^\s*category: '([^']+)',\s*$", s, re.M))
    for m in re.finditer(r"^\s*alias: \[([^\]]+)\]", s, re.M):
        known |= set(re.findall(r"'([^']+)'", m.group(1)))

refs = []
for f in glob.glob('src/data/seed-*.ts'):
    s = io.open(f, encoding='utf-8').read()
    refs += re.findall(r"\{ en: '([^']+)', rel:", s)
    for m in re.finditer(r"related: \[([^\]]+)\]", s):
        refs += re.findall(r"'([^']+)'", m.group(1))

miss = collections.Counter(r for r in refs if r not in known)
print('各分类条数:', dict(cats))
print('\n悬空引用（按被引用次数降序）:')
for k, v in miss.most_common():
    print(f'  {v:>3}  {k}')
