<script>
import { publicAsset } from '../../data/publicAsset.js'
import SceneCanvas from './SceneCanvas.vue'
import { market } from '../../../../i18n/marketConfig.js'
import { formatNumber, currencyMeta } from '../../../../i18n/format.js'

// Native Vue rebuild of htmlTOvideo/1 — the "AI Ads Promo" scene.
// A fixed 360×640 canvas (scaled to fit the card) shows an orbital ring of
// social icons flying out around a 9:16 portrait video, with a results card
// whose New Clients / Revenue numbers count up once and hold (CLM-NOLOOP-FIX:
// every animation runs exactly once and freezes at its end state).

// avatar.mp4 has no spaces/non-ASCII, but wrap in encodeURI for safety/parity.
const avatarSrc = encodeURI(publicAsset('htmlTOvideo/1/assets/avatar.mp4'))

// Social icons placed around the portrait card (identical order/positions).
const socials = [
  { cls: 's1', title: 'YouTube' },
  { cls: 's2', title: 'Facebook' },
  { cls: 's3', title: 'LinkedIn' },
  { cls: 's4', title: 'TikTok' },
  { cls: 's5', title: 'Google' },
  { cls: 's6', title: 'Instagram' },
]

// Six pulse dots flowing inward along the connection lines.
const pulseDots = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']

// Connection lines (SVG) from center out to each social icon position.
const lines = [
  { x1: 140, y1: 140, x2: 140, y2: 12 },
  { x1: 140, y1: 140, x2: 258, y2: 72 },
  { x1: 140, y1: 140, x2: 258, y2: 208 },
  { x1: 140, y1: 140, x2: 140, y2: 268 },
  { x1: 140, y1: 140, x2: 22, y2: 208 },
  { x1: 140, y1: 140, x2: 22, y2: 72 },
]

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export default {
  name: 'AiAdsScene',
  components: { SceneCanvas },
  data() {
    return {
      avatarSrc,
      socials,
      pulseDots,
      lines,
      // ----- Count-up display values (run once, 5s in, then hold) -----
      c1: '0',
      c2: '0',
    }
  },
  computed: {
    // Символ валюти й позиція (до/після числа) під поточну локаль.
    cur() { return currencyMeta(this.$i18n.locale) }
  },
  created() {
    this._timer = null
    this._rafIds = []
  },
  mounted() {
    // Original starts counters 5s into the loop; play-once, then hold final state.
    this._timer = setTimeout(this.startCounters, 5000)
  },
  beforeDestroy() {
    if (this._timer) clearTimeout(this._timer)
    this._rafIds.forEach((id) => cancelAnimationFrame(id))
  },
  methods: {
    runCount(setter, target, duration, isMoney) {
      const start = performance.now()
      const frame = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const v = Math.round(target * easeOutCubic(t))
        setter(isMoney ? formatNumber(v) : v.toString())
        if (t < 1) this._rafIds.push(requestAnimationFrame(frame))
      }
      this._rafIds.push(requestAnimationFrame(frame))
    },
    startCounters() {
      this.c1 = '0'
      this.c2 = formatNumber(0)
      this.runCount((v) => (this.c1 = v), 47, 1500, false)
      this.runCount((v) => (this.c2 = v), market(this.$i18n.locale).scenes.aiAdsRevenue, 1700, true)
    },
  },
}
</script>

