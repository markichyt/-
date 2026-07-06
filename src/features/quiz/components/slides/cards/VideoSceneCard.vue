<script>
import { videoSceneSources } from '../../../data/videoScenes.js'
import { nativeScenes } from '../../scenes/nativeScenes.js'

// Renders an animation step. Scenes with a native Vue rebuild (Phase 2) are
// mounted only while the card is active so their one-shot animation replays on
// entry. Scenes not yet rebuilt fall back to the Phase 1 iframe, whose real
// source is likewise only loaded while active.
export default {
  name: 'VideoSceneCard',
  props: {
    sceneId: { type: String, required: true },
    active: { type: Boolean, default: false }
  },
  computed: {
    nativeScene() {
      return nativeScenes[this.sceneId]
    },
    sceneSrc() {
      return encodeURI(videoSceneSources[this.sceneId] || '')
    }
  }
}
</script>

<template>
  <div class="video-wrap">
    <component :is="nativeScene" v-if="nativeScene && active" />
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
/* Keeps the card height stable for a native scene while it is in the deck's
   background (matching the iframe's white box before it is activated). */
.video-scene-placeholder {
  width: 100%;
  aspect-ratio: 360 / 576;
  background: #fff;
}
</style>
