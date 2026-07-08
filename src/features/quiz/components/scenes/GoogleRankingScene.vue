<script>
import { publicAsset } from '../../data/publicAsset.js'
import SceneCanvas from './SceneCanvas.vue'
import { market } from '../../../../i18n/marketConfig.js'
import { currencyAffix } from '../../../../i18n/format.js'

// Native Vue rebuild of htmlTOvideo/2 — the "#1 in Google Search" scene.
// A fixed 360×640 canvas (scaled to fit the frame) shows a headline, a SERP
// mockup that types a query and reveals three results (dimming #2/#3 and
// featuring #1), a stats strip with count-up numbers, a profile-views line
// chart that draws itself, and a Google Search Console footer badge.
//
// The original was a JS-driven 12s sequence with a global SPEED=2 multiplier
// and a "CLM-NOLOOP-FIX" forcing every animation to play ONCE and hold its end
// state. This rebuild keeps SPEED=2 (so every delay/duration below is the
// original value divided by 2) and never loops. There are no external image or
// video assets in this scene — every graphic is an inline SVG. (publicAsset is
// imported per the scene-port convention but unused here.)
void publicAsset

const SPEED = 2

export default {
  name: 'GoogleRankingScene',
  components: { SceneCanvas },
  data() {
    return {
      // ---- Reactive state driven by the one-shot sequence ----
      searchText: '',
      showCursor: true,
      viewsVal: '0',
      leadsVal: '0',
      revenueVal: '0',
      result2Dimmed: false,
      result3Dimmed: false,
      result1Featured: false,
    }
  },
  created() {
    // All delays/durations are in ORIGINAL ms (pre-SPEED); later() divides by
    // SPEED, exactly like the original engine. The whole timeline is anchored at
    // runSequence start, which CSS animation delays mirror (see <style>: each CSS
    // delay = original-ms ÷ SPEED ÷ 1000, plus the 150ms runSequence offset).
    this._timers = []
    this._rafs = []
    // Афікс валюти під локаль (символ до/після числа).
    this._cur = currencyAffix(this.$i18n.locale)
    this.revenueVal = this._cur.prefix + '0' + this._cur.suffix
  },
  mounted() {
    // Original starts after fonts load + 300/SPEED ms.
    this.later(this.runSequence, 300)
  },
  beforeDestroy() {
    this._timers.forEach(clearTimeout)
    this._rafs.forEach(cancelAnimationFrame)
  },
  methods: {
    later(fn, ms) { this._timers.push(setTimeout(fn, ms / SPEED)) },

    // CountUp — smooth cubic-out, matching the original formatting rules.
    countUp(setVal, target, duration = 2200, prefix = '', suffix = '', delay = 0) {
      const dur = duration / SPEED
      this.later(() => {
        const start = performance.now()
        const frame = (now) => {
          const t = Math.min((now - start) / dur, 1)
          const e = 1 - Math.pow(1 - t, 3)
          const raw = e * target
          let display
          if (target >= 1000000) {
            // Мільйони — компактно «10.9M», інакше 5-значне «10900K» не влазить.
            display = (raw / 1000000).toFixed(1) + 'M'
          } else if (target >= 10000) {
            if (t >= 1) display = (target / 1000) + 'K'
            else display = (raw / 1000).toFixed(1) + 'K'
          } else {
            display = Math.round(raw)
          }
          setVal(prefix + display + suffix)
          if (t < 1) this._rafs.push(requestAnimationFrame(frame))
          else {
            if (target >= 1000000) setVal(prefix + (target / 1000000).toFixed(1) + 'M' + suffix)
            else if (target >= 10000) setVal(prefix + (target / 1000) + 'K' + suffix)
            else setVal(prefix + target + suffix)
          }
        }
        this._rafs.push(requestAnimationFrame(frame))
      }, delay)
    },

    // Typing effect — one character every `speed` ms (÷ SPEED).
    typeText(text, speed = 60, delay = 0) {
      const stepSpeed = speed / SPEED
      this.later(() => {
        this.searchText = ''
        let i = 0
        const next = () => {
          if (i < text.length) {
            this.searchText += text[i++]
            this._timers.push(setTimeout(next, stepSpeed))
          }
        }
        next()
      }, delay)
    },

    // ---- One-shot sequence (timings mirror the original runSequence, in
    // original/pre-SPEED ms measured from runSequence start) ----
    runSequence() {
      const query = this.$t('scenes.google.query')
      // Headline is static (USER FIX) so the headline beat collapses; the SERP card
      // CSS-fades at 1100ms and typing follows. Typing begins at 1300ms.
      this.typeText(query, 55, 1300)

      // Hide the cursor once typing has finished.
      this.later(() => { this.showCursor = false }, 1300 + query.length * 55)

      // Dim results 2 & 3, then feature #1 (original: after results reveal, +300/+100).
      this.later(() => { this.result2Dimmed = true; this.result3Dimmed = true }, 4175)
      this.later(() => { this.result1Featured = true }, 4275)

      // Stats count up (перегляди/запити — універсальні; дохід — з marketConfig, у валюті локалі).
      this.countUp(v => (this.viewsVal = v), 250000, 2200, '', '', 5575)
      this.countUp(v => (this.leadsVal = v), 89, 2200, '', '', 5575)
      this.countUp(v => (this.revenueVal = v), market(this.$i18n.locale).scenes.googleRevenue, 2200, this._cur.prefix, this._cur.suffix, 5575)

      // Re-show the cursor near the end (original re-shows before its loop reset).
      this.later(() => { this.showCursor = true }, 11875)
    },
  },
}
</script>