<template>
  <SceneCanvas>
    <div class="canvas" data-screen-label="01 Promo">
      <!-- Headline -->
      <div class="headline">
        <h1 v-html="$t('scenes.ads.headlineHtml')"></h1>
        <p>{{ $t('scenes.ads.sub') }}</p>
      </div>

      <!-- Orbit (fixed-height stage preserving the absolutely-positioned graphic) -->
      <div class="orbit-stage">
      <div class="orbit-wrap">
        <div class="orbit-ring outer"></div>
        <div class="orbit-ring"></div>
        <div class="aura"></div>

        <!-- connection lines -->
        <svg class="connect-svg" viewBox="0 0 280 280" preserveAspectRatio="none">
          <line
            v-for="(l, i) in lines"
            :key="'line' + i"
            :x1="l.x1"
            :y1="l.y1"
            :x2="l.x2"
            :y2="l.y2"
          />
        </svg>

        <!-- pulse dots flowing inward -->
        <div v-for="p in pulseDots" :key="p" class="pulse-dot" :class="p"></div>

        <!-- Avatar (9:16 portrait video with caption overlay) -->
        <div class="avatar">
          <video :src="avatarSrc" autoplay muted loop playsinline preload="auto"></video>
          <div class="avatar-meta">
            <div class="name">{{ $t('scenes.ads.demoName') }}</div>
            <div class="role">{{ $t('scenes.ads.demoRole') }}</div>
          </div>
        </div>

        <!-- Social icons -->
        <div class="social s1" title="YouTube">
          <svg viewBox="0 0 24 24" fill="#fff"><path d="M23.5 6.2c-.3-1-1-1.8-2-2C19.6 3.8 12 3.8 12 3.8s-7.6 0-9.5.4c-1 .2-1.7 1-2 2C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1 1 1.8 2 2 1.9.4 9.5.4 9.5.4s7.6 0 9.5-.4c1-.2 1.7-1 2-2 .5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z"/></svg>
        </div>
        <div class="social s2" title="Facebook">
          <svg viewBox="0 0 24 24" fill="#fff"><path d="M22 12a10 10 0 10-11.6 9.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5v1.8h2.6l-.4 2.9h-2.2v7A10 10 0 0022 12z"/></svg>
          <span class="tag-removed" hidden></span>
        </div>
        <div class="social s3" title="LinkedIn">
          <svg viewBox="0 0 24 24" fill="#fff"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5V9h3v10zM6.5 7.7a1.7 1.7 0 110-3.5 1.7 1.7 0 010 3.5zM19 19h-3v-5c0-1.2 0-2.7-1.6-2.7s-1.9 1.3-1.9 2.6V19h-3V9h2.9v1.4h.1a3.2 3.2 0 012.9-1.6c3.1 0 3.7 2 3.7 4.7V19z"/></svg>
          <span class="tag-removed" hidden></span>
        </div>
        <div class="social s4" title="TikTok">
          <svg viewBox="0 0 24 24" fill="#fff"><path d="M16.5 2.2c.4 2 1.6 3.7 3.5 4.5v3.1a8 8 0 01-4.5-1.5v6.5a6 6 0 11-6-6c.4 0 .8 0 1.2.1v3.2a3 3 0 102.1 2.8V2.2h3.7z"/></svg>
        </div>
        <div class="social s5" title="Google">
          <svg viewBox="0 0 24 24"><path fill="#4285f4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 01-2 3v2.5h3.3c1.9-1.8 3-4.4 3-7.3z"/><path fill="#34a853" d="M12 22c2.7 0 5-1 6.7-2.5l-3.3-2.5a5.7 5.7 0 01-8.6-3H3.4v2.6A10 10 0 0012 22z"/><path fill="#fbbc04" d="M6.8 14a6 6 0 010-3.8V7.6H3.4a10 10 0 000 8.9l3.4-2.5z"/><path fill="#ea4335" d="M12 6.4a5.4 5.4 0 013.9 1.5l2.9-2.9A10 10 0 003.4 7.6L6.8 10A5.7 5.7 0 0112 6.4z"/></svg>
          <span class="tag-removed" hidden></span>
        </div>
        <div class="social s6" title="Instagram">
          <svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2 0 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9a3.7 3.7 0 01-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 5.8a4 4 0 100 8 4 4 0 000-8zm5.4-.2a1 1 0 11-2 0 1 1 0 012 0zM12 9.8a2.2 2.2 0 110 4.4 2.2 2.2 0 010-4.4z"/></svg>
        </div>
      </div>
      </div>

      <!-- Results card -->
      <div class="results">
        <div class="results-head">
          <span class="results-title">{{ $t('scenes.ads.resultsTitle') }}</span>
          <span class="badge">{{ $t('scenes.ads.roi') }}</span>
        </div>
        <div class="stats">
          <div>
            <div class="stat-label">{{ $t('scenes.ads.newClients') }}</div>
            <div class="stat-value" id="c1">{{ c1 }}</div>
            <div class="stat-trend"><span style="--w: 78%"></span></div>
          </div>
          <div class="divider"></div>
          <div>
            <div class="stat-label">{{ $t('scenes.ads.revenue') }}</div>
            <div class="stat-value"><span v-if="cur.before" class="currency">{{ cur.symbol }}</span><span id="c2">{{ c2 }}</span><span v-if="!cur.before" class="currency"> {{ cur.symbol }}</span></div>
            <div class="stat-trend b2"><span style="--w: 92%"></span></div>
          </div>
        </div>
      </div>

      <!-- Live bar -->
      <div class="live-bar">
        <span class="left"><span class="pulse"></span> {{ $t('scenes.ads.liveNow') }}</span>
        <span class="right">{{ $t('scenes.ads.volume') }}</span>
      </div>
    </div>
  </SceneCanvas>
