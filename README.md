# ConsultantLM Quiz — Vue 3 port

A faithful, pixel-identical Vue 3 rewrite of the ConsultantLM lead-funnel quiz
(originally a single 2,600-line `main.js` + `style.css`, deployed at
`markichyt.github.io/-/`). The original source is kept in [`_original/`](./_original)
for reference.

## Run

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## How it works

- **Entry point:** [`src/main.js`](./src/main.js) mounts [`App.vue`](./src/App.vue),
  which renders the quiz at [`src/features/quiz/pages/QuizPage.vue`](./src/features/quiz/pages/QuizPage.vue).
- **Styling:** the original `style.css` is ported verbatim to
  [`src/styles/quiz.css`](./src/styles/quiz.css) and imported globally, so the
  result is visually identical. No new styling system was introduced.
- **Assets** (logo, profile photo, avatar video, payment icons, animation
  scenes) live in [`public/`](./public) and are referenced via
  `data/publicAsset.js` so they work both at the dev root and on a sub-path.

## Structure

```
src/features/quiz/
  pages/QuizPage.vue              Top bar + logo + card deck + scene pre-warmer
  components/
    QuizTopBar.vue               "STEP n / N" counter + profile-completeness scale
    QuizCardStack.vue            3-card recycling deck with the swipe animation
    QuizActionBar.vue            Sticky bottom bar (skip / info / button)
    QuizContinueButton.vue
    QuizIcon.vue                 Inline SVG icon by name
    QuizScenePrewarmer.vue       Hidden iframes that cache the animation scenes
    slides/
      SlideRenderer.vue          Routes a step to its slide/card component
      RadioSlide.vue             Single-choice (auto-advances)
      CheckboxSlide.vue          Multi-select (+ skip)
      CitySlide.vue              US-city autocomplete
      FormWithFilesSlide.vue     Intro form (text/email/phone/file)
      PhoneCountryInput.vue      Dial-code picker + masked phone input
      cards/
        AiPotentialCard.vue      Lead/revenue projection
        TenxCard.vue             10x before/after
        AssessmentCard.vue       Pipeline-value level meter
        WowRoiCard.vue           Interactive ROI calculator
        FullProfileCard.vue      Bio/CV with strength meter + skip modal
        ProfilesPricingCard.vue  Plan carousel, billing toggle, avatar video, lead form
        PaymentCard.vue          Period toggle, discount breakdown, FAQ, submit
        VideoSceneCard.vue       Animation step (native scene or iframe fallback)
    scenes/
      SocialProofScene.vue       Native rebuild of htmlTOvideo/8 (social proof)
      GoogleRankingScene.vue     Native rebuild of htmlTOvideo/2 (#1 in Google)
      ContentFactoryScene.vue    Native rebuild of htmlTOvideo/9 (AI content factory)
      AiAdsScene.vue             Native rebuild of htmlTOvideo/1 (AI ads)
      AiSocialsScene.vue         Native rebuild of htmlTOvideo/3 (AI socials)
      nativeScenes.js            Scene id → native component registry
  composables/
    useQuizData.js               Reactive answer store + localStorage + UTM + submit
    useQuizProgress.js           Current step, history, next/previous
    useProfileScore.js           0–100 completeness score
    useCountdownTimer.js         Shared 24h discount countdown
  data/
    quizSlides.js                The 24-step definition
    usCities.js, phoneCountries.js, pricingPlans.js, videoScenes.js, quizIcons.js
    publicAsset.js               Resolves /public asset URLs against the base
```

## Submission

Answers persist to `localStorage` (`clm_quiz_data`) on every change. The final
Pay button POSTs the collected answers to `SUBMIT_URL` in
[`composables/useQuizData.js`](./src/features/quiz/composables/useQuizData.js) —
still the original placeholder (`https://your-api.example.com/quiz-submit`).
Point it at the real endpoint there.

## Phased delivery

- **Phase 1 (done):** all 24 steps rebuilt in Vue, verified pixel-identical to
  the original across the intro form, AI-calc, ROI calculator, pricing carousel,
  payment and skip modal.
- **Phase 2 (done):** all five animation steps used by the funnel are now native
  Vue components (`scenes/`), each verified against the original at matching
  animation states. `VideoSceneCard` keeps an iframe fallback for any scene id
  without a native rebuild. Note: `htmlTOvideo/6` ("video7") exists in the
  original assets but is never rendered by the 24-step funnel, so it was not
  rebuilt.

## Assumptions

- The quiz data keeps the original field names (`q`, `sub`, option `v`/`t`) so the
  port stays a faithful 1:1 of the source rather than a re-modelling.
- Only the slide types actually used by the 24 steps were ported; unused
  renderers from the original (services tree, single/dual sliders, plain form)
  were intentionally left out.
- Forward navigation is the only path wired to the UI, matching the original
  (the "STEP n / N" label is a counter, not a back button); `goToPreviousStep`
  exists for completeness.
