import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import BrandLogo from './BrandLogo'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ modules, activeModule, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY < 10) {
        setVisible(true)
      } else if (scrollY > lastScrollY.current) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      lastScrollY.current = scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNav = (id) => {
    onNavigate(id)
    setMenuOpen(false)
  }

  const allNavItems = [
    { id: 'home', label: 'Home' },
    ...modules.filter((m) => m.id !== 'home'),
    { id: 'about', label: 'About' },
  ]

  return (
    <>
      {/* Mobile & tablet top bar */}
      <header
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-md transition-transform duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
          <BrandLogo iconClassName="h-8 w-8" textClassName="text-xl" onClick={() => handleNav('home')} />
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-xl border border-slate-200/60 bg-white/40 p-2.5 text-slate-700 transition-all hover:bg-white/70 dark:border-slate-600/60 dark:bg-slate-800/40 dark:text-slate-200"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span className={`block transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}>
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-in drawer from right — below navbar */}
      <div
        className={`lg:hidden fixed top-[60px] right-0 z-50 w-[60%] min-w-[240px] h-[calc(100vh-60px)] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="px-3 py-3 space-y-1">
          {allNavItems.map((item) => {
            const isActive = activeModule === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center rounded-xl px-4 py-3 text-left transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-black dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Desktop top bar */}
      <header
        className={`hidden lg:flex fixed top-0 left-0 right-0 z-20 w-full items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md px-6 xl:px-10 py-4 transition-transform duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <BrandLogo iconClassName="h-10 w-10" textClassName="text-2xl" showText onClick={() => onNavigate('home')} />

        <div className="flex items-center gap-1">
          <NavLink
            label="Home"
            isActive={activeModule === 'home'}
            onClick={() => onNavigate('home')}
          />
          {modules.filter((m) => m.id !== 'home').map((mod) => (
            <NavLink
              key={mod.id}
              label={mod.label}
              isActive={activeModule === mod.id}
              onClick={() => onNavigate(mod.id)}
            />
          ))}
          <NavLink
            label="About"
            isActive={activeModule === 'about'}
            onClick={() => onNavigate('about')}
          />
          <div className="ml-2">
            <ThemeToggle compact />
          </div>
        </div>
      </header>
    </>
  )
}

function NavLink({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative px-3 py-2 text-sm font-medium cursor-pointer"
    >
      <span className="text-black dark:text-white">
        {label}
      </span>
      <span
        className={`absolute bottom-0 left-3 h-0.5 bg-black dark:bg-white transition-all duration-200 ${
          isActive ? 'w-[calc(100%-1.5rem)]' : 'w-0 group-hover:w-[calc(100%-1.5rem)]'
        }`}
      />
    </button>
  )
}
