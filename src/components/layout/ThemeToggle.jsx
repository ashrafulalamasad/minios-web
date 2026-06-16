import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const Icon = isDark ? Moon : Sun
  const label = isDark ? 'Dark' : 'Light'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-xl border border-black bg-white px-3 py-2 text-sm font-medium text-black transition-all hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Current theme: ${label}. Click to switch.`}
    >
      <Icon className="h-4 w-4" />
      {!compact && <span>{label}</span>}
    </button>
  )
}
