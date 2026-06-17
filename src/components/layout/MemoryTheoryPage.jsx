import { HardDrive, ArrowRight } from 'lucide-react'

export default function MemoryTheoryPage({ onNavigate }) {
  return (
    <div className="space-y-8">
      <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <HardDrive className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Memory Allocation Algorithms</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">Understanding how operating systems manage memory allocation</p>
        </div>
      </div>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">What is Memory Allocation?</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          Memory allocation is the process of assigning memory blocks to processes from the available
          memory pool. The operating system must efficiently manage limited memory resources to accommodate
          multiple processes simultaneously.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          When a process needs memory, the OS must find a suitable free block. If no single block is large
          enough, the process must wait (external fragmentation), or the OS can use techniques like
          compaction or paging.
        </p>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">First Fit</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          First Fit scans the list of free memory blocks and allocates the first block that is large enough
          to accommodate the process. It is the simplest and fastest algorithm.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
            <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Advantages</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• Fast allocation</li>
              <li>• Simple implementation</li>
              <li>• Low overhead</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50">
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Disadvantages</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• May leave small gaps (internal fragmentation)</li>
              <li>• First-fit generally allocates at the beginning</li>
              <li>• Can lead to uneven distribution</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Best Fit</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          Best Fit searches the entire list of free blocks and allocates the smallest block that is large
          enough. This minimizes wasted space but requires more time to search.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
            <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Advantages</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• Minimizes internal fragmentation</li>
              <li>• Better memory utilization</li>
              <li>• Keeps large blocks for larger processes</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50">
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Disadvantages</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• Slower allocation (must search all blocks)</li>
              <li>• Creates very small leftover fragments</li>
              <li>• External fragmentation can still occur</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Worst Fit</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          Worst Fit allocates the largest available block. The idea is that the remaining space after
          allocation will be large enough to be useful for other processes.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
            <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Advantages</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• Larger leftover fragments</li>
              <li>• Reduces external fragmentation</li>
              <li>• Good for systems with many small processes</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50">
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Disadvantages</h4>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>• Slowest allocation (must find largest)</li>
              <li>• May waste large blocks on small processes</li>
              <li>• Can cause large processes to wait</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Fragmentation</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50">
            <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">Internal Fragmentation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Memory allocated to a process is slightly larger than needed. The unused space inside the
              allocated block is wasted and cannot be used by other processes.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50">
            <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">External Fragmentation</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Total free memory is enough for a process, but it is not contiguous. The process cannot
              be allocated because there is no single block large enough.
            </p>
          </div>
        </div>
      </section>

      <div className="glass-card p-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">Ready to try these algorithms interactively?</p>
        <button
          type="button"
          onClick={() => onNavigate('memory')}
          className="btn-primary cursor-pointer"
        >
          Open Memory Allocation Module
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
