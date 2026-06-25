import { useMemo, useState } from 'react'
import { BarChart3, TrendingUp, Clock, Zap, Timer, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from 'lucide-react'
import { runFCFS } from '../../algorithms/cpu/fcfs'
import { runSJF } from '../../algorithms/cpu/sjf'
import { runSRTF } from '../../algorithms/cpu/srtf'
import { runRR } from '../../algorithms/cpu/rr'

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 p-4">
      <div className={`rounded-lg p-2 ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <div className="text-xl font-bold text-slate-800 dark:text-white">{value}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
        {sub && <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

function ProcessRow({ detail, index }) {
  const [expanded, setExpanded] = useState(false)
  const wtRatio = detail.burst > 0 ? (detail.waiting / detail.burst) : 0
  const tatRatio = detail.burst > 0 ? (detail.turnaround / detail.burst) : 0

  const status = wtRatio === 0 ? 'excellent' : wtRatio < 1 ? 'good' : wtRatio < 2 ? 'moderate' : 'high'
  const statusConfig = {
    excellent: { color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/40', label: 'No wait' },
    good: { color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/40', label: 'Low wait' },
    moderate: { color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/40', label: 'Moderate wait' },
    high: { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/40', label: 'High wait' },
  }
  const st = statusConfig[status]

  return (
    <div className={`border-t border-slate-100 dark:border-slate-800 ${index % 2 === 0 ? '' : 'bg-slate-50/30 dark:bg-slate-800/20'}`}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="font-mono font-semibold w-12 text-slate-700 dark:text-slate-200">
          {detail.pid}
        </span>
        <span className="font-mono text-slate-500 dark:text-slate-400 w-16 text-xs">A:{detail.arrival}</span>
        <span className="font-mono text-slate-500 dark:text-slate-400 w-16 text-xs">B:{detail.burst}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
          {st.label}
        </span>
        <span className="ml-auto font-mono text-xs text-slate-500 dark:text-slate-400">
          W:{detail.waiting} · T:{detail.turnaround}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-3 pl-16 space-y-2">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2.5 text-center">
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-0.5">Waiting Time</div>
              <div className="font-mono font-bold text-slate-700 dark:text-slate-200">{detail.waiting}</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2.5 text-center">
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-0.5">Turnaround</div>
              <div className="font-mono font-bold text-slate-700 dark:text-slate-200">{detail.turnaround}</div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2.5 text-center">
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-0.5">TAT / Burst</div>
              <div className="font-mono font-bold text-slate-700 dark:text-slate-200">{tatRatio.toFixed(1)}x</div>
            </div>
          </div>
          <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Wait/Burst ratio: <strong className="text-slate-700 dark:text-slate-200">{wtRatio.toFixed(2)}</strong></span>
            <span>·</span>
            <span>{wtRatio === 0 ? 'Ran immediately on arrival' : `Waited ${detail.waiting} unit${detail.waiting !== 1 ? 's' : ''} before CPU`}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CpuAnalysisPanel({ results, processes, algorithm, quantum }) {
  const comparison = useMemo(() => {
    const algos = [
      { id: 'fcfs', name: 'FCFS', run: () => runFCFS(processes) },
      { id: 'sjf', name: 'SJF', run: () => runSJF(processes) },
      { id: 'srtf', name: 'SRTF', run: () => runSRTF(processes) },
      { id: 'rr', name: `RR (q=${quantum})`, run: () => runRR(processes, quantum) },
    ]

    return algos.map((a) => {
      const res = a.run()
      const cpuBusy = res.totalTime - res.idleTime
      return {
        id: a.id,
        name: a.name,
        isCurrent: a.id === algorithm,
        avgWaiting: res.averages.wt,
        avgTurnaround: res.averages.tat,
        totalTime: res.totalTime,
        idleTime: res.idleTime,
        cpuUtil: res.totalTime > 0 ? ((cpuBusy / res.totalTime) * 100) : 0,
        throughput: res.totalTime > 0 ? (processes.length / res.totalTime) : 0,
      }
    })
  }, [processes, algorithm, quantum])

  const bestWaiting = Math.min(...comparison.map((c) => c.avgWaiting))
  const bestTurnaround = Math.min(...comparison.map((c) => c.avgTurnaround))
  const bestUtil = Math.max(...comparison.map((c) => c.cpuUtil))

  const cpuBusy = results.totalTime - results.idleTime
  const cpuUtil = results.totalTime > 0 ? ((cpuBusy / results.totalTime) * 100) : 0
  const throughput = results.totalTime > 0 ? (processes.length / results.totalTime) : 0

  const [showProcessDetails, setShowProcessDetails] = useState(false)

  return (
    <div className="glass-card p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="rounded-lg bg-amber-100 dark:bg-amber-900/50 p-2 text-amber-600 dark:text-amber-400">
          <BarChart3 className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-white">Analysis Report</h3>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Clock}
          label="Avg Waiting Time"
          value={results.averages.wt.toFixed(2)}
          sub="time units"
          color="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={Timer}
          label="Avg Turnaround"
          value={results.averages.tat.toFixed(2)}
          sub="time units"
          color="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={Zap}
          label="CPU Utilization"
          value={`${cpuUtil.toFixed(1)}%`}
          sub={`${cpuBusy} busy / ${results.totalTime} total`}
          color="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Throughput"
          value={throughput.toFixed(3)}
          sub={`processes/unit (${processes.length} in ${results.totalTime})`}
          color="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* CPU utilization bar */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">CPU Timeline</h4>
        <div className="flex h-5 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
          <div
            className="bg-emerald-500 transition-all duration-700"
            style={{ width: `${cpuUtil}%` }}
            title={`Busy: ${cpuBusy} units`}
          />
          <div
            className="gantt-idle transition-all duration-700"
            style={{ width: `${100 - cpuUtil}%` }}
            title={`Idle: ${results.idleTime} units`}
          />
        </div>
        <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Busy ({cpuUtil.toFixed(1)}%)</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded gantt-idle" /> Idle ({(100 - cpuUtil).toFixed(1)}%)</span>
          <span className="ml-auto font-medium text-slate-600 dark:text-slate-300">Total: {results.totalTime} units · Idle: {results.idleTime} units</span>
        </div>
      </div>

      {/* Algorithm comparison */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-500" />
          Algorithm Comparison
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50">
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">Algorithm</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">Avg Wait</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">Avg TAT</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">CPU Util</th>
                <th className="px-3 py-2.5 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">Throughput</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr
                  key={row.id}
                  className={`border-t border-slate-100 dark:border-slate-800 transition-colors ${
                    row.isCurrent
                      ? 'bg-amber-50/50 dark:bg-amber-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <td className="px-3 py-2.5 font-medium">
                    <span className="flex items-center gap-2">
                      {row.name}
                      {row.isCurrent && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">CURRENT</span>
                      )}
                    </span>
                  </td>
                  <td className={`px-3 py-2.5 text-center font-mono text-xs ${row.avgWaiting === bestWaiting ? 'text-emerald-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                    {row.avgWaiting.toFixed(2)}
                    {row.avgWaiting === bestWaiting && <span className="ml-1 text-[9px]">★</span>}
                  </td>
                  <td className={`px-3 py-2.5 text-center font-mono text-xs ${row.avgTurnaround === bestTurnaround ? 'text-emerald-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                    {row.avgTurnaround.toFixed(2)}
                    {row.avgTurnaround === bestTurnaround && <span className="ml-1 text-[9px]">★</span>}
                  </td>
                  <td className={`px-3 py-2.5 text-center font-mono text-xs ${row.cpuUtil === bestUtil ? 'text-emerald-500 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                    {row.cpuUtil.toFixed(1)}%
                    {row.cpuUtil === bestUtil && <span className="ml-1 text-[9px]">★</span>}
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-xs text-slate-600 dark:text-slate-300">
                    {row.throughput.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          <span className="text-emerald-500 font-medium">★</span> = best value among all algorithms for this workload
        </p>
      </div>

      {/* Per-process details */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowProcessDetails(!showProcessDetails)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {showProcessDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Per-Process Breakdown ({results.processes.length} processes)
        </button>
        {showProcessDetails && (
          <div className="rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
            {results.processes.map((d, i) => (
              <ProcessRow key={d.pid} detail={d} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Insights</h4>
        <div className="space-y-2">
          {results.averages.wt === bestWaiting && (
            <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2.5 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="leading-relaxed">This algorithm achieves the <strong>best average waiting time</strong> ({results.averages.wt.toFixed(2)}) among all algorithms for this workload.</span>
            </div>
          )}
          {results.averages.wt !== bestWaiting && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2.5 text-sm text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="leading-relaxed">A better algorithm exists for this workload — it could reduce avg waiting from {results.averages.wt.toFixed(2)} to {bestWaiting.toFixed(2)}.</span>
            </div>
          )}
          {cpuUtil < 70 && (
            <div className="flex items-start gap-2.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-2.5 text-sm text-blue-700 dark:text-blue-300">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="leading-relaxed">CPU utilization is {cpuUtil.toFixed(1)}% — the CPU is idle for {(100 - cpuUtil).toFixed(1)}% of the time. This may be due to staggered arrival times.</span>
            </div>
          )}
          {results.processes.some((p) => p.waiting > p.burst * 2) && (
            <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 text-sm text-rose-700 dark:text-rose-300">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="leading-relaxed">Some processes wait more than twice their burst time — this indicates potential starvation or convoy effect.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
