<script>
import { publicAsset } from '../../data/publicAsset.js'
import SceneCanvas from './SceneCanvas.vue'

void publicAsset

// Native Vue rebuild of htmlTOvideo/9 — the "AI Content Factory" scene.
// Play-once (CLM-NOLOOP-FIX): every animation runs once and holds its end
// state. A fixed 360×640 canvas scales to fit the outer frame, matching the
// original fit(). The count-up engine from the source <script> is reproduced
// with rAF + ease-out cubic so the social/total numbers tick once on entry.
// (This scene references no external image assets — only inline SVG + CSS.)

// Pipeline steps (top: scan/generate/publish/track/scale)
const steps = [
  {
    label: 'Скан',
    paths: ['<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'],
  },
  {
    label: 'Генерація',
    paths: [
      '<path d="M12 3v3M12 18v3M5 12H2M22 12h-3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/><circle cx="12" cy="12" r="3.2"/>',
    ],
  },
  {
    label: 'Публікація',
    paths: [
      '<path d="M5 12V5a1 1 0 0 1 1-1h7l6 6v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z"/><path d="M12 4v6h6"/><path d="m9 16 3-3 3 3"/><path d="M12 13v6"/>',
    ],
  },
  {
    label: 'Аналіз',
    paths: ['<path d="M3 17l5-5 4 4 7-8"/><path d="M14 8h5v5"/>'],
  },
  {
    label: 'Масштаб',
    paths: ['<path d="M4 20V4M4 20h16M8 16V10M13 16V7M18 16v-4"/>'],
  },
]

// Before / After rows
const beforeRows = [
  { key: 'Перегляди', val: '12K' },
  { key: 'Залученість', val: '2.1%' },
]
const afterRows = [
  { key: 'Перегляди', val: '187K' },
  { key: 'Залученість', val: '8.7%' },
]

// Socials: brand class + inline SVG markup + count-up config
const socials = [
  {
    cls: 'soc-ig',
    fill: false,
    svg: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>',
    count: 42, suffix: 'K', delay: 0,
  },
  {
    cls: 'soc-fb',
    fill: true,
    svg: '<path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V14h2.7v8h3.4Z"/>',
    count: 28, suffix: 'K', delay: 100,
  },
  {
    cls: 'soc-li',
    fill: true,
    svg: '<path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22zM8.34 8h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.44h-4.56v-6.6c0-1.57-.03-3.6-2.19-3.6-2.2 0-2.53 1.72-2.53 3.49V22H8.34z"/>',
    count: 15, suffix: 'K', delay: 200,
  },
  {
    cls: 'soc-tt',
    fill: false,
    svg: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" stroke="#00f2ea" stroke-width="2" stroke-linecap="round"/><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" stroke="#fff" stroke-width="2" stroke-linecap="round" transform="translate(1.5,-1)"/><path d="M14 3c.5 2.6 2.4 4.4 5 4.6" stroke="#ff0050" stroke-width="2" stroke-linecap="round"/>',
    count: 98, suffix: 'K', delay: 300,
  },
  {
    cls: 'soc-yt',
    fill: true,
    svg: '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3Z"/>',
    count: 34, suffix: 'K', delay: 400,
  },
]

function formatNum(n, opts) {
  if (opts.format === 'comma') return Math.round(n).toLocaleString('en-US')
  if (opts.decimals) return n.toFixed(opts.decimals)
  return Math.round(n).toString()
}

export default {
  name: 'ContentFactoryScene',
  components: { SceneCanvas },
  data() {
    return {
      steps,
      beforeRows,
      afterRows,
      socials,
      // Reactive display values for the count-up engine.
      socCounts: socials.map((s) => '0' + (s.suffix || '')),
      totalCount: '0',
    }
  },
  created() {
    this._timers = []
    this._rafs = []
  },
  mounted() {
    this.runCycle()
  },
  beforeDestroy() {
    this._timers.forEach(clearTimeout)
    this._rafs.forEach(cancelAnimationFrame)
  },
  methods: {
    animateCount(setter, target, opts) {
      const suffix = opts.suffix || ''
      const delay = opts.delay || 0
      const duration = 1500
      setter(formatNum(0, opts) + suffix)
      const t = setTimeout(() => {
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration)
          if (p >= 1) {
            setter(formatNum(target, opts) + suffix)
            return
          }
          const e = 1 - Math.pow(1 - p, 3)
          const v = target * e
          setter(formatNum(v, opts) + suffix)
          this._rafs.push(requestAnimationFrame(tick))
        }
        this._rafs.push(requestAnimationFrame(tick))
      }, delay)
      this._timers.push(t)
    },
    runCycle() {
      this.socials.forEach((s, i) => {
        // Vue 2: array element writes by index aren't reactive — use $set.
        this.animateCount((txt) => { this.$set(this.socCounts, i, txt) }, s.count, { suffix: s.suffix, delay: s.delay })
      })
      this.animateCount((txt) => { this.totalCount = txt }, 100000, { format: 'comma', delay: 2000 })
    },
  },
}
</script>

