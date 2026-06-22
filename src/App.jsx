import { useEffect, useCallback } from 'react'
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom'
import { useLocalStorage } from './hooks/useLocalStorage'
import { STORAGE_KEYS } from './utils/storageKeys'
import { MODULES } from './constants/defaults'
import AppShell from './components/layout/AppShell'
import HomePage from './components/layout/HomePage'
import AboutPage from './components/layout/AboutPage'
import PrivacyPage from './components/layout/PrivacyPage'
import TermsPage from './components/layout/TermsPage'
import FaqPage from './components/layout/FaqPage'
import CpuTheoryPage from './components/layout/CpuTheoryPage'
import MemoryTheoryPage from './components/layout/MemoryTheoryPage'
import DeadlockTheoryPage from './components/layout/DeadlockTheoryPage'
import NotFoundPage from './components/layout/NotFoundPage'
import CpuScheduler from './components/cpu/CpuScheduler'
import MemoryAllocator from './components/memory/MemoryAllocator'
import BankersAlgorithm from './components/deadlock/BankersAlgorithm'

const VALID_PATHS = ['home', 'cpu', 'memory', 'deadlock', 'about', 'privacy', 'terms', 'faq', 'cpu-theory', 'memory-theory', 'deadlock-theory']

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
  return null
}

function AppRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeModule, setActiveModule] = useLocalStorage(STORAGE_KEYS.ACTIVE_MODULE, 'home')

  const rawPath = location.pathname.replace('/', '')
  const currentPath = rawPath || 'home'
  const isValidPath = VALID_PATHS.includes(currentPath)

  useEffect(() => {
    if (currentPath !== activeModule) {
      setActiveModule(currentPath)
    }
  }, [currentPath])

  const handleNavigate = useCallback((id) => {
    setActiveModule(id)
    const newPath = id === 'home' ? '/' : `/${id}`
    if (location.pathname === newPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate(newPath)
    }
  }, [setActiveModule, navigate, location.pathname])

  const renderModule = () => {
    if (!isValidPath) return <NotFoundPage onNavigate={handleNavigate} />
    switch (currentPath) {
      case 'cpu': return <CpuScheduler />
      case 'memory': return <MemoryAllocator />
      case 'deadlock': return <BankersAlgorithm />
      case 'about': return <AboutPage onNavigate={handleNavigate} />
      case 'privacy': return <PrivacyPage />
      case 'terms': return <TermsPage />
      case 'faq': return <FaqPage />
      case 'cpu-theory': return <CpuTheoryPage onNavigate={handleNavigate} />
      case 'memory-theory': return <MemoryTheoryPage onNavigate={handleNavigate} />
      case 'deadlock-theory': return <DeadlockTheoryPage onNavigate={handleNavigate} />
      default: return <HomePage onNavigate={handleNavigate} />
    }
  }

  return (
    <AppShell
      modules={MODULES}
      activeModule={currentPath}
      onNavigate={handleNavigate}
    >
      {renderModule()}
    </AppShell>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
