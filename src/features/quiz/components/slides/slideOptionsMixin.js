import { market } from '../../../../i18n/marketConfig.js'

// Спільна логіка для RadioSlide / CheckboxSlide:
//   resolvedOptions — набір варіантів (з marketConfig за marketKey або зі slide.options);
//   optLabel        — підпис варіанта з i18n (slides.<field>.opt.<v>).
// Обидва реактивні до зміни локалі (залежність від this.$i18n.locale).
export const slideOptionsMixin = {
  computed: {
    resolvedOptions() {
      const loc = this.$i18n.locale
      if (this.slide.marketKey) return market(loc)[this.slide.marketKey] || []
      return this.slide.options || []
    }
  },
  methods: {
    optLabel(option) {
      return this.$t('slides.' + this.slide.field + '.opt.' + option.v)
    }
  }
}
