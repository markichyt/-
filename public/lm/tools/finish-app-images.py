#!/usr/bin/env python3
"""Из tools/_capture/app-<loc>.png делает assets/app/question-<loc>.jpg|webp.
Для uk американский флаг у логотипа в таб-баре (в демо он зашит в картинку) закрывается украинским."""
import os
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
FLAG_BOX = (447, 1824, 486, 1853)  # координаты флага в снимке 844×1912
def ua_flag(box):
    w, h = box[2] - box[0], box[3] - box[1]
    f = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(f)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=3, fill=(0, 91, 187, 255))
    d.rounded_rectangle((0, h // 2, w - 1, h - 1), radius=3, fill=(255, 213, 0, 255)); d.rectangle((0, h // 2, w - 1, h // 2 + 3), fill=(255, 213, 0, 255))
    return f
for loc in ("uk", "en"):
    src = f"{HERE}/_capture/app-{loc}.png"
    if not os.path.exists(src): print("нет", src); continue
    im = Image.open(src).convert("RGB")
    if loc == "uk":
        ImageDraw.Draw(im).rectangle((FLAG_BOX[0] - 1, FLAG_BOX[1] - 1, FLAG_BOX[2] + 1, FLAG_BOX[3] + 1), fill=(255, 255, 255))
        im.paste(ua_flag(FLAG_BOX), FLAG_BOX[:2], ua_flag(FLAG_BOX))
    im.save(f"{ROOT}/assets/app/question-{loc}.jpg", "JPEG", quality=84, optimize=True, progressive=True)
    im.save(f"{ROOT}/assets/app/question-{loc}.webp", "WEBP", quality=82, method=6)
    print(loc, im.size, os.path.getsize(f"{ROOT}/assets/app/question-{loc}.webp") // 1024, "KB webp")
