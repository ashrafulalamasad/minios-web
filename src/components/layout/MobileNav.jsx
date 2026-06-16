import { Cpu, HardDrive, ShieldAlert, Home } from 'lucide-react'

const iconMap = { Home, Cpu, HardDrive, ShieldAlert }

export default function MobileNav({ modules, activeModule, onNavigate }) {
  const navModules = modules.filter((m) => m.id !== 'home')

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40">
      <div className="glass-panel border-t border-slate-200/50 dark:border-slate-700/50 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-stretch justify-around gap-1">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium transition-all ${
              activeModule === 'home'
                ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`rounded-lg p-1.5 ${activeModule === 'home' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : ''}`}>
              <Home className="h-4 w-4" />
            </div>
            Home
          </button>
          {navModules.map((mod) => {
            const Icon = iconMap[mod.icon]
            const isActive = activeModule === mod.id
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onNavigate(mod.id)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <div className={`rounded-lg p-1.5 ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' : ''}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="truncate max-w-[64px]">{mod.label.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
