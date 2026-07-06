<script>
import QuizIcon from '../../QuizIcon.vue'
import QuizActionBar from '../../QuizActionBar.vue'
import QuizContinueButton from '../../QuizContinueButton.vue'
import { quizData } from '../../../store/quizDataStore.js'
import { goToNextStep } from '../../../store/quizProgressStore.js'
import { publicAsset } from '../../../data/publicAsset.js'

// Крок завантаження фото для генерації відео-аватара.
// Приймає лише JPEG/PNG до 5 МБ. Перевіряє співвідношення 9:16 (вертикальне);
// якщо фото не вертикальне — попереджає, а на сабміті показує модалку-застереження.
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']
const MAX_BYTES = 5 * 1024 * 1024
const TARGET_RATIO = 9 / 16 // 0.5625
const RATIO_TOLERANCE = 0.05 // ±5 %

// Готові приклади вдалих фото (вертикальні 9:16). Слугують і зразком того, яке
// фото потрібне, і запасним варіантом, якщо у користувача немає власного.
const SAMPLE_PHOTOS = [
  { id: 'woman', label: 'Зразок', file: 'lawyer-woman.jpg', src: publicAsset('images/samples/lawyer-woman.jpg') },
  { id: 'man', label: 'Зразок', file: 'lawyer-man.jpg', src: publicAsset('images/samples/lawyer-man.jpg') }
]

// Помилки перевірки фото. WRONG_RATIO перевіряється на клієнті (співвідношення
// сторін), решта — коди від бекенду (перевірка вмісту фото). canContinue=true
// лише для «мʼякого» попередження, коли аватар усе одно можна згенерувати.
const PHOTO_ERRORS = {
  WRONG_RATIO: {
    title: 'Фото неправильного формату',
    bodyHtml: 'Ви прикріпили фото неправильного розширення (не 9:16). Через це <strong class="pu-modal-danger">аватар буде згенеровано некоректно</strong> — у відео зʼявляться сірі поля.',
    canContinue: true
  },
  NO_PERSON: {
    title: 'Людину не знайдено',
    bodyHtml: 'На фото не знайдено людину. Завантажте своє <strong class="pu-modal-danger">портретне фото</strong>.',
    canContinue: false
  },
  MULTIPLE_PEOPLE: {
    title: 'Більше однієї людини',
    bodyHtml: 'На фото більше однієї людини. Потрібне фото <strong class="pu-modal-danger">тільки з вами</strong>.',
    canContinue: false
  },
  FACE_NOT_VISIBLE: {
    title: 'Обличчя не видно',
    bodyHtml: 'Обличчя не видно на фото. Потрібне фото, де <strong class="pu-modal-danger">добре видно ваше обличчя</strong>.',
    canContinue: false
  }
}

