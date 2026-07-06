<script>
export default {
  name: 'QuizContinueButton',
  props: {
    label: { type: String, default: 'Далі →' },
    disabled: { type: Boolean, default: false }
  }
}
</script>

<template>
  <button class="card-btn" :disabled="disabled" @click="$emit('continue')">
    {{ label }}
  </button>
</template>
