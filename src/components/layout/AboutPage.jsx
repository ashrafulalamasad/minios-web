import { Cpu, HardDrive, ShieldAlert, Users, Globe, Code2, Shield } from 'lucide-react'
import BrandLogo from './BrandLogo'

const techStack = [
  { name: 'React 19', desc: 'UI framework for reactive components' },
  { name: 'Vite', desc: 'Fast build tool and dev server' },
  { name: 'Tailwind CSS', desc: 'Utility-first CSS framework' },
  { name: 'Lucide Icons', desc: 'Beautiful, consistent icon set' },
]

export default function AboutPage({ onNavigate }) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900/[0.02] dark:bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <BrandLogo iconClassName="h-14 w-14" textClassName="text-2xl" showText />
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            An open-source educational simulator built to help students and developers understand
            core operating system algorithms through interactive, hands-on experimentation.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Our Mission</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          Operating system concepts can be abstract and difficult to grasp through theory alone.
          MiniOS Web bridges that gap by providing a visual, interactive environment where
          learners can experiment with real algorithms, observe their behavior, and understand
          the outcomes — all without setting up complex environments or writing backend code.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          We believe that learning by doing is the most effective approach. That&apos;s why every
          simulation runs entirely in your browser — no servers, no accounts, no data collection.
          Just pure learning.
        </p>
      </div>

      {/* Features */}
      <div className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">What We Cover</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex gap-3">
            <Cpu className="h-6 w-6 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">CPU Scheduling</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                FCFS, SJF, and SRTF algorithms with Gantt charts, waiting time, and turnaround time metrics.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <HardDrive className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Memory Allocation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                First Fit, Best Fit, and Worst Fit strategies with fragmentation visualization.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <ShieldAlert className="h-6 w-6 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Deadlock Detection</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Banker&apos;s Algorithm for safety checks and safe sequence detection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Built With</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {techStack.map((tech) => (
            <div key={tech.name} className="flex items-start gap-3">
              <Code2 className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{tech.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{tech.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Our Values</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex gap-3">
            <Globe className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Open Source</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Free to use, modify, and contribute. Community-driven development.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Learner-Focused</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Designed for students, by students. Simple, clear, and educational.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Privacy First</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Zero data collection. Everything stays in your browser.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="glass-card p-6 sm:p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Ready to Start Learning?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          Jump into any module and start exploring OS algorithms hands-on.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('cpu')}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-amber-500/25 hover:bg-amber-700 transition-colors cursor-pointer"
          >
            <Cpu className="h-4 w-4" />
            CPU Scheduling
          </button>
          <button
            type="button"
            onClick={() => onNavigate('memory')}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <HardDrive className="h-4 w-4" />
            Memory Allocation
          </button>
          <button
            type="button"
            onClick={() => onNavigate('deadlock')}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-orange-500/25 hover:bg-orange-700 transition-colors cursor-pointer"
          >
            <ShieldAlert className="h-4 w-4" />
            Deadlock Detection
          </button>
        </div>
      </div>
    </div>
  )
}