<template>
  <SceneCanvas>
    <div class="stage">
      <div class="frame">

        <!-- Heading -->
        <div class="heading">
          <div class="h-title">Стежте за конкурентами <span class="accent">24/7</span></div>
          <div class="h-sub">і створюйте кращий контент за хвилини з Consultant.</div>
        </div>

        <!-- Pipeline -->
        <div class="pipeline">
          <div v-for="(s, i) in steps" :key="i" class="step">
            <div class="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                   stroke-linecap="round" stroke-linejoin="round" v-html="s.paths.join('')"></svg>
            </div>
            <div class="step-label">{{ s.label }}</div>
          </div>
        </div>

        <!-- Before / After -->
        <div class="ba">
          <div class="ba-side ba-before">
            <div class="ba-eyebrow"><span class="dot"></span> До</div>
            <div class="ba-label">Конкурент</div>
            <div v-for="(r, i) in beforeRows" :key="i" class="ba-row">
              <span class="ba-row-key">{{ r.key }}</span>
              <span class="ba-row-val">{{ r.val }}</span>
            </div>
            <div class="ba-bar"><i></i></div>
          </div>
          <div class="ba-side ba-after">
            <div class="ba-eyebrow"><span class="dot"></span> Після</div>
            <div class="ba-label">Ваш контент</div>
            <div v-for="(r, i) in afterRows" :key="i" class="ba-row">
              <span class="ba-row-key">{{ r.key }}</span>
              <span class="ba-row-val">{{ r.val }}</span>
            </div>
            <div class="ba-bar"><i></i></div>
          </div>
          <div class="ba-badge">+1,458%</div>
        </div>

        <!-- Socials -->
        <div class="socials">
          <div v-for="(s, i) in socials" :key="i" class="soc">
            <div class="soc-icon" :class="s.cls">
              <svg v-if="s.fill" viewBox="0 0 24 24" fill="currentColor" v-html="s.svg"></svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" v-html="s.svg"></svg>
            </div>
            <div class="soc-likes"><span class="count">{{ socCounts[i] }}</span></div>
          </div>
        </div>

        <!-- Total reach -->
        <div class="total">
          <div class="total-label">Загальне охоплення</div>
          <div class="total-num"><span class="count">{{ totalCount }}</span><span style="color: var(--accent);">+</span></div>
          <div class="total-foot">на 5 платформах · за кампанію</div>
        </div>

      </div>
    </div>
  </SceneCanvas>
</template>

<style scoped>
:root,
.stage {
  --bg-1: #ffffff;
  --bg-2: #ffffff;
  --bg-3: #ffffff;
  --accent: #00b4d8;
  --accent-2: #4cc9f0;
  --pos: #10b981;
  --neg: #ef4444;
  --text: #1a1a2e;
  --muted: #94a3b8;
  --tiny: #64748b;
  --card-bg: #f5f7fa;
  --card-border: #e5e7eb;
  --divider: #e5e7eb;
}

* { box-sizing: border-box; }

