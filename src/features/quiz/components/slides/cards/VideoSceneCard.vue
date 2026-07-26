<script>
import { videoSceneSources } from '../../../data/videoScenes.js'
import { nativeScenes } from '../../scenes/nativeScenes.js'

// Renders an animation step. .mp4 sources render as a native <video> (and take
// priority over any legacy native Vue scene / iframe). Non-video sources fall
// back to a native Vue scene when available, else the Phase 1 HTML iframe. Media
// is only loaded/played while the card is the active one in the deck.
export default {
  name: 'VideoSceneCard',
  props: {
    sceneId: { type: String, required: true },
    active: { type: Boolean, default: false }
  },
  computed: {
    rawSrc() {
      return videoSceneSources[this.sceneId] || ''
    },
    isVideo() {
      return /\.mp4(\?|$)/i.test(this.rawSrc)
    },
    nativeScene() {
      return nativeScenes[this.sceneId]
    },
    sceneSrc() {
      return encodeURI(this.rawSrc)
    }
  },
  watch: {
    active(v) {
      const el = this.$refs.vid
      if (!el) return
      if (v) el.play().catch(() => {})
      else el.pause()
    }
  }
}
</script>

<template>
  <div class="video-wrap">
    <video
      v-if="isVideo"
      ref="vid"
      :src="active ? sceneSrc : ''"
      autoplay
      muted
      loop
      playsinline
      disablepictureinpicture
      controlslist="nodownload noplaybackrate nofullscreen"
      tabindex="-1"
      class="video-scene-vid"
      @contextmenu.prevent
    />
    <component :is="nativeScene" v-else-if="nativeScene && active" />
    <div v-else-if="nativeScene" class="video-scene-placeholder" />
    <iframe
      v-else
      :src="active ? sceneSrc : 'about:blank'"
      scrolling="no"
      frameborder="0"
      allow="autoplay"
      style="width:100%;aspect-ratio:360/576;border:0;display:block;background:#fff"
    />
  </div>
</template>

<style scoped>
.video-scene-vid {
  width: 100%;
  aspect-ratio: 3 / 4;
  border: 0;
  display: block;
  background: #000;
  object-fit: cover;
  border-radius: 14px;
  pointer-events: none;
}
/* Keeps the card height stable for a native scene while it is in the deck's
   background (matching the iframe's white box before it is activated). */
.video-scene-placeholder {
  width: 100%;
  aspect-ratio: 360 / 576;
  background: #fff;
}
</style>
