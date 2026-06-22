import { Cpu, Clock, ArrowRight } from 'lucide-react'

export default function CpuTheoryPage({ onNavigate }) {
  return (
    <div className="space-y-8">
      <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-slate-900/[0.02] dark:bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="h-8 w-8 text-amber-600 dark:text-amber-500" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">CPU Scheduling Algorithms</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">A comprehensive guide to process scheduling in operating systems</p>
        </div>
      </div>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">What is CPU Scheduling?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          CPU scheduling is the process of deciding which process in the ready queue gets access to the CPU.
          The operating system uses scheduling algorithms to allocate CPU time efficiently, ensuring fair
          distribution and optimal system performance.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The main goals of CPU scheduling are to maximize CPU utilization, maximize throughput (number of
          processes completed per unit time), minimize turnaround time, minimize waiting time, and minimize
          response time.
        </p>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">FCFS (First-Come, First-Served)</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          FCFS is the simplest scheduling algorithm. Processes are executed in the order they arrive in the
          ready queue. It is a non-preemptive algorithm — once a process starts, it runs until completion.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
            <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Advantages</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• Simple to implement</li>
              <li>• Fair (First come, first served)</li>
              <li>• No starvation</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50">
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Disadvantages</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• Convoy effect (short processes wait for long ones)</li>
              <li>• High average waiting time</li>
              <li>• Not suitable for time-sharing systems</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">SJF (Shortest Job First)</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          SJF selects the process with the smallest execution time (burst time) next. It can be non-preemptive
          (once started, runs to completion) or preemptive (known as Shortest Remaining Time First - SRTF).
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          SJF provides the minimum average waiting time among all scheduling algorithms. However, it requires
          knowledge of burst times in advance, which is often not available in practice.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
            <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Advantages</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• Optimal average waiting time</li>
              <li>• Better throughput than FCFS</li>
              <li>• Good for batch systems</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50">
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Disadvantages</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• Requires burst time knowledge</li>
              <li>• Starvation of longer processes</li>
              <li>• Not practical for interactive systems</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">SRTF (Shortest Remaining Time First)</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          SRTF is the preemptive version of SJF. If a new process arrives with a burst time less than the
          remaining time of the current process, the current process is preempted and the new process starts.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          SRTF provides even better response times than SJF and is more suitable for interactive systems.
          However, it has higher context switching overhead due to frequent preemptions.
        </p>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Round Robin (RR)</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          Round Robin is designed for time-sharing systems. Each process gets a small unit of CPU time (time
          quantum), usually 10-100 milliseconds. After this time has elapsed, the process is preempted and
          added to the end of the ready queue.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          The performance of RR depends heavily on the time quantum. A very large quantum makes it behave
          like FCFS, while a very small quantum causes excessive context switching.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
            <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Advantages</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• Fair CPU distribution</li>
              <li>• Good response time</li>
              <li>• No starvation</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50">
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Disadvantages</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• Higher context switching overhead</li>
              <li>• Average waiting time can be high</li>
              <li>• Time quantum selection is critical</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Key Metrics</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Burst Time</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total CPU time required by a process</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Waiting Time</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Time spent waiting in the ready queue</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Turnaround Time</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total time from arrival to completion</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">Response Time</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Time from submission to first response</p>
          </div>
        </div>
      </section>

      <div className="glass-card p-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Ready to try these algorithms interactively?</p>
        <button
          type="button"
          onClick={() => onNavigate('cpu')}
          className="btn-primary cursor-pointer"
        >
          Open CPU Scheduling Module
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
