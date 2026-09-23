#!/usr/bin/env python3
"""Контуры стран для карты на S3.
Вход: tools/geo/countries.geo.json (johan/world.geo.json, Natural Earth 1:110m, id = ISO3).
Выход: assets/geo/<ISO2>.json — контур страны в viewBox 800×450 (path, проекция для JS, для домашних стран — точки крупных
городов) и assets/geo/world.json — карта мира (упрощённая) для стран, контура которых нет. build.py кладёт UA/US в QUIZ_LOCALE.geo,
остальные страницы подгружают по требованию."""
import json, math, os
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(ROOT, "assets", "geo")
W, H, PAD = 800, 450, 0.06
ISO = {"UKR": "UA", "USA": "US", "POL": "PL", "DEU": "DE", "CZE": "CZ", "GBR": "GB", "ITA": "IT", "ESP": "ES", "FRA": "FR", "CAN": "CA", "ISR": "IL", "TUR": "TR",
       "MDA": "MD", "ROU": "RO", "NLD": "NL", "AUT": "AT", "CHE": "CH", "PRT": "PT", "LTU": "LT", "LVA": "LV", "EST": "EE", "SVK": "SK", "HUN": "HU", "BGR": "BG",
       "GRC": "GR", "IRL": "IE", "BEL": "BE", "SWE": "SE", "NOR": "NO", "DNK": "DK", "FIN": "FI", "AUS": "AU", "ARE": "AE", "GEO": "GE", "KAZ": "KZ", "CYP": "CY",
       "MEX": "MX", "BRA": "BR", "ARG": "AR", "JPN": "JP", "KOR": "KR", "IND": "IN", "CHN": "CN", "ZAF": "ZA", "EGY": "EG", "NZL": "NZ", "SRB": "RS", "HRV": "HR",
       "SVN": "SI", "BIH": "BA", "MNE": "ME", "MKD": "MK", "ALB": "AL", "BLR": "BY", "ARM": "AM", "AZE": "AZ", "UZB": "UZ", "KGZ": "KG", "TJK": "TJ", "TKM": "TM",
       "MNG": "MN", "IDN": "ID", "THA": "TH", "VNM": "VN", "PHL": "PH", "MYS": "MY", "SAU": "SA", "QAT": "QA", "KWT": "KW", "JOR": "JO", "LBN": "LB", "MAR": "MA",
       "TUN": "TN", "DZA": "DZ", "NGA": "NG", "KEN": "KE", "ETH": "ET", "CHL": "CL", "COL": "CO", "PER": "PE", "VEN": "VE", "URY": "UY", "ECU": "EC", "BOL": "BO",
       "PRY": "PY", "CUB": "CU", "DOM": "DO", "ISL": "IS", "LUX": "LU", "OMN": "OM", "IRQ": "IQ", "IRN": "IR", "PAK": "PK", "BGD": "BD", "LKA": "LK", "NPL": "NP",
       "GHA": "GH", "SEN": "SN", "TZA": "TZ", "UGA": "UG", "CMR": "CM", "CIV": "CI", "MOZ": "MZ", "AGO": "AO", "NAM": "NA", "BWA": "BW", "ZMB": "ZM", "ZWE": "ZW",
       "GTM": "GT", "CRI": "CR", "PAN": "PA", "HND": "HN", "NIC": "NI", "SLV": "SV", "JAM": "JM", "TTO": "TT", "GUY": "GY", "SUR": "SR", "PRI": "PR", "KHM": "KH",
       "LAO": "LA", "MMR": "MM", "PRK": "KP", "TWN": "TW", "AFG": "AF", "SYR": "SY", "YEM": "YE", "LBY": "LY", "SDN": "SD", "MLI": "ML", "NER": "NE", "TCD": "TD",
       "SOM": "SO", "MDG": "MG", "PNG": "PG", "FJI": "FJ", "RUS": "RU", "GRL": "GL", "XKX": "XK", "KOS": "XK"}
