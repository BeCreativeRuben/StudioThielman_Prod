import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function LocaleRedirect() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Try to detect locale from cookie first
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null
      return null
    }

    const cookieLang = getCookie('lang')
    
    // Default to 'en' if no cookie
    const detectedLang = (cookieLang === 'nl' || cookieLang === 'en') ? cookieLang : 'en'
    
    // Get the path - remove leading slash if present, but keep it for root
    let path = location.pathname
    
    // If path already has locale prefix, don't redirect (shouldn't happen, but safety check)
    if (path.startsWith('/en/') || path.startsWith('/nl/') || path === '/en' || path === '/nl') {
      return
    }
    
    // For root path, redirect to /locale/
    if (path === '/') {
      navigate(`/${detectedLang}/`, { replace: true })
      return
    }
    
    // For other paths, add locale prefix
    navigate(`/${detectedLang}${path}${location.search}${location.hash}`, { replace: true })
  }, [navigate, location])

  return null
}
