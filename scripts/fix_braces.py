import sys

for p in sys.argv[1:]:
    src = open(p, encoding='utf-8').read()
    # collapse double-brace corruption: '  {\n{' -> '  {' ; '  }\n  },' -> '  },' ; '  }\n  }' -> '  }'
    src = src.replace('  {\n{', '  {')
    src = src.replace('  }\n  },', '  },')
    src = src.replace('  }\n  }', '  }')
    open(p, 'w', encoding='utf-8').write(src)
    print('fixed', p)
