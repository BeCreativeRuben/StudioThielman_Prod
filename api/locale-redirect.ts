import type { VercelRequest, VercelResponse } from '@vercel/node'

type Locale = 'en' | 'nl'

function detectLocale(req: VercelRequest): Locale {
  // 1. Check query param (for dev/testing)
  const queryCountry = req.query.country as string | undefined
  if (queryCountry === 'BE' || queryCountry === 'NL') {
    return 'nl'
  }
  if (queryCountry === 'US' || queryCountry === 'GB' || queryCountry === 'EN') {
    return 'en'
  }

  // 2. Check cookie
  const cookies = req.headers.cookie || ''
  const langMatch = cookies.match(/lang=([^;]+)/)
  if (langMatch) {
    const lang = langMatch[1]
    if (lang === 'nl' || lang === 'en') {
      return lang as Locale
    }
  }

  // 3. Check geo header (Vercel provides x-vercel-ip-country)
  const country = req.headers['x-vercel-ip-country'] as string | undefined
  if (country === 'BE' || country === 'NL') {
    return 'nl'
  }

  // 4. Fallback to English
  return 'en'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const locale = detectLocale(req)
    
    // For root path, redirect to /locale/
    // The rewrite from vercel.json passes the request, so we just need to redirect to locale root
    const redirectUrl = `/${locale}/`
    
    return res.redirect(307, redirectUrl)
  } catch (error: any) {
    console.error('Locale redirect error:', error)
    // Fallback redirect to English
    return res.redirect(307, '/en/')
  }
}