<template>
  <SceneCanvas>
    <div class="canvas">
      <!-- Background orbs -->
      <div class="glow-orb glow-orb-1"></div>
      <div class="glow-orb glow-orb-2"></div>

      <!-- Headline -->
      <div class="headline-block">
        <div class="headline" v-html="$t('scenes.google.headlineHtml')"></div>
        <div class="sub-headline">{{ $t('scenes.google.sub') }}</div>
      </div>

      <!-- SERP Card -->
      <div class="serp-card">
        <!-- Search bar -->
        <div class="search-bar">
          <svg class="search-icon" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="#64748b" stroke-width="1.5"/>
            <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="search-text">{{ searchText }}</span><span v-show="showCursor" class="search-cursor"></span>
        </div>

        <!-- Result #1 -->
        <div class="serp-result result-1" :class="{ featured: result1Featured }">
          <div class="rank-badge rank-1">1</div>
          <div class="result-content">
            <div class="result-url">
              <svg class="favicon" viewBox="0 0 10 10" fill="none"><rect width="10" height="10" rx="2" fill="#10b981"/><text x="1" y="8" font-size="7" fill="white" font-family="Inter" font-weight="700">c</text></svg>
              consultantlm.com
            </div>
            <div class="result-title">{{ $t('scenes.google.result1Title') }}</div>
            <div class="stars">★★★★★ <span class="star-score">4.9 (127)</span></div>
          </div>
        </div>

        <!-- Result #2 -->
        <div class="serp-result result-2" :class="{ 'dimmed-out': result2Dimmed }">
          <div class="rank-badge rank-2">2</div>
          <div class="result-content">
            <div class="result-url dimmed">
              <svg class="favicon" viewBox="0 0 10 10"><rect width="10" height="10" rx="2" fill="#0a66c2"/><text x="1.5" y="8" font-size="7" fill="white" font-family="Inter" font-weight="700">in</text></svg>
              linkedin.com/in/kovalenko
            </div>
            <div class="result-title dimmed">{{ $t('scenes.google.result2Title') }}</div>
          </div>
        </div>

        <!-- Result #3 -->
        <div class="serp-result result-3" :class="{ 'dimmed-out': result3Dimmed }">
          <div class="rank-badge rank-3">3</div>
          <div class="result-content">
            <div class="result-url dimmed">
              <svg class="favicon" viewBox="0 0 10 10"><rect width="10" height="10" rx="2" fill="#334155"/></svg>
              kovalenko-law.com.ua
            </div>
            <div class="result-title dimmed">{{ $t('scenes.google.result3Title') }}</div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="divider"></div>

      <!-- Stats block -->
      <div class="stats-block">
        <div class="stat-col stat-views">
          <div class="stat-label">{{ $t('scenes.google.views') }}</div>
          <div class="stat-value">{{ viewsVal }}</div>
          <div class="stat-sub">↑ +340%</div>
        </div>
        <div class="stat-col stat-leads">
          <div class="stat-label">{{ $t('scenes.google.leads') }}</div>
          <div class="stat-value">{{ leadsVal }}</div>
          <div class="stat-sub">↑ +189%</div>
        </div>
        <div class="stat-col stat-revenue">
          <div class="stat-label">{{ $t('scenes.google.revenue') }}</div>
          <div class="stat-value">{{ revenueVal }}</div>
          <div class="stat-sub">↑ +267%</div>
        </div>
      </div>

      <!-- Chart -->
      <div class="chart-block">
        <div class="chart-header">
          <span class="chart-title">{{ $t('scenes.google.chartTitle') }}</span>
          <span class="chart-badge">{{ $t('scenes.google.chartBadge') }}</span>
        </div>
        <div class="chart-area">
          <div class="chart-y-labels">
            <span class="chart-y-label">250K</span>
            <span class="chart-y-label">125K</span>
            <span class="chart-y-label">0</span>
          </div>
          <div class="chart-grid">
            <div class="grid-line" style="top:0%"></div>
            <div class="grid-line" style="top:50%"></div>
            <div class="grid-line" style="top:100%"></div>
          </div>
          <svg class="chart-svg" viewBox="0 0 240 52" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#00b4d8"/>
                <stop offset="100%" stop-color="#10b981"/>
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#00b4d8" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="#00b4d8" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <!-- Area fill -->
            <path class="chart-area-fill"
              d="M0,52 L0,46 C30,44 50,40 80,36 C110,32 130,26 160,18 C180,12 210,6 240,2 L240,52 Z"/>
            <!-- Line -->
            <path class="chart-line-path"
              d="M0,46 C30,44 50,40 80,36 C110,32 130,26 160,18 C180,12 210,6 240,2"/>
          </svg>
          <div class="chart-x-labels">
            <span class="chart-x-label">{{ $t('scenes.google.months.m0') }}</span>
            <span class="chart-x-label">{{ $t('scenes.google.months.m1') }}</span>
            <span class="chart-x-label">{{ $t('scenes.google.months.m2') }}</span>
            <span class="chart-x-label">{{ $t('scenes.google.months.m3') }}</span>
            <span class="chart-x-label">{{ $t('scenes.google.months.m4') }}</span>
            <span class="chart-x-label">{{ $t('scenes.google.months.m5') }}</span>
          </div>
        </div>
      </div>

      <!-- Footer Badge -->
      <div class="footer-badge">
        <svg class="gsc-icon" viewBox="0 0 14 14" fill="none">
          <rect width="14" height="14" rx="3" fill="rgba(0,180,216,0.2)"/>
          <text x="2" y="11" font-size="9" fill="#00b4d8" font-family="Inter" font-weight="700">G</text>
        </svg>
        <span class="footer-badge-text">Google Search Console</span>
        <span class="footer-badge-arrow">↗</span>
      </div>
    </div>
  </SceneCanvas>