</template>

<style scoped>
/* ----- Canvas ----- */
.canvas {
  position: relative;
  width: 360px;
  overflow: hidden;
  background: #ffffff;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 16px 0;
  font-family: 'Inter', system-ui, sans-serif;
  color: #1a1a2e;
  -webkit-font-smoothing: antialiased;
}

/* Decorative glows removed for plain-white background */
.canvas::before, .canvas::after { display: none; }

/* ----- Logo ----- */
.logo {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 5;
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  opacity: 0;
  animation: fadeUp 0.6s ease-out 0s forwards;
  animation-iteration-count: infinite;
  animation-duration: 12s;
}
.logo-mark {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #1a1a2e;
}
.logo-mark::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: linear-gradient(135deg, #00b4d8, #4cc9f0);
  box-shadow: 0 0 10px rgba(0,180,216,0.3);
}
.logo-sub {
  margin-top: 3px;
  margin-left: 16px;
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.22em;
  color: #94a3b8;
}

.live-pill {
  position: absolute;
  top: 18px;
  right: 16px;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px 4px 8px;
  border-radius: 20px;
  background: rgba(0,0,0,0.03);
  border: 1px solid #e5e7eb;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #94a3b8;
  opacity: 0;
  animation: fadeUp 0.6s ease-out 0s forwards;
  animation-iteration-count: infinite;
  animation-duration: 12s;
}
.live-pill .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

/* ----- Heading ----- */
.headline {
  position: relative;
  padding: 0 24px;
  text-align: center;
  z-index: 4;
  opacity: 0;
  animation: fadeUp 0.9s ease-out 0s forwards;
  animation-iteration-count: infinite;
  animation-duration: 12s;
}
.headline h1 {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
  color: #1a1a2e;
  letter-spacing: -0.01em;
}
.headline .accent {
  color: #00b4d8;
  font-style: italic;
  font-weight: 800;
}
.headline p {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 400;
  color: #94a3b8;
  letter-spacing: 0.02em;
}

/* ----- Orbital section ----- */
/* Fixed-height stage that re-creates the canvas area the orbit graphic used to
   occupy, so its absolutely-positioned ring/lines/icons keep their positions
   without depending on the old 640px canvas. 280px graphic + breathing room. */
.orbit-stage {
  position: relative;
  width: 100%;
  height: 300px;
  margin-top: 12px;
  z-index: 3;
}
.orbit-wrap {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  z-index: 3;
}

.orbit-ring {
  position: absolute;
  inset: 18px;
  border: 1px dashed rgba(0,0,0,0.08);
  border-radius: 50%;
  opacity: 0;
  animation: fadeIn 0.6s ease-out 0s forwards;
  animation-iteration-count: infinite;
  animation-duration: 12s;
}
.orbit-ring.outer {
  inset: -4px;
  border-color: rgba(0,180,216,0.12);
}

/* spinning aura */
.aura {
  position: absolute;
  inset: 38px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, rgba(0,180,216,0) 0deg, rgba(0,180,216,0.5) 60deg, rgba(0,180,216,0) 120deg, rgba(76,201,240,0.4) 200deg, rgba(0,180,216,0) 260deg, rgba(0,180,216,0.5) 340deg);
  filter: blur(8px);
  opacity: 0;
  animation: auraSpin 6s linear infinite, auraAppear 1s ease-out 0s forwards;
  animation-duration: 12s, 12s;
}
@keyframes auraSpin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes auraAppear {
  0%, 12%   { opacity: 0; }
  18%, 100% { opacity: 0.55; }
}

