<script>
export default {
  name: 'QuizContinueButton',
  props: {
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false }
  },
  computed: {
    displayLabel() {
      return this.label || this.$t('common.next')
    }
  }
}
</script>

<template>
  <button class="card-btn" :disabled="disabled" @click="$emit('continue')">
    {{ displayLabel }}
  </button>
</template>
