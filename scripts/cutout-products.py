"""Strip backgrounds from product source images, write transparent PNGs.

- Pads sources with whitespace so caps/edges don't touch the canvas border
  (otherwise rembg can crop them).
- Uses `isnet-general-use` which handles translucent caps far better than u2net
  (e.g. the clear Ecover toilet-cleaner trigger cap).
"""
from io import BytesIO
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

SRC = Path(r"C:\Users\HP\Documents\SpotlessHome\Marketing\Site\assets")
DST = Path(r"c:\Users\HP\Desktop\Projects\Active\Development\spotless-homes-site\cleanerflow\public\assets\products")

JOBS = [
    ("method.jpg",        "method.png"),
    ("dawn.webp",         "dawn.png"),
    ("glassSprayway.png", "sprayway.png"),
    ("toilet.webp",       "lysol.png"),
    ("oven.webp",         "easyoff.png"),
    ("limeaway.webp",     "limeaway.png"),
    ("clorox.webp",       "clorox.png"),
    ("pink.png",          "pink.png"),
    ("wood_orange.png",   "orangeglo.png"),
]

PAD_PCT = 0.06  # 6% pad on each side

def pad_to_png_bytes(path: Path) -> bytes:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    px, py = int(w * PAD_PCT), int(h * PAD_PCT)
    canvas = Image.new("RGBA", (w + 2 * px, h + 2 * py), (255, 255, 255, 0))
    canvas.paste(img, (px, py), img if img.mode == "RGBA" else None)
    buf = BytesIO()
    canvas.save(buf, format="PNG")
    return buf.getvalue()

session = new_session("isnet-general-use")
for src_name, dst_name in JOBS:
    src, dst = SRC / src_name, DST / dst_name
    print(f"  {src_name} -> {dst_name}")
    dst.write_bytes(remove(pad_to_png_bytes(src), session=session))
print("done")
