import { ShieldAlert, ArrowRight } from 'lucide-react'

export default function DeadlockTheoryPage({ onNavigate }) {
  return (
    <div className="space-y-8">
      <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Deadlock Detection & Prevention</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">Understanding deadlocks and the Banker's Algorithm</p>
        </div>
      </div>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">What is a Deadlock?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          A deadlock is a situation where two or more processes are unable to proceed because each is waiting
          for a resource held by another. None of the processes can release their resources, resulting in
          an infinite waiting cycle.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Deadlocks are a critical problem in operating systems, especially in systems with limited resources
          and concurrent processes. Detecting and preventing deadlocks is essential for system stability.
        </p>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Four Conditions for Deadlock</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          All four conditions must hold simultaneously for a deadlock to occur:
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">1. Mutual Exclusion</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Resources cannot be shared — only one process can use a resource at a time</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">2. Hold and Wait</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Processes hold resources while waiting for additional resources</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">3. No Preemption</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Resources cannot be forcibly taken from a process</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">4. Circular Wait</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">A circular chain of processes exists, each waiting for a resource held by the next</p>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Deadlock Handling Strategies</h2>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
            <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Prevention</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Eliminate one of the four necessary conditions. For example, require processes to request
              all resources at once (eliminating hold and wait).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50">
            <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">Avoidance</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Dynamically check if granting a resource request would lead to an unsafe state.
              The Banker's Algorithm is a classic avoidance strategy.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50">
            <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">Detection & Recovery</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Allow deadlocks to occur, detect them, and then recover by terminating processes
              or preempting resources.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50">
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Ignorance (Ostrich Algorithm)</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ignore the problem if deadlocks are rare and the cost of prevention is high.
              Most general-purpose operating systems use this approach.
            </p>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Banker's Algorithm</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          The Banker's Algorithm, developed by Edsger Dijkstra, is a resource allocation and deadlock
          avoidance algorithm. It simulates the allocation of predetermined maximum possible amounts of
          all resources, then checks for possible activities, and determines whether allocating resources
          will leave the system in a safe state.
        </p>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Available</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Vector of available instances of each resource type</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Max</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Maximum demand of each process</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Allocation</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Number of resources currently allocated to each process</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Need</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Remaining resource need of each process (Max - Allocation)</p>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Safety Algorithm</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          The safety algorithm determines whether the system is in a safe state by finding a safe sequence —
          an ordering of processes such that each can obtain its maximum resource needs and complete.
        </p>
        <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-decimal list-inside">
          <li>Initialize Work = Available and Finish[i] = false for all processes</li>
          <li>Find a process P_i where Finish[i] = false and Need_i ≤ Work</li>
          <li>If found, simulate execution: Work = Work + Allocation_i, Finish[i] = true</li>
          <li>Repeat step 2 until no such process exists</li>
          <li>If all Finish[i] = true, the system is in a safe state</li>
        </ol>
      </section>

      <div className="glass-card p-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Ready to try deadlock detection interactively?</p>
        <button
          type="button"
          onClick={() => onNavigate('deadlock')}
          className="btn-primary cursor-pointer"
        >
          Open Deadlock Detection Module
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
