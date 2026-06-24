import { useMemo, useState } from 'react'
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2, ArrowRight, ChevronDown, ChevronUp, Zap, Target, Layers } from 'lucide-react'
import { analyzePostSimulation } from '../../algorithms/memory/suggest'

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

function BarMeter({ value, max, color = 'bg-emerald-500', label }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{label}</span>
        <span className="font-medium">{value} KB ({pct}%)</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  )
}

function InsightBadge({ type, text }) {
  const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    info: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    error: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    suggestion: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  }
  const icons = { success: CheckCircle2, info: BarChart3, warning: AlertCircle, error: AlertCircle, suggestion: Zap }
  const Icon = icons[type] || BarChart3

  return (
    <div className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm ${styles[type] || styles.info}`}>
      <Icon className="h-4 w-4 mt-0.5 shrink-0" />
      <span className="leading-relaxed">{text}</span>
    </div>
  )
}

function AlgorithmRow({ algo }) {
  const bestFailed = 0
  const bestFrag = 0
  return (
    <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${algo.isCurrent ? 'bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-300 dark:ring-slate-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${algo.isCurrent ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
            {algo.label}
          </span>
          {algo.isCurrent && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 dark:bg-white text-white dark:text-slate-900">CURRENT</span>}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className={`font-mono font-semibold ${algo.failed > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
          {algo.allocated}/{algo.allocated + algo.failed} ok
        </div>
        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          {algo.totalInternalFrag > 0 ? `${algo.totalInternalFrag} KB frag` : 'no frag'}
        </div>
      </div>
    </div>
  )
}

function ProcessRow({ detail }) {
  const [expanded, setExpanded] = useState(false)
  const isFailed = detail.status === 'FAILED'
  const hasInsight = detail.insights?.length > 0

  return (
    <div className={`border-t border-slate-100 dark:border-slate-800 ${isFailed ? 'bg-red-50/30 dark:bg-red-950/10' : ''}`}>
      <button
        type="button"
        onClick={() => hasInsight && setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className={`font-mono font-semibold w-12 ${isFailed ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
          {detail.pid}
        </span>
        <span className="font-mono text-slate-600 dark:text-slate-300 w-20">{detail.sizeKB} KB</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isFailed ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'}`}>
          {detail.status === 'ALLOCATED' ? `→ ${detail.blockId}` : 'FAILED'}
        </span>
        {detail.internalFrag > 0 && (
          <span className="text-xs text-amber-500 dark:text-amber-400 ml-auto">{detail.internalFrag} KB waste</span>
        )}
        {hasInsight && (
          <span className="ml-auto text-slate-400">
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </span>
        )}
      </button>
      {expanded && hasInsight && (
        <div className="px-4 pb-2.5 pl-16 space-y-1">
          {detail.insights.map((insight, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-slate-300 dark:text-slate-600 mt-0.5">→</span>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MemoryAnalysisPanel({ results, blocks, processes, algorithm, partitionType }) {
  const analysis = useMemo(
    () => analyzePostSimulation(results, blocks, processes, algorithm, partitionType),
    [results, blocks, processes, algorithm, partitionType],
  )

  const [showProcessDetails, setShowProcessDetails] = useState(false)

  if (!analysis) return null

  const { stats, comparison, processDetails, overallInsight } = analysis
  const worstFailed = Math.max(...comparison.map((c) => c.failed))
  const worstFrag = Math.max(...comparison.map((c) => c.totalInternalFrag))

  return (
    <div className="glass-card p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="rounded-lg bg-indigo-100 dark:bg-indigo-900/50 p-2 text-indigo-600 dark:text-indigo-400">
          <BarChart3 className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-white">Analysis Report</h3>
      </div>

      {/* Overall insights */}
      {overallInsight.length > 0 && (
        <div className="space-y-2">
          {overallInsight.map((ins, i) => (
            <InsightBadge key={i} type={ins.type} text={ins.text} />
          ))}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={TrendingUp}
          label="Memory Utilized"
          value={`${stats.utilizationPct}%`}
          sub={`${stats.usedKB} / ${stats.totalMemory} KB`}
          color="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={Target}
          label="Allocation Efficiency"
          value={`${stats.efficiencyPct}%`}
          sub={`${stats.allocatedCount} of ${stats.totalCount} processes`}
          color="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={Layers}
          label="Internal Fragmentation"
          value={`${stats.internalFragPct}%`}
          sub={`${stats.totalInternalFrag} KB wasted`}
          color="bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          icon={AlertCircle}
          label="External Fragmentation"
          value={`${stats.externalFragPct}%`}
          sub={`Largest hole: ${stats.totalFreeKB > 0 ? stats.totalFreeKB : 0} KB`}
          color="bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400"
        />
      </div>

      {/* Memory breakdown bar */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Memory Breakdown</h4>
        <div className="flex h-4 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
          <div
            className="bg-emerald-500 transition-all duration-700"
            style={{ width: `${stats.utilizationPct}%` }}
            title={`Used: ${stats.usedKB} KB`}
          />
          <div
            className="bg-amber-400 transition-all duration-700"
            style={{ width: `${stats.internalFragPct}%` }}
            title={`Internal frag: ${stats.totalInternalFrag} KB`}
          />
          <div
            className="bg-rose-400 transition-all duration-700"
            style={{ width: `${stats.externalFragPct}%` }}
            title={`Free: ${stats.totalFreeKB} KB`}
          />
        </div>
        <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Used ({stats.utilizationPct}%)</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Internal Frag ({stats.internalFragPct}%)</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Free ({stats.externalFragPct}%)</span>
        </div>
      </div>

      {/* Algorithm comparison */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Zap className="h-4 w-4 text-indigo-500" />
          Algorithm Comparison
        </h4>
        <div className="space-y-1">
          {comparison.map((algo) => (
            <AlgorithmRow key={algo.algorithm} algo={algo} />
          ))}
        </div>
        {!analysis.isBestAlgorithm && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            <ArrowRight className="inline h-3 w-3 mr-0.5" />
            A better algorithm is available for this configuration.
          </p>
        )}
      </div>

      {/* Per-process details */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowProcessDetails(!showProcessDetails)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {showProcessDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Per-Process Breakdown ({processDetails.length} processes)
        </button>
        {showProcessDetails && (
          <div className="rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
            {processDetails.map((d, i) => (
              <ProcessRow key={i} detail={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
