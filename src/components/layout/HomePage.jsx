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
      <div className="glass-card hero-glow relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-[350px] h-[350px] bg-amber-400/[0.06] dark:bg-amber-300/[0.08] rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[300px] h-[300px] bg-amber-500/[0.04] dark:bg-amber-400/[0.06] rounded-full blur-3xl" />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-amber-400/20 dark:bg-amber-300/25"
              style={{
                width: `${4 + (i % 2) * 2}px`,
                height: `${4 + (i % 2) * 2}px`,
                top: `${20 + (i * 15) % 60}%`,
                left: `${8 + (i * 19) % 84}%`,
                animation: `float-particle ${3 + i * 0.6}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative p-5 sm:p-8 lg:p-14">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center">
            {/* Left — Text */}
            <div className="flex-1 lg:flex-[2] space-y-6 sm:space-y-8">
              {/* Badge */}
              <div className="hero-fade-in inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 sm:px-4 sm:py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-amber-700 dark:text-amber-400">Open Source & Free Forever</span>
              </div>

              {/* Heading */}
              <div className="hero-fade-in hero-fade-in-delay-1 space-y-3 sm:space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                  Master OS Algorithms{' '}
                  <span className="text-amber-600 dark:text-amber-400">Interactively</span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base sm:text-lg lg:text-xl max-w-2xl">
                  Explore CPU scheduling, memory allocation, and deadlock detection through
                  hands-on simulations — with intelligent suggestions that teach you why things work.
                </p>
              </div>

              {/* CTA */}
              <div className="hero-fade-in hero-fade-in-delay-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('cpu')}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 sm:px-6 text-sm font-semibold text-white shadow-lg shadow-amber-600/20 transition-all hover:bg-black active:scale-[0.98] cursor-pointer"
                >
                  Start Exploring
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black px-5 py-2.5 sm:px-6 text-sm font-medium text-black transition-all hover:bg-black hover:text-white active:scale-[0.98] cursor-pointer dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  Learn More
                </button>
              </div>

              {/* Trust */}
              <div className="hero-fade-in hero-fade-in-delay-3 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 sm:gap-y-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                  <span>Zero tracking</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                  <span>Instant results</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Monitor className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
                  <span>100% client-side</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />
                  <span>Smart suggestions</span>
                </div>
              </div>
            </div>

            {/* Right — Module Cards */}
            <div className="hero-fade-in hero-fade-in-delay-2 w-full lg:w-[320px] lg:flex-[1] shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
                {/* CPU Scheduling */}
                <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 sm:p-5 shadow-xl shadow-slate-900/5 dark:shadow-black/30">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/25">
                      <Cpu className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">CPU Scheduling</h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">Gantt charts & performance metrics</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {['FCFS', 'SJF', 'SRTF', 'RR'].map((algo) => (
                      <span key={algo} className="text-[8px] sm:text-[9px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">{algo}</span>
                    ))}
                  </div>
                </div>

                {/* Memory Allocation */}
                <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 sm:p-5 shadow-xl shadow-slate-900/5 dark:shadow-black/30">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                      <HardDrive className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Memory Allocation</h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">Block visualization & fragmentation</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {['First Fit', 'Best Fit', 'Worst Fit'].map((algo) => (
                      <span key={algo} className="text-[8px] sm:text-[9px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">{algo}</span>
                    ))}
                  </div>
                </div>

                {/* Deadlock Detection */}
                <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4 sm:p-5 shadow-xl shadow-slate-900/5 dark:shadow-black/30">
                  <div className="flex items-center gap-3 mb-2 sm:mb-3">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
                      <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Deadlock Detection</h3>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">Safety check & safe sequences</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="text-[8px] sm:text-[9px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400">Banker's Algorithm</span>
                    <span className="text-[8px] sm:text-[9px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400">Resource Request</span>
                  </div>
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