</template>

<style scoped>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.canvas {
  width: 360px;
  /* Content-tight height: headline at 16px down to the footer badge + 16px
     bottom margin (was a fixed 640px video canvas with dead space top/bottom). */
  height: 552px;
  position: relative;
  overflow: hidden;
  background: #ffffff;
  font-family: 'Inter', system-ui, sans-serif;
}

/* Glow orbs */
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
}
.glow-orb-1 {
  width: 200px; height: 200px;
  background: rgba(0,180,216,0.06);
  top: -60px; right: -40px;
}
.glow-orb-2 {
  width: 160px; height: 160px;
  background: rgba(76,201,240,0.04);
  bottom: 100px; left: -50px;
}

/* ======================== LOGO ======================== */
.logo {
  position: absolute;
  top: 18px;
  left: 20px;
  opacity: 0;
  transform: translateY(10px);
}
.logo-main {
  font-size: 10px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: 2px;
  text-transform: uppercase;
  line-height: 1;
}
.logo-sub {
  font-size: 7px;
  font-weight: 300;
  color: #64748b;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-top: 2px;
}

/* Live badge */
.live-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(16,185,129,0.15);
  border: 1px solid rgba(16,185,129,0.3);
  border-radius: 20px;
  padding: 4px 10px;
  opacity: 0;
}
.live-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse-dot 1.5s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.7); }
}
.live-text {
  font-size: 9px;
  font-weight: 600;
  color: #10b981;
  letter-spacing: 1px;
}