/* ---------- Stage ---------- */
.stage {
  width: 360px;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* ambient glow */
.stage::before {
  content: "";
  position: absolute; inset: -40%;
  background:
    radial-gradient(circle at 20% 10%, rgba(0,180,216,0.04), transparent 40%),
    radial-gradient(circle at 80% 90%, rgba(76,201,240,0.03), transparent 45%);
  pointer-events: none;
  z-index: 0;
  animation: ambient 12s ease-in-out infinite;
}
@keyframes ambient {
  0%, 100% { transform: translate(0,0); }
  50% { transform: translate(-2%, 2%); }
}

/* subtle grid — removed for light theme */
.stage::after {
  display: none;
}

.frame { position: relative; z-index: 1; padding: 12px 18px 16px; display: flex; flex-direction: column; }

/* ---------- Heading ---------- */
.heading {
  margin-top: 4px;
  opacity: 0; animation: fadeUp 0.6s ease-out 0s forwards;
}
.h-title {
  font-size: 22px; font-weight: 700; line-height: 1.15; color: #1a1a2e;
  letter-spacing: -0.3px;
}
.h-title .accent { color: var(--accent); }
.h-sub {
  font-size: 13px; font-weight: 400; color: var(--muted); margin-top: 6px;
  line-height: 1.35;
}

/* ---------- Pipeline ---------- */
.pipeline {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  align-items: stretch;
  background: #f5f7fa;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 10px 6px;
}
.step {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  position: relative;
  opacity: 0; transform: translateY(8px);
}
.step-icon {
  width: 30px; height: 30px;
  border-radius: 9px;
  background: linear-gradient(180deg, rgba(0,180,216,0.12), rgba(0,180,216,0.04));
  border: 1px solid rgba(0,180,216,0.25);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent);
  box-shadow: 0 2px 8px rgba(0,180,216,0.08);
}
.step-icon svg { width: 14px; height: 14px; }
.step-label {
  font-size: 8px; font-weight: 600; color: var(--muted); letter-spacing: 0.2px; text-transform: uppercase;
  white-space: nowrap;
}
/* arrows between steps */
.step:not(:last-child)::after {
  content: "";
  position: absolute;
  top: 14px;
  right: -6px;
  width: 12px;
  height: 1.5px;
  background: linear-gradient(90deg, rgba(0,180,216,0.6), rgba(76,201,240,0.2));
  transform: scaleX(0);
  transform-origin: left;
}
.step:not(:last-child)::before {
  content: "";
  position: absolute;
  top: 11px;
  right: -7px;
  width: 0; height: 0;
  border-left: 4px solid var(--accent);
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
  opacity: 0;
}

/* staggered animation */
.step:nth-child(1) { animation: stepIn 0.35s ease-out 0s forwards; }
.step:nth-child(2) { animation: stepIn 0.35s ease-out 0s forwards; }
.step:nth-child(3) { animation: stepIn 0.35s ease-out 0s forwards; }
.step:nth-child(4) { animation: stepIn 0.35s ease-out 0s forwards; }
.step:nth-child(5) { animation: stepIn 0.35s ease-out 0s forwards; }
.step:nth-child(1)::after { animation: arrowDraw 0.25s ease-out 0s forwards; }
.step:nth-child(2)::after { animation: arrowDraw 0.25s ease-out 0s forwards; }
.step:nth-child(3)::after { animation: arrowDraw 0.25s ease-out 0s forwards; }
.step:nth-child(4)::after { animation: arrowDraw 0.25s ease-out 0s forwards; }
.step:nth-child(1)::before { animation: arrowHead 0.2s ease-out 0s forwards; }
.step:nth-child(2)::before { animation: arrowHead 0.2s ease-out 0s forwards; }
.step:nth-child(3)::before { animation: arrowHead 0.2s ease-out 0s forwards; }
.step:nth-child(4)::before { animation: arrowHead 0.2s ease-out 0s forwards; }

