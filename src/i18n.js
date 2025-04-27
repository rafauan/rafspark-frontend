import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import pl from './locales/pl.json'

// Definiowanie wiadomości dla każdego języka
const messages = {
  en,
  pl
}

const i18n = createI18n({
  locale: 'pl', // domyślny język
  fallbackLocale: 'en', // zapasowy język
  messages // tłumaczenia
})

export default i18n