/* ======================== HEADLINE ======================== */
.headline-block {
  position: absolute;
  top: 16px;
  left: 20px;
  right: 20px;
  opacity: 0;
  transform: translateY(20px);
}
.headline {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.2;
  letter-spacing: -0.3px;
}
.headline .accent { color: #00b4d8; }
.sub-headline {
  font-size: 12px;
  font-weight: 400;
  color: #94a3b8;
  margin-top: 5px;
  line-height: 1.4;
}

/* ======================== SERP MOCKUP ======================== */
.serp-card {
  position: absolute;
  top: 94px;
  left: 20px;
  right: 20px;
  background: #f5f7fa;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
  padding: 14px 14px 12px;
  opacity: 0;
  transform: translateY(20px);
  animation: serpIn 0.2s ease-out 0.4s 1 forwards;
}

/* Search bar */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,0,0,0.03);
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 8px 12px;
  margin-bottom: 12px;
}
.search-icon {
  width: 13px; height: 13px;
  flex-shrink: 0;
}
.search-text {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
}
.search-cursor {
  display: inline-block;
  width: 1px; height: 12px;
  background: #00b4d8;
  margin-left: 1px;
  vertical-align: middle;
  animation: blink 0.7s step-end infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

/* SERP result rows */
.serp-result {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 9px 10px;
  border-radius: 10px;
  margin-bottom: 5px;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.4s ease;
  position: relative;
}
.serp-result:last-child { margin-bottom: 0; }
/* One-shot reveal of each result (original fadeIn calls, ÷SPEED timings). */
.serp-result.result-1 { animation: resultIn 0.2s ease-out 1.537s 1 forwards; }
.serp-result.result-2 { animation: resultIn 0.175s ease-out 1.737s 1 forwards; }
.serp-result.result-3 { animation: resultIn 0.175s ease-out 1.912s 1 forwards; }

.serp-result.result-1 {
  background: rgba(0,180,216,0.08);
  border: 1px solid rgba(0,180,216,0.25);
}
.serp-result.result-2,
.serp-result.result-3 {
  background: rgba(0,0,0,0.02);
  border: 1px solid rgba(0,0,0,0.05);
}

.rank-badge {
  font-size: 9px;
  font-weight: 800;
  width: 18px; height: 18px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.rank-1 { background: rgba(0,180,216,0.2); color: #00b4d8; }
.rank-2, .rank-3 { background: rgba(0,0,0,0.04); color: #64748b; }

.result-content { flex: 1; min-width: 0; }
.result-url {
  font-size: 9px;
  color: #10b981;
  font-weight: 500;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.result-url .favicon {
  width: 10px; height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}
.result-url.dimmed { color: #64748b; }
.result-title {
  font-size: 12px;
  font-weight: 600;
  color: #1a1a2e;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.result-title.dimmed { color: #94a3b8; }

.stars {
  font-size: 9px;
  color: #f59e0b;
  margin-top: 2px;
  letter-spacing: 1px;
}
.star-score {
  font-size: 9px;
  font-weight: 600;
  color: #94a3b8;
  margin-left: 3px;
}

/* dimmed state */
.serp-result.dimmed-out {
  opacity: 0.3 !important;
  filter: blur(0.5px);
  transform: scale(0.98) !important;
  transition: all 0.6s ease;
}
.serp-result.result-1.featured {
  box-shadow: 0 0 20px rgba(0,180,216,0.15);
  transform: scale(1.01) !important;
  transition: all 0.5s ease;
}

/* ======================== DIVIDER ======================== */
.divider {
  position: absolute;
  top: 274px;
  left: 20px;
  right: 20px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent);
  opacity: 0;
  animation: fadeOnly 0.2s ease-out 2.387s 1 forwards;
}

/* ======================== STATS ======================== */
.stats-block {
  position: absolute;
  top: 286px;
  left: 20px;
  right: 20px;
  display: flex;
  gap: 0;
  opacity: 0;
  transform: translateY(20px);
  animation: statsBlockIn 0.2s ease-out 2.587s 1 forwards;
}
.stat-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 12px 4px;
  background: #f5f7fa;
  border: 1px solid #e5e7eb;
  backdrop-filter: blur(10px);
  opacity: 0;
  transform: translateY(15px);
}
/* Per-col stagger (original: 150ms apart ÷SPEED, after the block fades in). */
.stat-col.stat-views { animation: statColIn 0.2s ease 2.837s 1 forwards; }
.stat-col.stat-leads { animation: statColIn 0.2s ease 2.912s 1 forwards; }
.stat-col.stat-revenue { animation: statColIn 0.2s ease 2.987s 1 forwards; }
.stat-col:first-child { border-radius: 12px 0 0 12px; }
.stat-col:last-child { border-radius: 0 12px 12px 0; }
.stat-col + .stat-col { border-left: none; }

.stat-label {
  font-size: 10px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.stat-value {
  font-size: 26px;
  font-weight: 800;
  color: #00b4d8;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  min-width: 72px;
  text-align: center;
  font-feature-settings: "tnum";
  letter-spacing: -0.5px;
  white-space: nowrap;
}
.stat-sub {
  font-size: 9px;
  color: #10b981;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
}

/* ======================== CHART ======================== */
.chart-block {
  position: absolute;
  top: 394px;
  left: 20px;
  right: 20px;
  opacity: 0;
  transform: translateY(20px);
  animation: chartBlockIn 0.25s ease-out 3.837s 1 forwards;
}
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.chart-title {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}
.chart-badge {
  padding: 3px 8px;
  border-radius: 20px;
  background: rgba(16,185,129,0.15);
  border: 1px solid rgba(16,185,129,0.2);
  font-size: 9px;
  font-weight: 600;
  color: #10b981;
}

.chart-area {
  background: #f5f7fa;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 14px 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
  position: relative;
  height: 84px;
  overflow: hidden;
}

/* Y-axis labels */
.chart-y-labels {
  position: absolute;
  left: 0; top: 10px; bottom: 14px;
  width: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding-right: 4px;
}
.chart-y-label {
  font-size: 8px;
  color: #334155;
  font-weight: 500;
}

/* Grid lines */
.chart-grid {
  position: absolute;
  left: 28px; right: 0;
  top: 10px; bottom: 14px;
}
.grid-line {
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  background: rgba(0,0,0,0.04);
}

/* SVG chart line */
.chart-svg {
  position: absolute;
  left: 28px; right: 0;
  top: 10px; bottom: 14px;
  width: calc(100% - 28px);
  height: calc(100% - 24px);
}

.chart-line-path {
  fill: none;
  stroke: url(#lineGrad);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  /* Draw once (original drawChartLine, easeInOut, 1800ms ÷SPEED). */
  animation: drawLine 0.9s cubic-bezier(0.45,0,0.55,1) 3.987s 1 forwards;
}
.chart-area-fill {
  fill: url(#areaGrad);
  opacity: 0;
  clip-path: none;
  /* Fade in (original fill.style.opacity = 0.4, 800ms ÷SPEED). */
  animation: fillIn 0.4s ease 3.987s 1 forwards;
}

/* X-axis months */
.chart-x-labels {
  position: absolute;
  left: 28px; right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
}
.chart-x-label {
  font-size: 8px;
  color: #334155;
  font-weight: 500;
}

/* ======================== FOOTER BADGE ======================== */
.footer-badge {
  position: absolute;
  top: 510px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #f5f7fa;
  border: 1px solid rgba(0,180,216,0.2);
  border-radius: 20px;
  white-space: nowrap;
  opacity: 0;
  /* Fade up after the line draws (original 500ms ÷SPEED). */
  animation: footerIn 0.25s ease-out 4.937s 1 forwards;
}
.gsc-icon {
  width: 14px; height: 14px;
  flex-shrink: 0;
}
.footer-badge-text {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.3px;
}
.footer-badge-arrow {
  font-size: 10px;
  color: #10b981;
}

/* USER FIX: static title — always visible, no fade-in */
.headline-block, .headline {
  animation: none !important;
  opacity: 1 !important;
  transform: none !important;
}

/* CLM-NOLOOP-FIX — every animation plays once and holds. */
*, *::before, *::after {
  animation-iteration-count: 1 !important;
  animation-fill-mode: forwards !important;
}

/* ---- One-shot keyframes (replicate the JS fadeIn/draw helpers) ---- */
@keyframes serpIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes resultIn {
  from { opacity: 0; transform: translateX(-8px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes fadeOnly {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes statsBlockIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes statColIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes chartBlockIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fillIn {
  from { opacity: 0; }
  to { opacity: 0.4; }
}
@keyframes drawLine {
  from { stroke-dashoffset: 300; }
  to { stroke-dashoffset: 0; }
}
@keyframes footerIn {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>
