import io

p = 'src/data/seed-44.ts'
src = open(p, encoding='utf-8').read()
src = src.replace('  {\n{', '  {')
src = src.replace('  }\n  },', '  },')
src = src.replace('  }\n  }', '  }')
open(p, 'w', encoding='utf-8').write(src)
print('fixed seed-44')
