#!/usr/bin/env python3
"""Контуры стран для карты на S3: из tools/geo/<ISO3>.geo.json (johan/world.geo.json, 1:110m)
→ tools/geo/<код страны>.json: SVG-path в viewBox 800×450, параметры проекции для JS и точки крупных городов."""
import json, math, os
HERE = os.path.dirname(os.path.abspath(__file__))
W, H, PAD = 800, 450, 0.06
CITIES = {
    "UA": [[50.45, 30.52], [49.84, 24.03], [46.48, 30.73], [49.99, 36.23], [48.46, 35.05], [49.23, 28.47], [51.50, 31.29], [48.62, 22.29], [49.59, 34.55], [48.92, 24.71], [47.84, 35.14], [46.97, 32.00]],
    "US": [[40.71, -74.01], [34.05, -118.24], [41.88, -87.63], [29.76, -95.37], [33.45, -112.07], [25.76, -80.19], [47.61, -122.33], [39.74, -104.99], [33.75, -84.39], [42.36, -71.06], [32.78, -96.80], [44.98, -93.27]],
}
def rings_of(iso3):
    g = json.load(open(f"{HERE}/geo/{iso3}.geo.json"))["features"][0]["geometry"]
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    return [p[0] for p in polys]
def contiguous(r):  # для США — только материковая часть
    lon = sum(x for x, y in r) / len(r); lat = sum(y for x, y in r) / len(r)
    return -126 < lon < -66 and 24 < lat < 50
def build(code, iso3, keep=None):
    rings = [r for r in rings_of(iso3) if not keep or keep(r)]
    lons = [x for r in rings for x, y in r]; lats = [y for r in rings for x, y in r]
    minLon, maxLon, minLat, maxLat = min(lons), max(lons), min(lats), max(lats)
    c = math.cos(math.radians((minLat + maxLat) / 2)); w = (maxLon - minLon) * c; h = maxLat - minLat
    k = min(W * (1 - 2 * PAD) / w, H * (1 - 2 * PAD) / h); kx, ky = k * c, k
    ox, oy = (W - w * k) / 2, (H - h * k) / 2
    xy = lambda lon, lat: (round(ox + (lon - minLon) * kx, 1), round(oy + (maxLat - lat) * ky, 1))
    d = "".join("M" + "L".join("%g %g" % xy(x, y) for x, y in r) + "Z" for r in rings)
    out = {"path": d, "proj": [round(minLon, 4), round(maxLat, 4), round(kx, 4), round(ky, 4), round(ox, 1), round(oy, 1)], "cities": CITIES[code]}
    json.dump(out, open(f"{HERE}/geo/{code}.json", "w"), ensure_ascii=False, separators=(",", ":"))
    print(code, "rings", len(rings), "points", sum(len(r) for r in rings), "path", len(d), "chars; bbox lon", round(minLon, 2), round(maxLon, 2), "lat", round(minLat, 2), round(maxLat, 2))
build("UA", "UKR"); build("US", "USA", contiguous)
