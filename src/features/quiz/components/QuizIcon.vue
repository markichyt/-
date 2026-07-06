<script>
import { getQuizIconPath } from '../data/quizIcons.js'

export default {
  name: 'QuizIcon',
  props: {
    name: { type: String, required: true },
    size: { type: Number, default: 16 }
  },
  computed: {
    innerSvg() {
      return getQuizIconPath(this.name)
    }
  }
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    v-html="innerSvg"
  />
</template>