export default {
  name: 'PhotoUploadCard',
  components: { QuizIcon, QuizActionBar, QuizContinueButton },
  data() {
    return {
      quizData,
      samples: SAMPLE_PHOTOS,
      selectedSampleId: '',
      previewSrc: '',
      dimText: '',
      photoIsValid: true,
      hasPhoto: false,
      dropHint: 'Натисніть, щоб завантажити своє фото',
      isDragOver: false,
      photoErrorCode: ''
    }
  },
  computed: {
    photoError() {
      return PHOTO_ERRORS[this.photoErrorCode] || null
    }
  },
  mounted() {
    // Відновлюємо фото при поверненні на крок назад.
    if (quizData.photo_data) {
      this.previewSrc = quizData.photo_data
      this.hasPhoto = true
      const sample = SAMPLE_PHOTOS.find((s) => s.src === quizData.photo_data)
      if (sample) {
        this.selectedSampleId = sample.id
        this.photoIsValid = true
        this.dimText = '9:16'
      } else {
        this.measureImage(quizData.photo_data)
      }
    }
    document.addEventListener('keydown', this.onKeydown)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeydown)
    document.body.style.overflow = ''
  },
  watch: {
    photoErrorCode(code) {
      document.body.style.overflow = code ? 'hidden' : ''
    }
  },
  methods: {
    triggerFilePicker() {
      this.$refs.fileInput.click()
    },
    onFileChange(event) {
      const file = event.target.files[0]
      this.handleFile(file)
      // Скидаємо, щоб повторний вибір того самого файлу теж спрацював.
      event.target.value = ''
    },
    onDrop(event) {
      this.isDragOver = false
      const file = event.dataTransfer.files[0]
      this.handleFile(file)
    },
    handleFile(file) {
      if (!file) return
      if (ACCEPTED_TYPES.indexOf(file.type) === -1) {
        this.dropHint = 'Невірний формат — лише JPEG / PNG'
        return
      }
      if (file.size > MAX_BYTES) {
        this.dropHint = 'Файл завеликий — максимум 5 МБ'
        return
      }
      this.dropHint = 'Натисніть, щоб завантажити своє фото'
      const reader = new FileReader()
      reader.onload = () => {
        this.previewSrc = reader.result
        this.hasPhoto = true
        this.selectedSampleId = '' // власне фото — знімаємо вибір прикладу
        quizData.photo_name = file.name
        quizData.photo_data = reader.result
        this.measureImage(reader.result)
      }
      reader.readAsDataURL(file)
    },
    // Вибір готового прикладу — вони вже у форматі 9:16, тож одразу валідні.
    selectSample(sample) {
      this.previewSrc = sample.src
      this.hasPhoto = true
      this.selectedSampleId = sample.id
      this.photoIsValid = true
      this.dimText = '9:16'
      quizData.photo_name = sample.file
      quizData.photo_data = sample.src
    },
    measureImage(src) {
      const img = new Image()
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight
        this.dimText = img.naturalWidth + 'x' + img.naturalHeight
        this.photoIsValid = Math.abs(ratio - TARGET_RATIO) <= TARGET_RATIO * RATIO_TOLERANCE
      }
      img.src = src
    },
    onSubmit() {
      if (!this.hasPhoto) return
      // Клієнтська перевірка — лише співвідношення сторін. Перевірку вмісту фото
      // (людина / обличчя / к-сть людей) робить бекенд і повертає код помилки,
      // який фронт показує через showPhotoError(code).
      if (this.photoIsValid) {
        goToNextStep()
      } else {
        this.photoErrorCode = 'WRONG_RATIO'
      }
    },
    // Показати модалку помилки за кодом з бекенду:
    // NO_PERSON / MULTIPLE_PEOPLE / FACE_NOT_VISIBLE (або WRONG_RATIO).
    showPhotoError(code) {
      if (PHOTO_ERRORS[code]) this.photoErrorCode = code
    },
    closeModal() {
      this.photoErrorCode = ''
    },
    modalUploadOther() {
      this.photoErrorCode = ''
      this.triggerFilePicker()
    },
    modalProceed() {
      this.photoErrorCode = ''
      goToNextStep()
    },
    onKeydown(event) {
      if (event.key === 'Escape' && this.photoErrorCode) this.photoErrorCode = ''
    }
  }
}
</script>

<template>
  <div class="photo-upload-card">
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png"
      class="pu-input"
      @change="onFileChange"
    >

    <!-- Drop-zone -->
    <label
      v-show="!hasPhoto"
      class="pu-dropzone"
      :class="{ 'is-dragover': isDragOver }"
      @click.prevent="triggerFilePicker"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="onDrop"
    >
      <div class="pu-drop-icon"><QuizIcon name="camera" :size="38" /></div>
      <div class="pu-drop-title">{{ dropHint }}</div>
      <div class="pu-drop-sub">JPEG або PNG · до 5 МБ · вертикальне 9:16</div>
    </label>

    <!-- Превʼю 9:16 -->
    <template v-if="hasPhoto">
      <div class="pu-preview" @click="triggerFilePicker">
        <img :src="previewSrc" class="pu-preview-img" alt="Прев'ю фото">
        <div class="pu-dim-badge" :class="{ warn: !photoIsValid }">{{ dimText }}</div>
      </div>

      <div v-if="!photoIsValid" class="pu-warn-text">
        ⚠ Фото не є вертикальним 9:16 — у відео будуть сірі поля
      </div>
      <button type="button" class="pu-upload-own" @click="triggerFilePicker">
        <QuizIcon name="upload" :size="16" /> Завантажити своє фото
      </button>
    </template>

    <!-- Галерея прикладів (завжди доступна: і зразок, і запасний варіант) -->
    <div class="pu-samples">
      <div class="pu-samples-title">Немає власного фото під рукою? Оберіть зразок 👇</div>
      <div class="pu-samples-row">
        <button
          v-for="s in samples"
          :key="s.id"
          type="button"
          class="pu-sample"
          :class="{ selected: selectedSampleId === s.id }"
          @click="selectSample(s)"
        >
          <img :src="s.src" class="pu-sample-img" :alt="s.label">
          <span class="pu-sample-cap">{{ s.label }}</span>
        </button>
      </div>
    </div>

    <!-- Модалка-застереження (текст залежить від коду помилки) -->
    <div class="pu-modal" :class="{ open: !!photoError }" :hidden="!photoError">
      <div class="pu-modal-overlay" @click="closeModal" />
      <div v-if="photoError" class="pu-modal-card">
        <div class="pu-modal-icon">⚠️</div>
        <div class="pu-modal-title">{{ photoError.title }}</div>
        <div class="pu-modal-body" v-html="photoError.bodyHtml" />
        <div class="pu-modal-actions">
          <button type="button" class="pu-modal-primary" @click="modalUploadOther">
            Завантажити інше фото
          </button>
          <button v-if="photoError.canContinue" type="button" class="pu-modal-quiet" @click="modalProceed">
            Продовжити
          </button>
        </div>
      </div>
    </div>

    <QuizActionBar>
      <QuizContinueButton :disabled="!hasPhoto" @continue="onSubmit" />
    </QuizActionBar>
  </div>
