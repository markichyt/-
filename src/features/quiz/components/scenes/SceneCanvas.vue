<script>
// Shared wrapper for the native animation scenes. Scenes are authored at a fixed
// 360px design width; this scales that width to fill the card and sizes the
// frame to the scene's actual content height — so every scene gets the same
// tight top margin as the rest of the quiz instead of the dead space baked into
// the original 360×640 video canvas.
const DESIGN_WIDTH = 360

export default {
  name: 'SceneCanvas',
  data() {
    return {
      scale: 1,
      frameHeight: 0,
      offsetX: 0,
    }
  },
  mounted() {
    this.measure()
    this._observer = new ResizeObserver(this.measure)
    this._observer.observe(this.$refs.frame)
    this._observer.observe(this.$refs.inner)
    // Watch the parent too, so the scene re-fits when the card height changes
    // (e.g. the full-screen mobile layout / orientation change).
    if (this.$refs.frame.parentElement) this._observer.observe(this.$refs.frame.parentElement)
  },
  beforeDestroy() {
    if (this._observer) this._observer.disconnect()
  },
  methods: {
    measure() {
      const frame = this.$refs.frame
      const inner = this.$refs.inner
      if (!frame || !inner) return
      const frameWidth = frame.clientWidth
      const contentHeight = inner.offsetHeight // un-transformed layout height
      let scale = frameWidth / DESIGN_WIDTH
      let frameHeight = contentHeight * scale
      // If the parent constrains the height (full-screen mobile card), scale the
      // whole scene down so it fits instead of being clipped by the button.
      const available = frame.parentElement ? frame.parentElement.clientHeight : 0
      if (available && frameHeight > available) {
        scale = available / contentHeight
        frameHeight = available
      }
      this.scale = scale
      this.frameHeight = frameHeight
      // Centre horizontally when the scene is narrower than the frame.
      this.offsetX = Math.max(0, (frameWidth - DESIGN_WIDTH * scale) / 2)
    },
  },
}
</script>

<template>
  <div ref="frame" class="scene-frame" :style="frameHeight ? { height: frameHeight + 'px' } : null">
    <div ref="inner" class="scene-inner" :style="{ transform: `translateX(${offsetX}px) scale(${scale})` }">
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
