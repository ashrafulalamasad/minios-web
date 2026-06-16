import { Cpu, HardDrive, ShieldAlert, Shield, FileText, HelpCircle, BookOpen } from 'lucide-react'
import BrandLogo from './BrandLogo'

const quickLinks = [
  { id: 'cpu', label: 'CPU Scheduling', icon: Cpu },
  { id: 'memory', label: 'Memory Allocation', icon: HardDrive },
  { id: 'deadlock', label: 'Deadlock Detection', icon: ShieldAlert },
]

const theoryLinks = [
  { id: 'cpu-theory', label: 'CPU Scheduling Theory', icon: Cpu },
  { id: 'memory-theory', label: 'Memory Allocation Theory', icon: HardDrive },
  { id: 'deadlock-theory', label: 'Deadlock Theory', icon: ShieldAlert },
]

const legalLinks = [
  { id: 'privacy', label: 'Privacy Policy', icon: Shield },
  { id: 'terms', label: 'Terms of Service', icon: FileText },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
]

export default function Footer({ onNavigate }) {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-slate-200/50 dark:border-slate-700/50 glass-panel">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo size="sm" showText />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              An interactive educational simulator for core operating system algorithms.
            </p>
          </div>

          {/* Modules */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-3">
              Modules
            </h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(link.id)}
                      className="group flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      <Icon className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                      {link.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Algorithms */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-3">
              Algorithms
            </h3>
            <ul className="space-y-1">
              {theoryLinks.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(link.id)}
                      className="group flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      <BookOpen className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                      {link.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-3">
              Legal & Support
            </h3>
            <ul className="space-y-1">
              {legalLinks.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(link.id)}
                      className="group flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      <Icon className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                      {link.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            &copy; {year} MiniOS Simulator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
