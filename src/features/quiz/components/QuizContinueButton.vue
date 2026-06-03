<script setup>
defineProps({
  label: { type: String, default: 'Continue →' },
  disabled: { type: Boolean, default: false }
})
defineEmits(['continue'])
</script>

<template>
  <button class="card-btn" :disabled="disabled" @click="$emit('continue')">
    {{ label }}
  </button>
</template>