</template>

<style scoped>
.pu-input { display: none; }

/* ---- Drop-zone ---- */
.pu-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 2px dashed var(--border);
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color .2s, background .2s;
}
.pu-dropzone:hover,
.pu-dropzone.is-dragover {
  border-color: var(--accent);
  background: rgba(0, 180, 216, 0.05);
}
.pu-drop-icon { display: flex; color: var(--accent); }
.pu-drop-title { font-size: 15px; font-weight: 600; color: var(--text-dark); }
.pu-drop-sub { font-size: 12px; color: var(--text-light); }

/* ---- Превʼю 9:16 ---- */
.pu-preview {
  position: relative;
  width: 180px;
  aspect-ratio: 9 / 16;
  margin: 4px auto 0;
  border-radius: 16px;
  overflow: hidden;
  background: #0b1425;
  cursor: pointer;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
}
.pu-preview-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.pu-dim-badge {
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
.pu-dim-badge.warn { background: #f59e0b; color: #1a1a2e; }

.pu-warn-text {
  margin-top: 12px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: #b45309;
}
.pu-upload-own {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 12px auto 0;
  padding: 11px 22px;
  border: 1.5px solid var(--accent);
  border-radius: 12px;
  background: rgba(0, 180, 216, 0.06);
  color: var(--accent);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background .18s;
}
.pu-upload-own:hover { background: rgba(0, 180, 216, 0.12); }

/* ---- Галерея прикладів ---- */
.pu-samples {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
.pu-samples-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 12px;
}
.pu-samples-row {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.pu-sample {
  position: relative;
  width: 96px;
  aspect-ratio: 9 / 16;
  border: 2px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: #0b1425;
  padding: 0;
  cursor: pointer;
  transition: border-color .18s, box-shadow .18s;
}
.pu-sample:hover { border-color: var(--accent); }
.pu-sample.selected {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.22);
}
.pu-sample-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.pu-sample-cap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 3px;
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  background: rgba(15, 23, 42, 0.6);
}
.pu-sample.selected .pu-sample-cap { background: var(--accent); }
.pu-sample.selected::after {
  content: '✓';
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ---- Модалка ---- */
.pu-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  pointer-events: none;
  transition: opacity .22s ease;
}
.pu-modal.open { opacity: 1; pointer-events: auto; }
.pu-modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.68);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}
.pu-modal-card {
  position: relative;
  max-width: 380px;
  width: 100%;
  background: linear-gradient(135deg, #a24a48 0%, #8f3f3d 55%, #7a3634 100%);
  border-radius: 18px;
  padding: 28px 24px 22px;
  box-shadow: 0 24px 48px rgba(90, 30, 30, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08);
  color: #fff;
  text-align: center;
  transform: scale(0.92);
  transition: transform .28s cubic-bezier(.34, 1.56, .64, 1);
}
.pu-modal.open .pu-modal-card { transform: scale(1); }
.pu-modal-icon { font-size: 38px; line-height: 1; margin-bottom: 10px; }
.pu-modal-title { font-size: 19px; font-weight: 800; margin-bottom: 10px; }
.pu-modal-body { font-size: 14px; line-height: 1.5; color: rgba(255, 255, 255, 0.92); }
.pu-modal-danger { color: #fde047; font-weight: 800; }
.pu-modal-actions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pu-modal-primary {
  padding: 13px;
  border: none;
  border-radius: 12px;
  background: #00b4d8;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: filter .18s;
}
.pu-modal-primary:hover { filter: brightness(1.08); }
.pu-modal-quiet {
  padding: 11px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background .18s;
}
.pu-modal-quiet:hover { background: rgba(255, 255, 255, 0.26); }
</style>
