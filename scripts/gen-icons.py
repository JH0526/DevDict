"""生成 PWA 图标（纯 Python，无第三方依赖）+ 桌面端 .ico"""
import struct, zlib, os
from PIL import Image

def png(path, size, bg=(79, 70, 229), fg=(255, 255, 255)):
    """纯 Python 生成带 "D" 字 logo 的圆角 PNG"""
    r = size // 2
    rows = []
    for y in range(size):
        row = bytearray()
        for x in range(size):
            # 圆角外透明，内 indigo；中间画一个白色"D"形（矩形 + 右侧半圆）
            cx, cy = size / 2, size / 2
            corner = size * 0.18
            inside = True
            for (px, py) in ((x, y), (x + 1, y), (x, y + 1), (x + 1, y + 1)):
                dx = max(corner - px, px - (size - corner), 0)
                dy = max(corner - py, py - (size - corner), 0)
                if dx and dy and (dx * dx + dy * dy) > corner * corner:
                    inside = False
            if not inside:
                row += bytes((0, 0, 0, 0))
                continue
            # D 形
            in_d = False
            if size * 0.30 <= x <= size * 0.44 and size * 0.28 <= y <= size * 0.72:
                in_d = True
            if size * 0.28 <= y <= size * 0.72:
                dxr = x - size * 0.44
                dyr = (y - cy) / (size * 0.22)
                if 0 <= dxr and dxr * dxr / ((size * 0.20) ** 2) + dyr * dyr <= 1:
                    in_d = True
                dxr2 = x - size * 0.52
                dyr2 = (y - cy) / (size * 0.12)
                if dxr2 >= 0 and dxr2 * dxr2 / ((size * 0.10) ** 2) + dyr2 * dyr2 <= 1:
                    in_d = False
            if size * 0.28 <= y <= size * 0.34 or size * 0.66 <= y <= size * 0.72:
                if size * 0.30 <= x <= size * 0.44:
                    in_d = True
            row += bytes(fg + (255,)) if in_d else bytes(bg + (255,))
        rows.append(bytes(row))

    raw = b''.join(b'\x00' + r_ for r_ in rows)

    def chunk(t, d):
        c = t + d
        return struct.pack('>I', len(d)) + c + struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)

    ihdr = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    data = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(data)
    print('wrote', path, size)


def ico(src_png, dst_ico):
    """从 PNG 生成多尺寸 ICO（用于 Windows）"""
    img = Image.open(src_png)
    img.save(dst_ico, format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
    print('wrote', dst_ico)


# 1) PWA icons → public/
public_dir = os.path.join(os.path.dirname(__file__), '..', 'public')
os.makedirs(public_dir, exist_ok=True)
png(os.path.join(public_dir, 'icon-192.png'), 192)
png(os.path.join(public_dir, 'icon-512.png'), 512)

# 2) Desktop icons → build/（给 electron-builder 用）
build_dir = os.path.join(os.path.dirname(__file__), '..', 'build')
os.makedirs(build_dir, exist_ok=True)
# 直接复制 512 给 .png（Linux / electron 默认）
import shutil
shutil.copy(os.path.join(public_dir, 'icon-512.png'), os.path.join(build_dir, 'icon.png'))
# 转 ICO（Windows）
ico(os.path.join(public_dir, 'icon-512.png'), os.path.join(build_dir, 'icon.ico'))
