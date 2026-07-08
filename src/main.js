import Vue from 'vue'
import './styles/quiz.css'
import App from './App.vue'
import { i18n, applyDocumentLocale } from './i18n/index.js'

Vue.config.productionTip = false

applyDocumentLocale()

new Vue({
  i18n,
  render: (h) => h(App)
}).$mount('#app')