KEEP_ALL = {"CAN", "AUS", "IDN", "PHL", "JPN", "NZL", "GBR", "GRC", "HRV", "DNK", "ITA", "MYS", "CHL", "PNG", "FJI", "RUS", "GRL", "PRI", "TTO", "JAM", "CUB", "DOM"}
CITIES = {"UA": [[50.45, 30.52], [49.84, 24.03], [46.48, 30.73], [49.99, 36.23], [48.46, 35.05], [49.23, 28.47], [51.50, 31.29], [48.62, 22.29], [49.59, 34.55], [48.92, 24.71], [47.84, 35.14], [46.97, 32.00]],
          "US": [[40.71, -74.01], [34.05, -118.24], [41.88, -87.63], [29.76, -95.37], [33.45, -112.07], [25.76, -80.19], [47.61, -122.33], [39.74, -104.99], [33.75, -84.39], [42.36, -71.06], [32.78, -96.80], [44.98, -93.27]]}
def rings_of(geom):
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    return [p[0] for p in polys]
def centroid(r): return sum(x for x, y in r) / len(r), sum(y for x, y in r) / len(r)
def bbox_area(r):
    xs = [x for x, y in r]; ys = [y for x, y in r]; return (max(xs) - min(xs)) * (max(ys) - min(ys))
def country_rings(iso3, geom):
    rings = rings_of(geom)
    if iso3 in KEEP_ALL or len(rings) == 1: return rings
    main = max(rings, key=bbox_area); cx, cy = centroid(main)
    return [r for r in rings if abs(centroid(r)[0] - cx) <= 8 and abs(centroid(r)[1] - cy) <= 10]
def fit(rings):
    lons = [x for r in rings for x, y in r]; lats = [y for r in rings for x, y in r]
    minLon, maxLon, minLat, maxLat = min(lons), max(lons), min(lats), max(lats)
    c = math.cos(math.radians((minLat + maxLat) / 2)); w = (maxLon - minLon) * c; h = maxLat - minLat
    k = min(W * (1 - 2 * PAD) / w, H * (1 - 2 * PAD) / h); kx, ky = k * c, k
    ox, oy = (W - w * k) / 2, (H - h * k) / 2
    return lambda lon, lat: (round(ox + (lon - minLon) * kx, 1), round(oy + (maxLat - lat) * ky, 1)), [round(minLon, 4), round(maxLat, 4), round(kx, 4), round(ky, 4), round(ox, 1), round(oy, 1)]
def to_path(rings, xy):
    return "".join("M" + "L".join("%g %g" % xy(x, y) for x, y in r) + "Z" for r in rings)
feats = json.load(open(os.path.join(HERE, "geo", "countries.geo.json")))["features"]
made = 0
for f in feats:
    iso3 = f.get("id"); iso2 = ISO.get(iso3)
    if not iso2: continue
    rings = country_rings(iso3, f["geometry"]); xy, proj = fit(rings)
    out = {"code": iso2, "path": to_path(rings, xy), "proj": proj}
    if iso2 in CITIES: out["cities"] = CITIES[iso2]
    json.dump(out, open(os.path.join(OUT, iso2 + ".json"), "w"), ensure_ascii=False, separators=(",", ":")); made += 1
# карта мира: равнопромежуточная проекция, точки прорежены, мелкие острова отброшены
LAT0, LAT1 = -58, 84; k = W / 360; oy = (H - (LAT1 - LAT0) * k) / 2
wxy = lambda lon, lat: (round((lon + 180) * k, 1), round(oy + (LAT1 - lat) * k, 1))
parts = []
for f in feats:
    if f.get("id") == "ATA": continue
    for r in rings_of(f["geometry"]):
        if bbox_area(r) < 1.0: continue
        pts = r[::3] if len(r) > 12 else r
        if len(pts) < 4: continue
        parts.append("M" + "L".join("%g %g" % wxy(x, y) for x, y in pts) + "Z")
world = {"code": "world", "path": "".join(parts), "proj": [-180, LAT1, round(k, 4), round(k, 4), 0, round(oy, 1)]}
json.dump(world, open(os.path.join(OUT, "world.json"), "w"), separators=(",", ":"))
sizes = sorted(((os.path.getsize(os.path.join(OUT, n)), n) for n in os.listdir(OUT)), reverse=True)
print("countries:", made, "| world.json", sizes[0] if sizes[0][1] == "world.json" else [s for s in sizes if s[1] == "world.json"][0][0], "bytes | largest:", sizes[:4], "| total", sum(s for s, n in sizes) // 1024, "KB")
