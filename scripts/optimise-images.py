"""
Losslessly recompress the PNGs in public/img/.

The renders in that folder are proof rather than decoration: they are drawn
headlessly from the real registry sources, and CLAUDE.md forbids hand-editing
them for that reason. This does not edit them. It re-encodes the SAME pixels
with a better deflate setting, and refuses to write a file whose decoded pixels
are not byte-identical to the original.

    python scripts/optimise-images.py          # report only
    python scripts/optimise-images.py --write  # actually rewrite

The verification is the point. A "compressor" that silently quantised these
would make the site show something the CLI does not install.
"""
import sys
import glob
import os
from io import BytesIO
from PIL import Image

WRITE = '--write' in sys.argv
total_before = 0
total_after = 0
rows = []

for path in sorted(glob.glob('public/img/*.png')):
    before = os.path.getsize(path)
    original = Image.open(path)
    original.load()
    mode, size = original.mode, original.size
    pixels_before = original.tobytes()

    buf = BytesIO()
    original.save(buf, format='PNG', optimize=True, compress_level=9)
    after = buf.tell()

    # Decode what we just encoded and compare pixel for pixel.
    buf.seek(0)
    roundtrip = Image.open(buf)
    roundtrip.load()
    identical = (
        roundtrip.tobytes() == pixels_before
        and roundtrip.mode == mode
        and roundtrip.size == size
    )

    total_before += before
    total_after += after if identical and after < before else before

    status = 'IDENTICAL' if identical else 'PIXELS DIFFER, SKIPPED'
    saved = before - after
    rows.append((os.path.basename(path), before, after, saved, status))

    if WRITE and identical and after < before:
        buf.seek(0)
        with open(path, 'wb') as f:
            f.write(buf.read())

print('%-26s %9s %9s %8s  %s' % ('file', 'before', 'after', 'saved', 'check'))
for name, b, a, s, st in rows:
    print('%-26s %8.1fK %8.1fK %7.1fK  %s' % (name, b / 1024, a / 1024, s / 1024, st))

pct = (total_before - total_after) / total_before * 100 if total_before else 0
print('\ntotal %.1fK -> %.1fK  (%.1f%% smaller)' % (
    total_before / 1024, total_after / 1024, pct))
print('mode:', 'WRITTEN' if WRITE else 'report only, pass --write to apply')
