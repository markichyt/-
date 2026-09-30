#!/usr/bin/env python3
"""Кейси для S5 з бази кейсів сайту (data/site-cases.json, знімок consultant.net.ua) → data/quiz-cases.json.
Категорії квізу ↔ рубрики кейсів сайту; для кожної — кількість і до 6 свіжих прикладів [заголовок, короткий результат]."""
import json, os, re, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cases = json.load(open(os.path.join(ROOT, "data", "site-cases.json"), encoding="utf-8"))
MAP = {"family": ["Сім’я"], "general": ["Інше", "Нерухомість / земля", "Спадщина", "Праця"], "debtor": ["Повернення боргу / кредити"], "debt": ["Повернення боргу / кредити"],
       "social": ["Соціальні / пенсії"], "migration": ["Міграція"], "auto": ["Авто / ДТП"], "business": ["Бізнес / податки"], "military": ["Військові питання"], "criminal": ["Кримінал"], "other": ["Інше"]}
DEBTOR = re.compile(r"кредит|колектор|виконавч|банк|мфо|позик", re.I)
def when(c):
    try: return datetime.datetime.strptime(c.get("date", ""), "%d.%m.%Y")
    except Exception: return datetime.datetime(2000, 1, 1)
def short(t, n):
    t = re.sub(r"\s+", " ", t or "").strip()
    if len(t) <= n: return t
    cut = t[:n]; cut = cut[:max(cut.rfind(" "), n // 2)]
    return cut.rstrip(" ,;:—-") + "…"
def cap(t):
    t = re.sub(r"\s*\|\s*", " — ", t or "").strip()
    letters = [ch for ch in t if ch.isalpha()]
    if letters and sum(ch.isupper() for ch in letters) / len(letters) > 0.7: return ""   # заголовки КАПСОМ пропускаємо — не вгадати власні назви
    return t[:1].upper() + t[1:] if t else t
def result_of(c):
    r = re.sub(r"\s+", " ", c.get("result") or "").strip()
    sents = [x.strip() for x in re.split(r"(?<=[.!?])\s", r) if x.strip()]
    good = [x for x in sents if x[:1].isupper() and len(x) >= 25] or sents   # перше повне речення з великої літери, а не хвіст попереднього
    return short(cap(good[0]) if good else r, 96)
out, counts = {}, {}
for qid, cats in MAP.items():
    pool = [c for c in cases if c.get("category") in cats]
    if qid == "debtor": pool = [c for c in pool if DEBTOR.search(c.get("title", "") + " " + c.get("situation", ""))] or pool
    if qid == "debt": pool = [c for c in pool if not DEBTOR.search(c.get("title", "") + " " + c.get("situation", ""))] or pool
    pool.sort(key=when, reverse=True)
    items = []
    for c in pool:
        t, r = cap(short(c.get("title", ""), 88)), result_of(c)
        if t and r and [t, r] not in items: items.append([t, r])
        if len(items) >= 6: break
    out[qid] = items; counts[qid] = len(pool)
json.dump({"counts": counts, "cases": out, "total": len(cases), "source": "consultant.net.ua/consultant-article, знімок 28.09.2026"}, open(os.path.join(ROOT, "data", "quiz-cases.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("кейси:", counts, "всього", len(cases))
