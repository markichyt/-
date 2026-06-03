<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { phoneCountries, DEFAULT_PHONE_COUNTRY, formatPhone } from '../../data/phoneCountries.js'
import { useQuizData } from '../../composables/useQuizData.js'

const props = defineProps({
  field: { type: String, required: true }
})
const emit = defineEmits(['changed'])

const { quizData } = useQuizData()

const countryKey = ref(quizData.phone_country || DEFAULT_PHONE_COUNTRY)
const displayValue = ref('')
const isPickerOpen = ref(false)
const root = ref(null)

const countryEntries = Object.entries(phoneCountries).map(([key, value]) => ({ key, ...value }))

function currentCountry() {
  return phoneCountries[countryKey.value] || phoneCountries[DEFAULT_PHONE_COUNTRY]
}

// Re-derive the stored value (dial code + masked local number) for the field.
// Stays empty until a digit is entered, so the profile scale and validation do
// not count a bare dial code as a filled-in phone number.
function syncStoredValue() {
  const country = currentCountry()
  quizData[props.field] = displayValue.value ? country.code + ' ' + displayValue.value : ''
  emit('changed')
}

function applyCountry(key) {
  countryKey.value = key
  quizData.phone_country = key
  const country = currentCountry()
  const rawDigits = displayValue.value.replace(/\D/g, '')
  displayValue.value = formatPhone(rawDigits, country.mask)
  syncStoredValue()
}

function onInput(event) {
  const country = currentCountry()
  const rawDigits = event.target.value.replace(/\D/g, '').slice(0, country.digits)
  displayValue.value = formatPhone(rawDigits, country.mask)
  syncStoredValue()
}

function selectCountry(key) {
  applyCountry(key)
  isPickerOpen.value = false
}

function closePicker(event) {
  if (root.value && !root.value.contains(event.target)) isPickerOpen.value = false
}

onMounted(() => {
  // Restore any previously entered number, stripping the stored dial-code prefix.
  const stored = quizData[props.field]
  if (stored) {
    const country = currentCountry()
    const local = stored.replace(country.code, '').trim()
    displayValue.value = formatPhone(local.replace(/\D/g, ''), country.mask)
  }
  syncStoredValue()
  document.addEventListener('click', closePicker)
})

onUnmounted(() => document.removeEventListener('click', closePicker))
</script>

<template>
  <div ref="root" class="phone-wrap">
    <button type="button" class="phone-cc" @click.stop="isPickerOpen = !isPickerOpen">
      <span class="phone-cc-flag">{{ currentCountry().flag }}</span>
      <span class="phone-cc-code">{{ currentCountry().code }}</span>
      <span class="phone-cc-chev">▾</span>
    </button>

    <input
      type="tel"
      class="card-input phone-input"
      :name="field"
      autocomplete="tel-national"
      inputmode="tel"
      :placeholder="currentCountry().ph"
      :maxlength="currentCountry().max"
      :value="displayValue"
      @input="onInput"
    >

    <div class="phone-cc-list" :style="{ display: isPickerOpen ? 'block' : 'none' }">
      <div
        v-for="country in countryEntries"
        :key="country.key"
        class="phone-cc-item"
        @click.stop="selectCountry(country.key)"
      >
        <span class="phone-cc-flag">{{ country.flag }}</span>
        <span class="phone-cc-name">{{ country.name }}</span>
        <span class="phone-cc-code">{{ country.code }}</span>
      </div>
    </div>
  </div>
</template>
