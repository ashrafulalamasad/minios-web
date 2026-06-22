import { Cpu, HardDrive, ShieldAlert, ArrowRight, BookOpen, Lightbulb, Zap, Shield, GraduationCap, Monitor, Timer, Layers, GitBranch, Database } from 'lucide-react'
import BrandLogo from './BrandLogo'

const features = [
  {
    icon: Cpu,
    title: 'CPU Scheduling',
    description: 'Simulate FCFS, SJF, SRTF, and Round Robin algorithms with interactive Gantt charts and detailed performance metrics analysis.',
    module: 'cpu',
    color: 'bg-amber-600',
    algorithms: ['FCFS', 'SJF', 'SRTF', 'Round Robin'],
  },
  {
    icon: HardDrive,
    title: 'Memory Allocation',
    description: 'Visualize First Fit, Best Fit, and Worst Fit strategies with real-time memory layout visualization and fragmentation analysis.',
    module: 'memory',
    color: 'bg-emerald-600',
    algorithms: ['First Fit', 'Best Fit', 'Worst Fit'],
  },
  {
    icon: ShieldAlert,
    title: 'Deadlock Detection',
    description: "Run Banker's Algorithm to detect unsafe states, find safe execution sequences, and simulate resource requests interactively.",
    module: 'deadlock',
    color: 'bg-red-600',
    algorithms: ["Banker's Safety", "Resource Graph"],
  },
]

const highlights = [
  { icon: Zap, title: 'Instant Results', desc: 'See simulation outputs in real-time as you adjust parameters.' },
  { icon: Lightbulb, title: 'Smart Suggestions', desc: 'Get intelligent feedback when inputs cause errors or inefficiencies.' },
  { icon: Shield, title: 'Privacy First', desc: 'Everything runs locally in your browser. No data leaves your device.' },
  { icon: GraduationCap, title: 'Learn by Doing', desc: 'Hands-on experiments reinforce OS concepts better than textbooks.' },
]

const stats = [
  { value: '3', label: 'Core Modules' },
  { value: '10+', label: 'Algorithms' },
  { value: '100%', label: 'Privacy' },
  { value: 'Free', label: 'Forever' },
]

const concepts = [
  { icon: Timer, title: 'Process Scheduling', desc: 'Understand how CPUs decide which process runs next using various scheduling algorithms.' },
  { icon: Layers, title: 'Memory Management', desc: 'Learn how operating systems allocate memory to processes and handle fragmentation.' },
  { icon: GitBranch, title: 'Deadlock Handling', desc: 'Explore how systems detect and prevent deadlocks in resource allocation scenarios.' },
  { icon: Database, title: 'Resource Allocation', desc: 'See how OS manages limited resources among competing processes efficiently.' },
]

export default function HomePage({ onNavigate }) {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="glass-card relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-slate-900/[0.02] dark:bg-white/[0.02] rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-slate-900/[0.02] dark:bg-white/[0.02] rounded-full blur-3xl" />
        </div>

        <div className="relative p-8 sm:p-10 lg:p-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Open Source & Free Forever</span>
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome to MiniOS Web
              </h2>
              <p className="mt-5 text-slate-600 dark:text-slate-400 leading-relaxed text-lg sm:text-xl max-w-7xl">
                Explore core operating system algorithms interactively. Configure inputs, run simulations,
                and get intelligent suggestions when things go wrong — all running locally in your browser.
              </p>
              <p className="mt-3 text-slate-500 dark:text-slate-500 leading-relaxed max-w-7xl">
                Whether you're a student preparing for exams, a developer brushing up on fundamentals,
                or an educator looking for teaching tools — MiniOS gives you hands-on experience with
                CPU scheduling, memory allocation, and deadlock detection without any setup.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('cpu')}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-7 py-3 text-base font-semibold text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 dark:shadow-white/20 transition-all hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 px-7 py-3 text-base font-medium text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-[0.98] cursor-pointer"
                >
                  Learn More
                </button>
              </div>

              {/* Feature highlights */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-7xl">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                  <Cpu className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-white">CPU Scheduling</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">FCFS, SJF, SRTF, Round Robin with live Gantt charts</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                  <HardDrive className="h-5 w-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-white">Memory Allocation</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">First Fit, Best Fit, Worst Fit with fragmentation analysis</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                  <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-white">Deadlock Detection</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Banker's Algorithm with safe sequence detection</div>
                  </div>
                </div>
              </div>

              {/* Trust signals */}
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <span>Zero tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>Instant results</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <span>100% client-side</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Module Cards */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Core Modules</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div key={feat.module} className="glass-card p-6 group card-hover flex flex-col">
                <div                     className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feat.color} text-white shadow-lg mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{feat.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {feat.algorithms.map((algo) => (
                    <span key={algo} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {algo}
                    </span>
                  ))}
                </div>
                <div className="mt-auto">
                  <button
                    type="button"
                    onClick={() => onNavigate(feat.module)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-400 hover:gap-2 transition-all cursor-pointer"
                  >
                    Open module <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* OS Concepts */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Key Concepts You'll Learn</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {concepts.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="glass-card card-hover p-5 cursor-default">
                <Icon className="h-8 w-8 text-amber-600 dark:text-amber-500 mb-3" />
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Highlights */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Why MiniOS?</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="glass-card card-hover p-5 cursor-default">
                <Icon className="h-8 w-8 text-amber-600 dark:text-amber-500 mb-3" />
                <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* How it works */}
      <div className="glass-card p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">How It Works</h3>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold">1</div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Choose a Module</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pick CPU, Memory, or Deadlock from the navigation.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold">2</div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Configure Inputs</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Set process burst times, memory block sizes, or resource matrices.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold">3</div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Run & Analyze</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Execute the algorithm, view charts, and get smart suggestions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="glass-card p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Quick Start</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => onNavigate('cpu')}
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer text-left"
          >
            <Cpu className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0" />
            <div>
              <div className="text-sm font-medium text-slate-800 dark:text-white">CPU Scheduling</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">FCFS, SJF, SRTF, RR</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('memory')}
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer text-left"
          >
            <HardDrive className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-sm font-medium text-slate-800 dark:text-white">Memory Allocation</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">First, Best, Worst Fit</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('deadlock')}
            className="flex items-center gap-3 p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer text-left"
          >
            <ShieldAlert className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0" />
            <div>
              <div className="text-sm font-medium text-slate-800 dark:text-white">Deadlock Detection</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Banker's Algorithm</div>
            </div>
          </button>
        </div>
      </div>

      {/* About preview */}
      <div className="glass-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-500 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">About MiniOS</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              MiniOS Web is an open-source educational tool designed to help students and developers
              understand fundamental operating system algorithms through hands-on experimentation. Built with
              modern web technologies, it runs entirely in your browser with zero backend dependencies.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-400 hover:gap-2 transition-all cursor-pointer"
            >
              Learn more <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Smart Suggestion Engine */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4">
          <Monitor className="h-8 w-8 text-amber-600 dark:text-amber-500 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Smart Suggestion Engine</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Unlike basic simulators, MiniOS analyzes your inputs and results to explain <em>why</em> something
              failed — whether it&apos;s invalid burst times, external fragmentation, or an unsafe state in
              Banker&apos;s Algorithm — and offers one-click fixes to get you back on track.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
