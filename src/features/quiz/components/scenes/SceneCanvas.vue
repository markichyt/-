<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Shared wrapper for the native animation scenes. Scenes are authored at a fixed
// 360px design width; this scales that width to fill the card and sizes the
// frame to the scene's actual content height — so every scene gets the same
// tight top margin as the rest of the quiz instead of the dead space baked into
// the original 360×640 video canvas.
const DESIGN_WIDTH = 360

const frame = ref(null)
const inner = ref(null)
const scale = ref(1)
const frameHeight = ref(0)
let observer = null

function measure() {
  if (!frame.value || !inner.value) return
  scale.value = frame.value.clientWidth / DESIGN_WIDTH
  // offsetHeight is the un-transformed layout height; multiply by scale for the
  // visible height so the frame wraps the scaled content exactly.
  frameHeight.value = inner.value.offsetHeight * scale.value
}

onMounted(() => {
  measure()
  observer = new ResizeObserver(measure)
  observer.observe(frame.value)
  observer.observe(inner.value)
})
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div ref="frame" class="scene-frame" :style="frameHeight ? { height: frameHeight + 'px' } : null">
    <div ref="inner" class="scene-inner" :style="{ transform: `scale(${scale})` }">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.scene-frame {
  width: 100%;
  overflow: hidden;
  background: #fff;
}
.scene-inner {
  width: 360px;
  transform-origin: top left;
}
</style>