/* ----- Avatar (9:16 portrait video card) ----- */
.avatar {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 108px;
  height: 192px; /* 9:16 ratio */
  border-radius: 18px;
  transform: translate(-50%, -50%) scale(0);
  background: linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%);
  border: 2px solid rgba(0,180,216,0.55);
  box-shadow: 0 16px 44px rgba(0,0,0,0.1), 0 0 32px rgba(0,180,216,0.15), inset 0 0 0 4px rgba(0,0,0,0.02);
  overflow: hidden;
  z-index: 4;
  animation: avatarPop 0.9s cubic-bezier(.2,.9,.3,1.4) 1.5s forwards;
  animation-iteration-count: infinite;
  animation-duration: 12s;
}
.avatar video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.avatar::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%);
  pointer-events: none;
}
/* Caption overlay sits INSIDE the video card, pinned to its bottom */
.avatar-meta {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 14px 8px 8px;
  text-align: center;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.72) 100%);
  opacity: 0;
  transform: translateY(8px);
  animation: metaIn 12s ease-out infinite;
}
@keyframes metaIn {
  0%, 22%   { opacity: 0; transform: translateY(8px); }
  28%, 100% { opacity: 1; transform: translateY(0); }
}
.avatar-meta .name {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
  line-height: 1.1;
}
.avatar-meta .role {
  margin-top: 2px;
  font-size: 7px;
  font-weight: 600;
  color: #e0e0e0;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
@keyframes avatarPop {
  0%, 12%      { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  20%          { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
  25%, 100%    { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}

/* ----- Social icons positioned on circle ----- */
.social {
  position: absolute;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  margin: -19px 0 0 -19px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.06);
  opacity: 0;
  transform: translate(0,0) scale(0.4);
  z-index: 5;
}
.social svg { width: 18px; height: 18px; display: block; }

/* 6 positions around the portrait card */
.social.s1 { --x:    0px; --y: -128px; background: #ff0033; }                     /* top - YouTube */
.social.s2 { --x:  118px; --y:  -68px; background: #1877f2; }                     /* upper right - Facebook */
.social.s3 { --x:  118px; --y:   68px; background: #0a66c2; }                     /* lower right - LinkedIn */
.social.s4 { --x:    0px; --y:  128px; background: #000; border:1px solid rgba(0,0,0,0.12); } /* bottom - TikTok */
.social.s5 { --x: -118px; --y:   68px; background: #fff; }                        /* lower left - Google */
.social.s6 { --x: -118px; --y:  -68px; background: linear-gradient(135deg,#fdb913 0%,#ee2a7b 50%,#6228d7 100%); } /* upper left - Instagram */

/* Each icon's animation runs once per 12s loop. Start state (hidden at center)
   is set by the static .social rule above; the animation overrides only its
   own timeline window. animation-fill-mode: both keeps icons hidden BEFORE
   the delay starts, and locked in place AFTER it ends. */
.social {
  animation: socialIn 0.9s cubic-bezier(.22,.61,.36,1) both infinite;
  animation-duration: 0.9s, 12s; /* fly-in 0.9s, then loop period 12s via wrapper */
}
/* Use a single 12s keyframe with negative-delay-free timing so icons remain hidden until their slot. */
.social { animation: socialLoop 12s linear infinite; }
.social.s1 { animation-delay:  0s;    --t0: 19.5; } /* 2.34/12 = 19.5%  */
.social.s2 { animation-delay:  0s;    --t0: 20.5; } /* 2.46/12 = 20.5%  */
.social.s3 { animation-delay:  0s;    --t0: 21.5; } /* 2.58/12 = 21.5%  */
.social.s4 { animation-delay:  0s;    --t0: 22.5; } /* 2.70/12 = 22.5%  */
.social.s5 { animation-delay:  0s;    --t0: 23.5; } /* 2.82/12 = 23.5%  */
.social.s6 { animation-delay:  0s;    --t0: 24.5; } /* 2.94/12 = 24.5%  */

/* Per-icon keyframes: each gets its own animation that fully controls 12s.
   Hidden 0%->just-before-window, smooth tween across ~7%, hold to 100%. */
.social.s1 { animation-name: flyS1; }
.social.s2 { animation-name: flyS2; }
.social.s3 { animation-name: flyS3; }
.social.s4 { animation-name: flyS4; }
.social.s5 { animation-name: flyS5; }
.social.s6 { animation-name: flyS6; }

/* Single shared easing baked into the keyframe shape (cubic-bezier-ish via extra stop) */
@keyframes flyS1 {
  0%, 19.4%   { transform: translate(0,0) scale(0.4); opacity: 0; }
  27%         { transform: translate(0px, -128px) scale(1); opacity: 1; }
  100%        { transform: translate(0px, -128px) scale(1); opacity: 1; }
}
@keyframes flyS2 {
  0%, 20.4%   { transform: translate(0,0) scale(0.4); opacity: 0; }
  28%         { transform: translate(118px, -68px) scale(1); opacity: 1; }
  100%        { transform: translate(118px, -68px) scale(1); opacity: 1; }
}
@keyframes flyS3 {
  0%, 21.4%   { transform: translate(0,0) scale(0.4); opacity: 0; }
  29%         { transform: translate(118px, 68px) scale(1); opacity: 1; }
  100%        { transform: translate(118px, 68px) scale(1); opacity: 1; }
}
@keyframes flyS4 {
  0%, 22.4%   { transform: translate(0,0) scale(0.4); opacity: 0; }
  30%         { transform: translate(0px, 128px) scale(1); opacity: 1; }
  100%        { transform: translate(0px, 128px) scale(1); opacity: 1; }
}
@keyframes flyS5 {
  0%, 23.4%   { transform: translate(0,0) scale(0.4); opacity: 0; }
  31%         { transform: translate(-118px, 68px) scale(1); opacity: 1; }
  100%        { transform: translate(-118px, 68px) scale(1); opacity: 1; }
}
@keyframes flyS6 {
  0%, 24.4%   { transform: translate(0,0) scale(0.4); opacity: 0; }
  32%         { transform: translate(-118px, -68px) scale(1); opacity: 1; }
  100%        { transform: translate(-118px, -68px) scale(1); opacity: 1; }
}

.social .tag {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #10b981;
  color: #fff;
  font-size: 8px;
  font-weight: 800;
  padding: 2px 5px;
  border-radius: 8px;
  border: 1.5px solid #ffffff;
  letter-spacing: 0.04em;
  opacity: 0;
  animation: tagIn 0.4s ease-out 0s forwards;
  animation-iteration-count: infinite;
  animation-duration: 12s;
}
@keyframes tagIn {
  0%, 38%    { opacity: 0; transform: scale(0.5); }
  42%        { opacity: 1; transform: scale(1.1); }
  46%, 100%  { opacity: 1; transform: scale(1); }
}

/* Connection lines (SVG) */
.connect-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}
.connect-svg line {
  stroke: rgba(0,180,216,0.55);
  stroke-width: 1;
  stroke-dasharray: 3 4;
  stroke-dashoffset: 200;
  animation: drawLine 1.2s ease-out forwards;
  animation-iteration-count: infinite;
  animation-duration: 12s;
}
.connect-svg line:nth-child(1) { animation-delay: 4.0s; }
.connect-svg line:nth-child(2) { animation-delay: 4.1s; }
.connect-svg line:nth-child(3) { animation-delay: 4.2s; }
.connect-svg line:nth-child(4) { animation-delay: 4.3s; }
.connect-svg line:nth-child(5) { animation-delay: 4.4s; }
.connect-svg line:nth-child(6) { animation-delay: 4.5s; }
@keyframes drawLine {
  0%, 33%   { stroke-dashoffset: 200; opacity: 0; }
  36%       { opacity: 1; }
  45%, 100% { stroke-dashoffset: 0; opacity: 1; }
}

/* particles flowing along lines */
.pulse-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  margin: -2px 0 0 -2px;
  border-radius: 50%;
  background: #4cc9f0;
  box-shadow: 0 0 8px #00b4d8;
  opacity: 0;
  z-index: 3;
}
.pulse-dot.p1 { animation: pulseTo 1.6s ease-in-out 0s infinite; --tx:    0px; --ty: -128px; }
.pulse-dot.p2 { animation: pulseTo 1.6s ease-in-out 0s infinite; --tx:  118px; --ty:  -68px; }
.pulse-dot.p3 { animation: pulseTo 1.6s ease-in-out 0s infinite; --tx:  118px; --ty:   68px; }
.pulse-dot.p4 { animation: pulseTo 1.6s ease-in-out 0s infinite; --tx:    0px; --ty:  128px; }
.pulse-dot.p5 { animation: pulseTo 1.6s ease-in-out 0s infinite; --tx: -118px; --ty:   68px; }
.pulse-dot.p6 { animation: pulseTo 1.6s ease-in-out 0s infinite; --tx: -118px; --ty:  -68px; }
@keyframes pulseTo {
  0%   { transform: translate(var(--tx), var(--ty)) scale(0.6); opacity: 0; }
  20%  { opacity: 1; }
  100% { transform: translate(0,0) scale(1.2); opacity: 0; }
}

/* ----- Results card ----- */
.results {
  position: relative;
  margin: 12px 16px 0;
  padding: 14px 14px 12px;
  background: #f5f7fa;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
  opacity: 0;
  transform: translateY(20px);
  z-index: 4;
  animation: fadeUp 0.7s ease-out 0s forwards;
  animation-iteration-count: infinite;
  animation-duration: 12s;
}
.results-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.results-title {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.badge {
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(16,185,129,0.15);
  color: #10b981;
  letter-spacing: 0.02em;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transform: scale(0.6);
  animation: badgePulse 1s ease-out 0s forwards;
  animation-iteration-count: infinite;
  animation-duration: 12s;
}
.badge::before {
  content: "▲";
  font-size: 8px;
}
@keyframes badgePulse {
  0%, 60%    { opacity: 0; transform: scale(0.6); }
  66%        { opacity: 1; transform: scale(1.15); }
  72%        { transform: scale(1); }
  100%       { opacity: 1; transform: scale(1); }
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 16px;
  align-items: center;
}
.stats > div { min-width: 0; }
.divider {
  width: 1px;
  height: 48px;
  background: #e5e7eb;
  justify-self: center;
}
.stat-label {
  font-size: 10px;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #00b4d8;
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.stat-value .currency {
  font-size: 14px;
  font-weight: 700;
  margin-right: 1px;
  vertical-align: top;
  line-height: 1.6;
}
.stat-trend {
  margin-top: 6px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}
.stat-trend > span {
  display: block;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #00b4d8, #4cc9f0);
  border-radius: 3px;
  animation: barFill 1.2s ease-out 0s forwards;
  animation-iteration-count: infinite;
  animation-duration: 12s;
}
.stat-trend.b2 > span { animation-delay: 0s; }
@keyframes barFill {
  0%, 42%   { width: 0; }
  52%       { width: var(--w, 78%); }
  100%      { width: var(--w, 78%); }
}

/* ----- Footer Live Bar ----- */
.live-bar {
  position: relative;
  margin: 10px 16px 0;
  height: 38px;
  border-radius: 12px;
  background: rgba(16,185,129,0.08);
  border: 1px solid rgba(16,185,129,0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  overflow: hidden;
  z-index: 4;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.6s ease-out 0s forwards;
  animation-iteration-count: infinite;
  animation-duration: 12s;
}
.live-bar::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(16,185,129,0.18), transparent);
  transform: translateX(-100%);
  animation: shimmer 2.4s ease-in-out 0s infinite;
  animation-duration: 12s;
}
@keyframes shimmer {
  0%, 70%  { transform: translateX(-100%); }
  85%, 100%{ transform: translateX(100%); }
}
.live-bar .left {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #1a1a2e;
  z-index: 1;
}
.live-bar .pulse {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
}
.live-bar .pulse::after {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid #10b981;
  animation: ring 1.6s ease-out infinite;
}
@keyframes ring {
  0%   { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(1.8); opacity: 0; }
}
.live-bar .right {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.08em;
  z-index: 1;
  font-variant-numeric: tabular-nums;
}

/* ----- Generic helpers ----- */
@keyframes fadeUp {
  0%, 1%  { opacity: 0; transform: translateY(20px); }
  8%      { opacity: 1; transform: translateY(0); }
  100%    { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  0%, 11% { opacity: 0; }
  14%     { opacity: 1; }
  100%    { opacity: 1; }
}

/* Tiny credits / explainer outside the canvas */
.credit {
  position: fixed;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #94a3b8;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* USER FIX: static title — always visible, no fade-in */
.headline, .headline h1 {
  animation: none !important;
  opacity: 1 !important;
  transform: none !important;
}

/* CLM-NOLOOP-FIX: every animation runs once and holds its end state. */
*, *::before, *::after {
  animation-iteration-count: 1 !important;
  animation-fill-mode: forwards !important;
}
</style>
