import { useState } from 'react'
import { Info, ChevronDown, ChevronUp } from 'lucide-react'

export default function InstructionsPanel({ title, items, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="glass-card overflow-hidden animate-slide-down">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-indigo-500 shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-white">{title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {items.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-indigo-500 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
