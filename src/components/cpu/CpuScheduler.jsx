import { useState, useCallback, useMemo, useRef } from 'react'
import { Cpu, Timer, Zap, Clock, ArrowRightLeft } from 'lucide-react'
import InstructionsPanel from '../shared/InstructionsPanel'
import SmartSuggestionPanel from '../shared/SmartSuggestionPanel'
import EditableTable from '../shared/EditableTable'
import GanttChart from '../shared/GanttChart'
import MetricsTable from '../shared/MetricsTable'
import ModuleActions from '../shared/ModuleActions'
import CpuAnalysisPanel from './CpuAnalysisPanel'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../../utils/storageKeys'
import { DEFAULT_CPU } from '../../constants/defaults'
import { runFCFS } from '../../algorithms/cpu/fcfs'
import { runSJF } from '../../algorithms/cpu/sjf'
import { runSRTF } from '../../algorithms/cpu/srtf'
import { runRR } from '../../algorithms/cpu/rr'
import { validateCpuInputs, hasBlockingErrors } from '../../algorithms/cpu/validate'
import { analyzeCpuSuggestions, applyCpuFix } from '../../algorithms/cpu/suggest'

const INSTRUCTIONS = [
  'Add processes with unique IDs, arrival times (≥ 0), and burst times (> 0).',
  'Select FCFS, SJF, SRTF, or Round Robin. For RR, set a time quantum.',
  'Click Simulate to generate the Gantt chart and calculate Waiting Time and Turnaround Time.',
  'The Gantt chart shows which process runs on the CPU at each time unit.',
]

const CPU_COLUMNS = [
  { key: 'id', label: 'Process ID', type: 'text', validate: (v) => v?.trim().length > 0 },
  { key: 'arrival', label: 'Arrival Time', type: 'number', min: 0, validate: (v) => v >= 0 },
  { key: 'burst', label: 'Burst Time', type: 'number', min: 1, validate: (v) => v > 0 },
]

const METRIC_COLUMNS = [
  { key: 'pid', label: 'PID' },
  { key: 'arrival', label: 'Arrival' },
  { key: 'burst', label: 'Burst' },
  { key: 'waiting', label: 'Waiting' },
  { key: 'turnaround', label: 'Turnaround' },
]

function runAlgorithm(algorithm, processes, quantum) {
  switch (algorithm) {
    case 'sjf': return runSJF(processes)
    case 'srtf': return runSRTF(processes)
    case 'rr': return runRR(processes, quantum)
    default: return runFCFS(processes)
  }
}

const ALGO_STORAGE = {
  fcfs: STORAGE_KEYS.CPU_FCFS,
  sjf: STORAGE_KEYS.CPU_SJF,
  srtf: STORAGE_KEYS.CPU_SRTF,
  rr: STORAGE_KEYS.CPU_RR,
}

export default function CpuScheduler() {
  const [algorithm, setAlgorithm] = useLocalStorage(STORAGE_KEYS.CPU_ALGORITHM, 'fcfs')
  const [quantum, setQuantum] = useLocalStorage(STORAGE_KEYS.CPU_QUANTUM, 2)
  const [processes, setProcesses] = useLocalStorage(ALGO_STORAGE[algorithm] || ALGO_STORAGE.fcfs, DEFAULT_CPU.processes)
  const [results, setResults] = useState(null)
  const [simulating, setSimulating] = useState(false)
  const resultsRef = useRef(null)

  const errors = useMemo(() => validateCpuInputs(processes), [processes])

  const suggestion = useMemo(() => {
    const base = analyzeCpuSuggestions(processes, errors, results, algorithm)
    if (!base) return null
    return {
      ...base,
      actions: base.actions?.map((a) => ({
        ...a,
        onClick: () => {
          if (a.fixType === 'switch_sjf') {
            setAlgorithm('sjf')
          } else {
            const fixed = applyCpuFix(a.fixType, processes)
            setProcesses(fixed)
          }
        },
      })),
    }
  }, [processes, errors, results, algorithm, setAlgorithm, setProcesses])

  const handleSimulate = useCallback(() => {
    if (hasBlockingErrors(errors)) return
    setSimulating(true)
    setTimeout(() => {
      try {
        const res = runAlgorithm(algorithm, processes, quantum)
        setResults(res)
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 50)
      } catch {
        setResults(null)
      } finally {
        setSimulating(false)
      }
    }, 300)
  }, [algorithm, processes, quantum, errors])

  const updateProcess = useCallback((index, key, value) => {
    setProcesses((prev) => prev.map((p, i) => (i === index ? { ...p, [key]: value } : p)))
    setResults(null)
  }, [setProcesses])

  const addProcess = useCallback(() => {
    setProcesses((prev) => [...prev, { id: `P${prev.length + 1}`, arrival: '', burst: '' }])
  }, [setProcesses])

  const removeProcess = useCallback((index) => {
    setProcesses((prev) => prev.filter((_, i) => i !== index))
  }, [setProcesses])

  const handleReset = useCallback(() => {
    setProcesses(DEFAULT_CPU.processes)
    setAlgorithm('fcfs')
    setQuantum(2)
    setResults(null)
  }, [setProcesses, setAlgorithm, setQuantum])

  const handleClearResults = useCallback(() => {
    setResults(null)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white">
          <Cpu className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">CPU Scheduling</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">FCFS · SJF · SRTF · Round Robin</p>
        </div>
      </div>

      <InstructionsPanel title="How it works" items={INSTRUCTIONS} />

      {/* Configuration */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <label htmlFor="cpu-algorithm" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Algorithm</label>
          <select
            id="cpu-algorithm"
            value={algorithm}
            onChange={(e) => { setAlgorithm(e.target.value); setResults(null) }}
            className="input-field max-w-xs"
          >
            <option value="fcfs">FCFS (First-Come First-Served)</option>
            <option value="sjf">SJF (Non-preemptive)</option>
            <option value="srtf">SRTF (Preemptive)</option>
            <option value="rr">Round Robin (Preemptive)</option>
          </select>
        </div>

        {algorithm === 'rr' && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <label htmlFor="cpu-quantum" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Time Quantum</label>
            <input
              id="cpu-quantum"
              type="number"
              min={1}
              value={quantum}
              onChange={(e) => { setQuantum(e.target.value === '' ? 1 : Math.max(1, Number(e.target.value))); setResults(null) }}
              className="input-field max-w-[120px]"
            />
          </div>
        )}

        <EditableTable
          columns={CPU_COLUMNS}
          rows={processes}
          onChange={updateProcess}
          onAdd={addProcess}
          onRemove={removeProcess}
          addLabel="Add Process"
        />

        <ModuleActions
          onSimulate={handleSimulate}
          onReset={handleReset}
          onClearResults={handleClearResults}
          simulating={simulating}
          hasResults={!!results}
        />
      </div>

      {/* Results */}
      {results && (
        <div ref={resultsRef} className="scroll-mt-8 space-y-6">
          <GanttChart gantt={results.gantt} />
          <MetricsTable
            title="Performance Metrics"
            columns={METRIC_COLUMNS}
            rows={results.processes}
            footer={{
              pid: 'Average',
              arrival: '—',
              burst: '—',
              waiting: results.averages.wt.toFixed(2),
              turnaround: results.averages.tat.toFixed(2),
            }}
          />
          <CpuAnalysisPanel results={results} processes={processes} algorithm={algorithm} quantum={quantum} />
          <SmartSuggestionPanel suggestion={suggestion} />
        </div>
      )}
    </div>
  )
}
