from pathlib import Path
from PIL import Image, ImageDraw

out = Path(r"C:\Users\felix\showup\public\icons")
out.mkdir(parents=True, exist_ok=True)


def icon(size: int, maskable: bool = False) -> Image.Image:
    img = Image.new("RGB", (size, size), "#0c100b")
    d = ImageDraw.Draw(img)
    pad = int(size * (0.22 if maskable else 0.18))
    d.ellipse((pad, pad, size - pad, size - pad), fill="#dffc3a")
    cx = cy = size // 2
    inner = int(size * (0.38 if maskable else 0.36))
    d.ellipse((cx - inner, cy - inner, cx + inner, cy + inner), fill="#0c100b")
    mid = int(size * (0.22 if maskable else 0.20))
    d.ellipse((cx - mid, cy - mid, cx + mid, cy + mid), fill="#dffc3a")
    core = int(size * (0.12 if maskable else 0.11))
    d.ellipse((cx - core, cy - core, cx + core, cy + core), fill="#0c100b")
    return img


icon(192).save(out / "icon-192.png", "PNG")
icon(512).save(out / "icon-512.png", "PNG")
icon(192, maskable=True).save(out / "icon-maskable-192.png", "PNG")
icon(512, maskable=True).save(out / "icon-maskable-512.png", "PNG")
icon(180).save(out / "apple-touch-icon.png", "PNG")
icon(180).save(Path(r"C:\Users\felix\showup\public\apple-touch-icon.png"), "PNG")
print("wrote", list(out.iterdir()))
