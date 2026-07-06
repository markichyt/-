# ConsultantLM Quiz — українська версія (Vue 2, Options API)

A Vue 2.7 / Options API rewrite of the ConsultantLM lead-funnel quiz, ported
from the Vue 3 (Composition API) version. **Local only** — not connected to any
GitHub remote.

Built with **Vue 2.7.16 + `@vitejs/plugin-vue2` + Vite 5**.

## Run

```bash
npm install
npm run dev      # http://localhost:5190
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## How it works

- **Entry point:** [`src/main.js`](./src/main.js) creates the app the Vue 2 way
  (`new Vue({ render: h => h(App) }).$mount('#app')`) and mounts
  [`App.vue`](./src/App.vue) → [`pages/QuizPage.vue`](./src/features/quiz/pages/QuizPage.vue).
- **Styling:** the original `style.css` is kept verbatim in
  [`src/styles/quiz.css`](./src/styles/quiz.css) and imported globally.
- **State:** shared reactive state uses `Vue.observable` stores (see below)
  instead of Composition-API composables.
- **Assets** live in [`public/`](./public), referenced via `data/publicAsset.js`.

## Structure

```
src/features/quiz/
  pages/QuizPage.vue              Top bar + logo + card deck + scene pre-warmer
  components/
    QuizTopBar.vue               "STEP n / N" counter + profile-completeness scale
    QuizCardStack.vue            3-card recycling deck (uses this.$set for slots)
    QuizActionBar.vue            Sticky bottom bar (skip / info / button)
    QuizContinueButton.vue
    QuizIcon.vue                 Inline SVG icon by name
    QuizScenePrewarmer.vue       Hidden iframes that cache the animation scenes
    slides/
      SlideRenderer.vue          Routes a step to its slide/card component
      RadioSlide.vue / CheckboxSlide.vue / CitySlide.vue
      FormWithFilesSlide.vue     Intro form (text/email/phone/file)
      PhoneCountryInput.vue      Dial-code picker + masked phone input
      cards/                     AiPotential / Tenx / Assessment / WowRoi /
                                 FullProfile / ProfilesPricing / Payment / VideoScene
    scenes/                      SceneCanvas + 5 native animation scenes
      nativeScenes.js            Scene id → native component registry
  store/
    quizDataStore.js             Vue.observable answers + localStorage + UTM + submit
    quizProgressStore.js         Vue.observable current step + next/previous
  utils/
    profileScore.js              calculateProfileScore(quizData) → 0–100
  mixins/
    countdownTimerMixin.js       Shared 24h discount countdown (pricing + payment)
  data/
    quizSlides.js                The 24-step definition
    usCities.js, phoneCountries.js, pricingPlans.js, videoScenes.js, quizIcons.js
    publicAsset.js               Resolves /public asset URLs against the base
```

## Vue 3 → Vue 2 notes

- `<script setup>` + `ref/computed/reactive` → `export default { data, computed,
  methods, watch, ... }` (Options API).
- Composables → `Vue.observable` **stores** (`store/`), a plain **util**
  (`utils/profileScore.js`) and a **mixin** (`mixins/countdownTimerMixin.js`).
- The answer store pre-declares every field, because Vue 2 cannot track keys
  added after an object becomes reactive.
- `QuizCardStack` updates its slot arrays through `this.$set` (Vue 2 cannot
  detect writes to an array by index).
- Components that had multiple root nodes in Vue 3 are wrapped in a single root
  element (Vue 2 templates allow only one root).
- Lifecycle: `onMounted`→`mounted`, `onUnmounted`→`beforeDestroy`.

## Submission

Answers persist to `localStorage` (`clm_quiz_data`) on change. The final Pay
button POSTs to `SUBMIT_URL` in
[`store/quizDataStore.js`](./src/features/quiz/store/quizDataStore.js) — still the
placeholder (`https://your-api.example.com/quiz-submit`).
