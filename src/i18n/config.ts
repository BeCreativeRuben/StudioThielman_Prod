import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enCommon from './locales/en/common.json'
import enHeader from './locales/en/header.json'
import enFooter from './locales/en/footer.json'
import enHome from './locales/en/home.json'
import enPackages from './locales/en/packages.json'
import enContact from './locales/en/contact.json'
import enBlog from './locales/en/blog.json'
import nlCommon from './locales/nl/common.json'
import nlHeader from './locales/nl/header.json'
import nlFooter from './locales/nl/footer.json'
import nlHome from './locales/nl/home.json'
import nlPackages from './locales/nl/packages.json'
import nlContact from './locales/nl/contact.json'
import nlBlog from './locales/nl/blog.json'

const resources = {
  en: {
    common: enCommon,
    header: enHeader,
    footer: enFooter,
    home: enHome,
    packages: enPackages,
    contact: enContact,
    blog: enBlog,
  },
  nl: {
    common: nlCommon,
    header: nlHeader,
    footer: nlFooter,
    home: nlHome,
    packages: nlPackages,
    contact: nlContact,
    blog: nlBlog,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'header', 'footer', 'home', 'packages', 'contact', 'blog'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for better compatibility
    },
  })

export default i18n
