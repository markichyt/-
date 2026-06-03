<script setup>
import { computed } from 'vue'
import QuizActionBar from '../QuizActionBar.vue'
import QuizContinueButton from '../QuizContinueButton.vue'
import PhoneCountryInput from './PhoneCountryInput.vue'
import { phoneCountries, DEFAULT_PHONE_COUNTRY, autocompleteByField } from '../../data/phoneCountries.js'
import { useQuizData } from '../../composables/useQuizData.js'
import { useQuizProgress } from '../../composables/useQuizProgress.js'

const props = defineProps({
  slide: { type: Object, required: true }
})

const { quizData } = useQuizData()
const { goToNextStep } = useQuizProgress()

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function autocompleteFor(field) {
  return autocompleteByField[field] || 'on'
}

function isFieldValid(field) {
  if (field.optional) return true
  const value = quizData[field.field]
  if (field.type === 'file') return !!value
  if (field.type === 'email') return EMAIL_PATTERN.test((value || '').trim())
  if (field.type === 'tel') {
    const stored = (value || '').replace(/\D/g, '')
    const country = phoneCountries[quizData.phone_country || DEFAULT_PHONE_COUNTRY]
    const dialDigits = country.code.replace(/\D/g, '')
    const local = stored.indexOf(dialDigits) === 0 ? stored.slice(dialDigits.length) : stored
    return local.length >= country.digits
  }
  return !!(value && String(value).trim())
}

const allFieldsValid = computed(() => props.slide.fields.every(isFieldValid))

function onFilePicked(field, event) {
  const file = event.target.files[0]
  if (file) quizData[field.field] = file.name
}

function submitForm() {
  if (allFieldsValid.value) goToNextStep()
}
</script>

<template>
  <div v-for="field in slide.fields" :key="field.field" class="form-group">
    <label class="form-label">
      {{ field.label }}<em v-if="!field.optional" class="form-req"> *</em>
    </label>

    <!-- File upload -->
    <template v-if="field.type === 'file'">
      <div
        class="upload-area"
        :class="{ uploaded: !!quizData[field.field] }"
        @click="$event.currentTarget.querySelector('input').click()"
      >
        <div class="upload-text">{{ quizData[field.field] || field.label }}</div>
        <input
          type="file"
          :accept="field.accept"
          style="display:none"
          @click.stop
          @change="onFilePicked(field, $event)"
        >
      </div>
    </template>

    <!-- Phone with country picker -->
    <PhoneCountryInput v-else-if="field.type === 'tel'" :field="field.field" />

    <!-- Text / email / other -->
    <input
      v-else
      v-model="quizData[field.field]"
      :type="field.type || 'text'"
      class="card-input"
      :placeholder="field.ph || ''"
      :name="field.field"
      :inputmode="field.type === 'email' ? 'email' : undefined"
      :autocomplete="autocompleteFor(field.field)"
    >
  </div>

  <QuizActionBar>
    <QuizContinueButton :disabled="!allFieldsValid" @continue="submitForm" />
  </QuizActionBar>
</template>
