import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CookieConsentBanner from './components/CookieConsentBanner'
import LocaleRedirect from './components/LocaleRedirect'
import { LocaleProvider } from './contexts/LocaleContext'
import Home from './pages/Home'
import Packages from './pages/Packages'
import Portfolio from './pages/Portfolio'
import PortfolioDetail from './pages/PortfolioDetail'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import CurrentProjects from './pages/CurrentProjects'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Admin from './pages/Admin'

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <CookieConsentBanner />
    </div>
  )
}

function App() {
  return (
    <Router>
      <LocaleProvider>
        <ScrollToTop />
        <Routes>
          {/* Admin route - no locale prefix */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Locale-prefixed routes */}
          <Route path="/:lang" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="packages" element={<Packages />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="portfolio/:slug" element={<PortfolioDetail />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogDetail />} />
            <Route path="current-projects" element={<CurrentProjects />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
          </Route>
          
          {/* Redirect non-prefixed paths to locale-prefixed */}
          <Route path="/" element={<LocaleRedirect />} />
          <Route path="/packages" element={<LocaleRedirect />} />
          <Route path="/portfolio" element={<LocaleRedirect />} />
          <Route path="/portfolio/:slug" element={<LocaleRedirect />} />
          <Route path="/blog" element={<LocaleRedirect />} />
          <Route path="/blog/:slug" element={<LocaleRedirect />} />
          <Route path="/current-projects" element={<LocaleRedirect />} />
          <Route path="/how-it-works" element={<LocaleRedirect />} />
          <Route path="/about" element={<LocaleRedirect />} />
          <Route path="/contact" element={<LocaleRedirect />} />
          <Route path="/privacy" element={<LocaleRedirect />} />
          <Route path="/terms" element={<LocaleRedirect />} />
          
          {/* Catch invalid locales - redirect to default */}
          <Route path="*" element={<Navigate to="/en" replace />} />
        </Routes>
      </LocaleProvider>
    </Router>
  )
}

export default App
