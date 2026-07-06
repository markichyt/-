<script>
import { phoneCountries, DEFAULT_PHONE_COUNTRY, formatPhone } from '../../data/phoneCountries.js'
import { quizData } from '../../store/quizDataStore.js'

const COUNTRY_ENTRIES = Object.entries(phoneCountries).map(([key, value]) => ({ key, ...value }))

export default {
  name: 'PhoneCountryInput',
  props: {
    field: { type: String, required: true }
  },
  data() {
    return {
      countryKey: quizData.phone_country || DEFAULT_PHONE_COUNTRY,
      displayValue: '',
      isPickerOpen: false,
      countryEntries: COUNTRY_ENTRIES
    }
  },
  computed: {
    currentCountry() {
      return phoneCountries[this.countryKey] || phoneCountries[DEFAULT_PHONE_COUNTRY]
    }
  },
  mounted() {
    // Restore any previously entered number, stripping the stored dial-code prefix.
    const stored = quizData[this.field]
    if (stored) {
      const local = stored.replace(this.currentCountry.code, '').trim()
      this.displayValue = formatPhone(local.replace(/\D/g, ''), this.currentCountry.mask)
    }
    this.syncStoredValue()
    document.addEventListener('click', this.closePicker)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closePicker)
  },
  methods: {
    // Re-derive the stored value (dial code + masked local number). Stays empty
    // until a digit is entered, so a bare dial code is not counted as filled in.
    syncStoredValue() {
      quizData[this.field] = this.displayValue ? this.currentCountry.code + ' ' + this.displayValue : ''
      this.$emit('changed')
    },
    applyCountry(key) {
      this.countryKey = key
      quizData.phone_country = key
      const rawDigits = this.displayValue.replace(/\D/g, '')
      this.displayValue = formatPhone(rawDigits, this.currentCountry.mask)
      this.syncStoredValue()
    },
    onInput(event) {
      const rawDigits = event.target.value.replace(/\D/g, '').slice(0, this.currentCountry.digits)
      this.displayValue = formatPhone(rawDigits, this.currentCountry.mask)
      this.syncStoredValue()
    },
    selectCountry(key) {
      this.applyCountry(key)
      this.isPickerOpen = false
    },
    closePicker(event) {
      if (this.$refs.root && !this.$refs.root.contains(event.target)) this.isPickerOpen = false
    }
  }
}
</script>

<template>
  <div ref="root" class="phone-wrap">
    <button type="button" class="phone-cc" @click.stop="isPickerOpen = !isPickerOpen">
      <span class="phone-cc-flag">{{ currentCountry.flag }}</span>
      <span class="phone-cc-code">{{ currentCountry.code }}</span>
      <span class="phone-cc-chev">▾</span>
    </button>

    <input
      type="tel"
      class="card-input phone-input"
      :name="field"
      autocomplete="tel-national"
      inputmode="tel"
      :placeholder="currentCountry.ph"
      :maxlength="currentCountry.max"
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
