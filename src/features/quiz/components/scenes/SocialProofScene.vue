<script>
import { publicAsset } from '../../data/publicAsset.js'
import SceneCanvas from './SceneCanvas.vue'
import { market } from '../../../../i18n/marketConfig.js'
import { formatMoneyCompact } from '../../../../i18n/format.js'

// Native Vue rebuild of htmlTOvideo/8 — the "2,500+ attorneys" social-proof
// scene (step 3). Two tilted avatar carousels scroll once on entry (the
// original was authored as a one-shot, screen-recordable animation). Content
// is authored at 360px width and wrapped in SceneCanvas, which scales it to
// fill the card and wraps the frame to the content height.

const PHOTOS = Array.from({ length: 28 }, (_, i) => publicAsset(`htmlTOvideo/8/avatars/${String(i + 1).padStart(2, '0')}.png`))

const TOP_PHOTOS = PHOTOS.slice(0, 20)
const BOT_PHOTOS = [...PHOTOS.slice(20, 28), ...PHOTOS.slice(0, 12)]

export default {
  name: 'SocialProofScene',
  components: { SceneCanvas },
  computed: {
    // Доходи на плашках — з marketConfig, форматуються під валюту локалі.
    // Дві копії ряду — для безшовного прокручування.
    topRow() {
      const inc = market(this.$i18n.locale).incomes.top
      const a = TOP_PHOTOS.map((src, i) => ({ src, income: formatMoneyCompact(inc[i]) }))
      return [...a, ...a]
    },
    botRow() {
      const inc = market(this.$i18n.locale).incomes.bot
      const a = BOT_PHOTOS.map((src, i) => ({ src, income: formatMoneyCompact(inc[i]) }))
      return [...a, ...a]
    }
  }
}
</script>

<template>
  <SceneCanvas>
    <div class="canvas">
      <div class="header-card">
        <div style="margin-top:2px">
          <span class="big">{{ $t('scenes.social.count') }}</span><span class="line">{{ $t('scenes.social.countLabel') }}</span>
        </div>
        <div class="line">{{ $t('scenes.social.headline') }}</div>
        <div class="sub"><span class="dot" /> {{ $t('scenes.social.sub') }}</div>
      </div>

      <div class="carousels">
        <div class="tilt top">
          <div class="row top">
            <div v-for="(a, i) in topRow" :key="'t' + i" class="avatar">
              <img :src="a.src" alt="" loading="eager" decoding="async">
              <div class="badge">{{ a.income }}</div>
            </div>
          </div>
        </div>
        <div class="tilt bottom">
          <div class="row bottom">
            <div v-for="(a, i) in botRow" :key="'b' + i" class="avatar">
              <img :src="a.src" alt="" loading="eager" decoding="async">
              <div class="badge">{{ a.income }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats">
        <div class="stat"><div class="num">{{ $t('scenes.social.stats.growthNum') }}</div><div class="cap">{{ $t('scenes.social.stats.growthCap') }}</div></div>
        <div class="divider" />
        <div class="stat"><div class="num">{{ $t('scenes.social.stats.renewNum') }}</div><div class="cap">{{ $t('scenes.social.stats.renewCap') }}</div></div>
        <div class="divider" />
        <div class="stat"><div class="num">{{ $t('scenes.social.stats.countriesNum') }}</div><div class="cap">{{ $t('scenes.social.stats.countriesCap') }}</div></div>
      </div>
    </div>
  </SceneCanvas>
</template>

<style scoped>
.canvas {
  width: 360px;
  background: #fff;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 16px 0 20px;
  gap: 18px;
  font-family: 'Inter', system-ui, sans-serif;
}

/* Header card */
.header-card {
  margin: 0 16px;
  background: #fff;
  border-radius: 20px;
  padding: 20px 22px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06), 0 2px 6px rgba(0,180,216,0.06);
  text-align: left;
  position: relative;
  z-index: 2;
  animation: headerIn 0.7s cubic-bezier(.22,.9,.3,1) both;
}
.header-card .line { color: #1a1a2e; font-weight: 700; font-size: 22px; line-height: 1.18; letter-spacing: -0.02em; }
.header-card .big { color: #00b4d8; font-weight: 800; font-size: 28px; letter-spacing: -0.02em; display: inline-block; margin-right: 6px; }
.header-card .sub { margin-top: 6px; color: #64748b; font-weight: 500; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
.header-card .sub .dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.18); animation: pulse 1.6s ease-in-out infinite; }

@keyframes headerIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%,100% { box-shadow: 0 0 0 3px rgba(16,185,129,0.18); } 50% { box-shadow: 0 0 0 6px rgba(16,185,129,0.05); } }

/* Carousels */
.carousels {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 28px;
  position: relative;
  z-index: 1;
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);
  overflow: hidden;
  padding: 18px 0;
}
.tilt { width: 100%; }
.tilt.top { transform: rotate(-3.5deg); }
.tilt.bottom { transform: rotate(-3.5deg); }

.row { display: flex; width: max-content; gap: 16px; padding: 0 8px; }
/* One-shot scroll, matching the original CLM-NOLOOP-FIX. */
.row.top { animation: scrollLeft 25s linear 1 forwards; }
.row.bottom { animation: scrollRight 30s linear 1 forwards; }

@keyframes scrollLeft { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes scrollRight { from { transform: translateX(-50%); } to { transform: translateX(0); } }

/* Avatar */
.avatar {
  flex: 0 0 auto;
  width: 80px;
  height: 80px;
  border-radius: 18px;
  position: relative;
  overflow: visible;
  background: #f5f7fa;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px #e5e7eb;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 18px; display: block; }
.avatar::after { content: ""; position: absolute; inset: 0; border-radius: 18px; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06); pointer-events: none; }

.badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: rgba(16,185,129,0.95);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 7px;
  border-radius: 8px;
  border: 2px solid #fff;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 10px rgba(16,185,129,0.35);
}

/* Featured */
.featured { text-align: center; padding: 0 20px; position: relative; z-index: 2; animation: fadeIn 0.9s ease-out 0.5s both; }
.featured .label { color: #64748b; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 10px; }
.featured .logos { display: flex; align-items: center; justify-content: center; gap: 10px; color: #1a1a2e; font-weight: 700; font-size: 14px; letter-spacing: -0.01em; }
.featured .logos .sep { width: 3px; height: 3px; background: #4cc9f0; border-radius: 50%; opacity: 0.7; }
.featured .logos span.brand { background: linear-gradient(180deg, #1a1a2e 0%, #444 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

/* Stats strip */
.stats { display: flex; align-items: stretch; padding: 0 16px; gap: 4px; position: relative; z-index: 2; animation: fadeIn 0.9s ease-out 0.3s both; }
.stats .stat { flex: 1; text-align: center; min-width: 0; }
.stats .num { color: #00b4d8; font-weight: 800; font-size: 22px; letter-spacing: -0.02em; line-height: 1; }
.stats .cap { color: #94a3b8; font-size: 9px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; margin-top: 4px; line-height: 1.2; }
.stats .divider { width: 1px; background: #e5e7eb; flex-shrink: 0; }
</style>
