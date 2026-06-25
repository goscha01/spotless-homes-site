"""Generate Spotless Homes favicon set: serif 'S' on brand yellow."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

PUB = Path(r"c:\Users\HP\Desktop\Projects\Active\Development\spotless-homes-site\cleanerflow\public")
YELLOW = (0xF2, 0xC3, 0x1B, 255)
BLACK = (0x0A, 0x0A, 0x0A, 255)

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\georgiab.ttf",  # Georgia Bold — solid serif, ships with Windows
    r"C:\Windows\Fonts\timesbd.ttf",
    r"C:\Windows\Fonts\georgia.ttf",
    r"C:\Windows\Fonts\times.ttf",
]

def pick_font(size: int) -> ImageFont.FreeTypeFont:
    for p in FONT_CANDIDATES:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def render(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # rounded-square yellow tile (looks better than full bleed in browser tab corners)
    radius = max(2, size // 6)
    d.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=radius, fill=YELLOW)
    # centered S
    font = pick_font(int(size * 0.78))
    bbox = d.textbbox((0, 0), "S", font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) // 2 - bbox[0]
    y = (size - th) // 2 - bbox[1]
    d.text((x, y), "S", font=font, fill=BLACK)
    return img

# Master + per-size PNGs
master = render(512)
master.save(PUB / "apple-touch-icon.png")  # 180 used by iOS, master is fine
render(180).save(PUB / "apple-touch-icon.png")
render(32).save(PUB / "favicon-32x32.png")
render(16).save(PUB / "favicon-16x16.png")

# Multi-res ICO (16/32/48)
ico_sizes = [(16, 16), (32, 32), (48, 48)]
master.save(PUB / "favicon.ico", sizes=ico_sizes)

print("wrote:", *[p.name for p in (
    PUB / "favicon.ico",
    PUB / "favicon-16x16.png",
    PUB / "favicon-32x32.png",
    PUB / "apple-touch-icon.png",
)])