/* ---------- Before / After card ---------- */
.ba {
  margin-top: 14px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  position: relative;
  opacity: 0; animation: fadeUp 0.5s ease-out 0s forwards;
}
.ba-side {
  border-radius: 12px;
  padding: 10px;
  position: relative;
  overflow: hidden;
}
.ba-before {
  background: linear-gradient(180deg, rgba(239,68,68,0.10), rgba(239,68,68,0.04));
  border: 1px solid rgba(239,68,68,0.22);
  opacity: 0; animation: fadeIn 0.4s ease-out 0s forwards;
}
.ba-after {
  background: linear-gradient(180deg, rgba(16,185,129,0.12), rgba(16,185,129,0.05));
  border: 1px solid rgba(16,185,129,0.28);
  opacity: 0; transform: translateX(20px);
  animation: slideInRight 0.5s ease-out 0s forwards;
}
.ba-eyebrow {
  font-size: 10px; font-weight: 600; letter-spacing: 0.6px;
  text-transform: uppercase;
  display: flex; align-items: center; gap: 5px;
}
.ba-before .ba-eyebrow { color: #ef4444; }
.ba-after .ba-eyebrow { color: #10b981; }
.dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 6px currentColor;
}
.ba-label { font-size: 11px; color: var(--muted); margin-top: 6px; }
.ba-row { display: flex; justify-content: space-between; align-items: baseline; margin-top: 6px; }
.ba-row-key { font-size: 10px; color: var(--tiny); text-transform: uppercase; letter-spacing: 0.5px; }
.ba-row-val { font-size: 14px; font-weight: 700; color: #1a1a2e; font-variant-numeric: tabular-nums; }
.ba-after .ba-row-val { color: #1a1a2e; }

.ba-badge {
  position: absolute;
  top: -10px; right: -8px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px; font-weight: 700;
  background: rgba(16,185,129,0.15);
  color: var(--pos);
  border: 1px solid rgba(16,185,129,0.4);
  box-shadow: 0 4px 14px rgba(16,185,129,0.2);
  opacity: 0;
  animation: badgeIn 0.4s ease-out 0s forwards, badgePulse 0.6s ease-in-out 0s 1;
}

/* mini sparkline-ish bar inside cards */
.ba-bar {
  height: 6px; border-radius: 3px;
  background: #e5e7eb;
  margin-top: 8px;
  overflow: hidden;
  position: relative;
}
.ba-bar > i {
  display: block;
  height: 100%;
  border-radius: 3px;
  width: 0;
}
.ba-before .ba-bar > i {
  background: linear-gradient(90deg, rgba(239,68,68,0.6), rgba(239,68,68,0.3));
  animation: fillBar 1.0s ease-out 0s forwards;
  --w: 18%;
}
.ba-after .ba-bar > i {
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  animation: fillBarLong 1.2s ease-out 0s forwards;
  --w: 92%;
}
@keyframes fillBar { to { width: var(--w); } }
@keyframes fillBarLong { to { width: var(--w); } }

/* ---------- Socials ---------- */
.socials {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}
.soc {
  background: #f5f7fa;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px 4px 6px;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  opacity: 0; transform: translateY(8px);
}
.soc-icon {
  width: 26px; height: 26px;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.soc-icon svg { width: 14px; height: 14px; }
.soc-ig { background: linear-gradient(135deg, #f58529, #dd2a7b 50%, #8134af 100%); }
.soc-fb { background: #1877f2; }
.soc-li { background: #0a66c2; }
.soc-tt { background: #010101; position: relative; }
.soc-tt::after {
  content: ""; position: absolute; inset: 0; border-radius: 7px;
  box-shadow: inset 0 0 0 1px rgba(0,242,234,0.4);
}
.soc-yt { background: #ff0000; }
.soc-likes {
  font-size: 10px; font-weight: 700; color: #444;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.3px;
}
.soc-likes::before {
  content: "♥ ";
  color: var(--accent);
}
.soc:nth-child(1) { animation: socIn 0.4s ease-out 0s forwards; }
.soc:nth-child(2) { animation: socIn 0.4s ease-out 0s forwards; }
.soc:nth-child(3) { animation: socIn 0.4s ease-out 0s forwards; }
.soc:nth-child(4) { animation: socIn 0.4s ease-out 0s forwards; }
.soc:nth-child(5) { animation: socIn 0.4s ease-out 0s forwards; }

/* counters */
.count { display: inline-block; }

/* ---------- Total reach ---------- */
.total {
  margin-top: 18px;
  text-align: center;
  opacity: 1;
  animation: zoomIn 0.6s cubic-bezier(.2,.9,.3,1.4) 2.0s forwards;
}
.total-label {
  font-size: 12px; color: var(--muted); letter-spacing: 1.6px;
  text-transform: uppercase; font-weight: 600;
}
.total-num {
  font-size: 60px; font-weight: 800; line-height: 1.0;
  background: linear-gradient(180deg, var(--accent-2), var(--accent));
  -webkit-background-clip: text; background-clip: text; color: transparent;
  text-shadow: 0 0 24px rgba(0,180,216,0.15);
  font-variant-numeric: tabular-nums;
  letter-spacing: -1.5px;
  margin-top: 6px;
}
.total-foot {
  font-size: 11px; color: var(--tiny); margin-top: 8px; letter-spacing: 0.6px;
}

/* ---------- Keyframes ---------- */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes stepIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes arrowDraw {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes arrowHead {
  from { opacity: 0; transform: translateX(-3px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes socIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes badgeIn {
  from { opacity: 0; transform: scale(0.7) rotate(-6deg); }
  to   { opacity: 1; transform: scale(1) rotate(0); }
}
@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.08); }
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}

/* ---------- Master loop: replay everything every 12s ---------- */
.frame {
  animation: loop 12s linear infinite;
}
@keyframes loop {
  0%, 100% {}
}

/* USER FIX: static title — always visible, no fade-in */
.heading, .h-title {
  animation: none !important;
  opacity: 1 !important;
  transform: none !important;
}

/* CLM-NOLOOP-FIX */
.stage *,
.stage *::before,
.stage *::after {
  animation-iteration-count: 1 !important;
  animation-fill-mode: forwards !important;
}
</style>
