"""Кадрування фото фахівців по обличчю на білому тлі.

1. swiftc -O facecrop.swift -o facecrop -framework Vision -framework AppKit -framework CoreImage
2. ./facecrop <папка_масок> <фото...> > faces.json        (обличчя + маска людини, Apple Vision)
3. python3 facecrop.py <фото_папка> <маски> faces.json <вихід> [--size 176] [--k 2.5] [--cy 0.44]

Правило кадру: квадрат зі стороною k × розмір обличчя, центр обличчя на cy від верху.
Фото з прозорим тлом (вирізки платформи) композитяться за власною альфою, інші — за маскою Vision.
"""
import json, os, sys
from PIL import Image, ImageFilter

def arg(name, default):
    return type(default)(sys.argv[sys.argv.index(name) + 1]) if name in sys.argv else default

src, masks, faces_json, out = sys.argv[1:5]
SIZE, K, CY = arg("--size", 176), arg("--k", 2.5), arg("--cy", 0.44)
WHITE = (255, 255, 255)
os.makedirs(out, exist_ok=True)
for name, info in json.load(open(faces_json)).items():
    if not info["faces"]:
        print("немає обличчя:", name); continue
    im = Image.open(os.path.join(src, name)).convert("RGBA")
    alpha = im.split()[-1]
    cutout = sum(alpha.histogram()[:128]) / (im.width * im.height) > 0.05
    mask = alpha if cutout else Image.open(os.path.join(masks, name)).convert("L").resize(im.size, Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.2))
    rgb = Image.composite(im.convert("RGB"), Image.new("RGB", im.size, WHITE), mask)
    x, y, w, h = max(info["faces"], key=lambda f: f[2] * f[3])
    s = max(w, h) * K
    left, top = x + w / 2 - s / 2, y + h / 2 - CY * s
    box = (round(left), round(top), round(left + s), round(top + s))
    canvas = Image.new("RGB", (box[2] - box[0], box[3] - box[1]), WHITE)
    canvas.paste(rgb, (-box[0], -box[1]))
    canvas.resize((SIZE, SIZE), Image.LANCZOS).save(os.path.join(out, os.path.splitext(name)[0] + ".jpg"), quality=88)
    if y - 0.3 * h < 0: print("увага, зрізана маківка:", name)
