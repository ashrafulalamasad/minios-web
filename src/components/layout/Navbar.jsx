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

  const handleNav = (id) => {
    onNavigate(id)
    setMenuOpen(false)
  }

  return (
    <>
      {/* Mobile & tablet top bar */}
      <header
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 w-full glass-panel border-b border-slate-200/50 dark:border-slate-700/50 transition-transform duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
          <BrandLogo size="sm" onClick={() => handleNav('home')} />
          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-xl border border-slate-200/60 bg-white/40 p-2.5 text-slate-700 transition-all hover:bg-white/70 dark:border-slate-600/60 dark:bg-slate-800/40 dark:text-slate-200"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-out border-t border-slate-200/40 dark:border-slate-700/40 ${
            menuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0 border-t-0'
          }`}
        >
          <nav className="px-3 py-3 space-y-1">
            <button
              type="button"
              onClick={() => handleNav('home')}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                activeModule === 'home'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-600 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className="block font-medium text-sm">Home</span>
            </button>
            {modules.filter((m) => m.id !== 'home').map((mod) => {
              const isActive = activeModule === mod.id
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => handleNav(mod.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-600 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="block font-medium text-sm">{mod.label}</span>
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => handleNav('about')}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                activeModule === 'about'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'text-slate-600 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-800/60'
              }`}
            >
              <span className="block font-medium text-sm">About</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Desktop top bar */}
      <header
        className={`hidden lg:flex fixed top-0 left-0 right-0 z-20 w-full items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-700/50 glass-panel px-6 xl:px-10 py-4 transition-transform duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <BrandLogo size="sm" showText onClick={() => onNavigate('home')} />

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
