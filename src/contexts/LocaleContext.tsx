import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import i18n from '../i18n/config'

type Locale = 'en' | 'nl'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  changeLanguage: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { lang } = useParams<{ lang: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Determine current locale from URL or default to 'en'
  const currentLocale = (lang === 'nl' || lang === 'en' ? lang : 'en') as Locale
  const [locale, setLocaleState] = useState<Locale>(currentLocale)

  // Update locale when URL changes
  useEffect(() => {
    if (lang === 'nl' || lang === 'en') {
      setLocaleState(lang as Locale)
      i18n.changeLanguage(lang)
    }
  }, [lang])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    i18n.changeLanguage(newLocale)
  }

  const changeLanguage = (newLocale: Locale) => {
    // Set cookie
    document.cookie = `lang=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    
    // Update i18n
    setLocale(newLocale)
    
    // Navigate to same path with new locale
    const pathWithoutLang = location.pathname.replace(/^\/(en|nl)/, '') || '/'
    navigate(`/${newLocale}${pathWithoutLang}${location.search}${location.hash}`)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, changeLanguage }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}

// Utility hook for generating localized links
export function useLocalizedLink() {
  const { locale } = useLocale()
  
  return (path: string) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    // Remove locale prefix if already present
    const pathWithoutLang = cleanPath.replace(/^(en|nl)\//, '')
    // Return path with current locale
    return `/${locale}/${pathWithoutLang}`
  }
}
