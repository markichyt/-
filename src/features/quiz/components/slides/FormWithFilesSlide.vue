<script>
import QuizActionBar from '../QuizActionBar.vue'
import QuizContinueButton from '../QuizContinueButton.vue'
import PhoneCountryInput from './PhoneCountryInput.vue'
import { phoneCountries, DEFAULT_PHONE_COUNTRY, autocompleteByField } from '../../data/phoneCountries.js'
import { quizData } from '../../store/quizDataStore.js'
import { goToNextStep } from '../../store/quizProgressStore.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Пароль: мінімум 5 символів, хоча б одна велика літера та одна цифра.
const PASSWORD_MIN = 5
const PASSWORD_UPPER = /[A-ZА-ЯЁЇІЄҐ]/
const PASSWORD_DIGIT = /\d/

export default {
  name: 'FormWithFilesSlide',
  components: { QuizActionBar, QuizContinueButton, PhoneCountryInput },
  props: {
    slide: { type: Object, required: true }
  },
  data() {
    return { quizData, touched: {} }
  },
  computed: {
    allFieldsValid() {
      return this.slide.fields.every(this.isFieldValid)
    }
  },
  methods: {
    autocompleteFor(field) {
      if (field === 'password' || field === 'password_confirm') return 'new-password'
      return autocompleteByField[field] || 'on'
    },
    isFieldValid(field) {
      if (field.optional) return true
      const value = quizData[field.field]
      if (field.type === 'file') return !!value
      if (field.type === 'email') return EMAIL_PATTERN.test((value || '').trim())
      if (field.type === 'password') {
        const v = value || ''
        // Поле підтвердження — має точно збігатися з основним паролем.
        if (field.match) return !!v && v === (quizData[field.match] || '')
        return v.length >= PASSWORD_MIN && PASSWORD_UPPER.test(v) && PASSWORD_DIGIT.test(v)
      }
      if (field.type === 'tel') {
        const stored = (value || '').replace(/\D/g, '')
        const country = phoneCountries[quizData.phone_country || DEFAULT_PHONE_COUNTRY]
        const dialDigits = country.code.replace(/\D/g, '')
        const local = stored.indexOf(dialDigits) === 0 ? stored.slice(dialDigits.length) : stored
        return local.length >= country.digits
      }
      return !!(value && String(value).trim())
    },
    // Текст помилки під полем (показуємо лише після «дотику» або спроби надіслати).
    errorFor(field) {
      if (!this.touched[field.field] || this.isFieldValid(field)) return ''
      const value = quizData[field.field]
      if (field.type === 'file') return 'Додайте файл'
      if (field.type === 'email') return (value || '').trim() ? 'Невірний формат email' : 'Заповніть це поле'
      if (field.type === 'tel') return 'Невірний номер телефону'
      if (field.type === 'password') {
        if (field.match) return (value || '') ? 'Паролі не збігаються' : 'Повторіть пароль'
        return (value || '') ? 'Мін 5 символів, велика літера і цифра' : 'Заповніть це поле'
      }
      return 'Заповніть це поле'
    },
    markTouched(field) {
      this.$set(this.touched, field, true)
    },
    onFilePicked(field, event) {
      const file = event.target.files[0]
      if (!file) return
      quizData[field.field] = file.name
      this.markTouched(field.field)
      // Зберігаємо фото як data-URL, щоб показати його далі в профілі.
      if (field.field === 'photo_name' && file.type.indexOf('image/') === 0) {
        const reader = new FileReader()
        reader.onload = () => { quizData.photo_data = reader.result }
        reader.readAsDataURL(file)
      }
    },
    openFilePicker(event) {
      event.currentTarget.querySelector('input').click()
    },
    submitForm() {
      // Позначаємо всі поля «дотиками», щоб показати помилки під невалідними.
      this.slide.fields.forEach((f) => this.markTouched(f.field))
      if (this.allFieldsValid) goToNextStep()
    }
  }
}
</script>

<template>
  <div class="form-with-files-slide">
    <div
      v-for="field in slide.fields"
      :key="field.field"
      class="form-group"
      :class="{ 'form-group--invalid': errorFor(field) }"
    >
      <label class="form-label">
        {{ field.label }}<em v-if="!field.optional" class="form-req"> *</em>
      </label>

      <!-- File upload -->
      <template v-if="field.type === 'file'">
        <div
          class="upload-area"
          :class="{ uploaded: !!quizData[field.field] }"
          @click="openFilePicker"
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
      <PhoneCountryInput
        v-else-if="field.type === 'tel'"
        :field="field.field"
        @changed="markTouched(field.field)"
      />

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
        @blur="markTouched(field.field)"
      >

      <div v-if="errorFor(field)" class="form-error">{{ errorFor(field) }}</div>
    </div>

    <QuizActionBar>
      <QuizContinueButton @continue="submitForm" />
    </QuizActionBar>
  </div>
</template>
