<script setup>
import { allSceneSources } from '../data/videoScenes.js'

// Loads every animation scene into a hidden, off-screen iframe at quiz start so
// the heavy avatar/scene assets are cached before the user reaches those steps.
const prewarmSources = allSceneSources.map((src) => encodeURI(src))
</script>

<template>
  <div
    aria-hidden="true"
    style="position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;visibility:hidden;pointer-events:none;overflow:hidden"
  >
    <iframe
      v-for="src in prewarmSources"
      :key="src"
      :src="src"
      tabindex="-1"
      aria-hidden="true"
      style="width:1px;height:1px;border:0"
    />
  </div>
</template>
