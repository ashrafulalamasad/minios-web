import { useState, useCallback, useMemo, useRef } from 'react'
import { HardDrive } from 'lucide-react'
import InstructionsPanel from '../shared/InstructionsPanel'
import SmartSuggestionPanel from '../shared/SmartSuggestionPanel'
import EditableTable from '../shared/EditableTable'
import MemoryBlockViz from '../shared/MemoryBlockViz'
import MetricsTable from '../shared/MetricsTable'
import ModuleActions from '../shared/ModuleActions'
import MemoryAnalysisPanel from './MemoryAnalysisPanel'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../../utils/storageKeys'
import { DEFAULT_MEMORY } from '../../constants/defaults'
import { allocateMemory } from '../../algorithms/memory/allocate'
import { validateMemoryInputs, hasBlockingMemoryErrors } from '../../algorithms/memory/validate'
import { analyzeMemorySuggestions, applyMemoryFix } from '../../algorithms/memory/suggest'

const INSTRUCTIONS = [
  'Define memory blocks with sizes in KB - each block can hold one process.',
  'Add processes with their memory requirements in KB, processed in order.',
  'Choose First Fit (first block that fits), Best Fit (smallest sufficient block), or Worst Fit (largest block).',
  'Colored segments show allocated memory; striped areas are internal fragmentation (wasted space inside a block).',
  'If allocation fails despite enough total free memory, you are seeing external fragmentation.',
]

const BLOCK_COLUMNS = [
  { key: 'id', label: 'Block ID', type: 'text', validate: (v) => v?.trim().length > 0 },
  { key: 'sizeKB', label: 'Size (KB)', type: 'number', min: 1, validate: (v) => v > 0 },
]

const PROC_COLUMNS = [
  { key: 'id', label: 'Process ID', type: 'text', validate: (v) => v?.trim().length > 0 },
  { key: 'sizeKB', label: 'Size (KB)', type: 'number', min: 1, validate: (v) => v > 0 },
]

const RESULT_COLUMNS = [
  { key: 'pid', label: 'PID' },
  { key: 'sizeKB', label: 'Size (KB)' },
  { key: 'blockId', label: 'Block', format: (v) => v ?? '—' },
  {
    key: 'status',
    label: 'Status',
    format: (v) => (
      <span className={v === 'FAILED' ? 'text-red-500 font-semibold' : 'text-emerald-600 dark:text-emerald-400'}>
        {v}
      </span>
    ),
  },
  { key: 'internalFrag', label: 'Internal Frag (KB)' },
]

export default function MemoryAllocator() {
  const [config, setConfig] = useLocalStorage(STORAGE_KEYS.MEMORY, DEFAULT_MEMORY)
  const [results, setResults] = useState(null)
  const [simulating, setSimulating] = useState(false)
  const resultsRef = useRef(null)

  const { algorithm, partitionType = 'fixed', blocks, processes } = config
  const errors = useMemo(() => validateMemoryInputs(blocks, processes), [blocks, processes])

  const suggestion = useMemo(() => {
    const base = analyzeMemorySuggestions(blocks, processes, errors, results, algorithm)
    if (!base) return null
    return {
      ...base,
      actions: base.actions?.map((a) => ({
        ...a,
        onClick: () => {
          if (a.fixType === 'switch_best_fit') {
            setConfig((prev) => ({ ...prev, algorithm: 'best-fit' }))
          } else {
            const fixed = applyMemoryFix(a.fixType, blocks, processes)
            setConfig((prev) => ({ ...prev, ...fixed }))
          }
        },
      })),
    }
  }, [blocks, processes, errors, results, algorithm, setConfig])

  const handleSimulate = useCallback(() => {
    if (hasBlockingMemoryErrors(errors)) return
    setSimulating(true)
    setTimeout(() => {
      try {
        const res = allocateMemory(blocks, processes, algorithm, partitionType)
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
  }, [algorithm, blocks, processes, errors, partitionType])

  const updateBlock = useCallback((index, key, value) => {
    setConfig((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b, i) => (i === index ? { ...b, [key]: value } : b)),
    }))
    setResults(null)
  }, [setConfig])

  const updateProcess = useCallback((index, key, value) => {
    setConfig((prev) => ({
      ...prev,
      processes: prev.processes.map((p, i) => (i === index ? { ...p, [key]: value } : p)),
    }))
    setResults(null)
  }, [setConfig])

  const handleReset = useCallback(() => {
    setConfig(DEFAULT_MEMORY)
    setResults(null)
  }, [setConfig])

  const handleClearResults = useCallback(() => {
    setResults(null)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
          <HardDrive className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Memory Allocation</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">First Fit · Best Fit · Worst Fit</p>
        </div>
      </div>

      <InstructionsPanel title="How it works" items={INSTRUCTIONS} />

      <div className="glass-card p-5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <label htmlFor="mem-algorithm" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Algorithm</label>
          <select
            id="mem-algorithm"
            value={algorithm}
            onChange={(e) => { setConfig((prev) => ({ ...prev, algorithm: e.target.value })); setResults(null) }}
            className="input-field max-w-xs"
          >
            <option value="first-fit">First Fit</option>
            <option value="best-fit">Best Fit</option>
            <option value="worst-fit">Worst Fit</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <label htmlFor="mem-partition" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Partition</label>
          <select
            id="mem-partition"
            value={config.partitionType || 'fixed'}
            onChange={(e) => { setConfig((prev) => ({ ...prev, partitionType: e.target.value })); setResults(null) }}
            className="input-field max-w-xs"
          >
            <option value="fixed">Fixed Partition</option>
            <option value="dynamic">Dynamic Partition</option>
          </select>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Memory Blocks</h3>
          <EditableTable
            columns={BLOCK_COLUMNS}
            rows={blocks}
            onChange={updateBlock}
            onAdd={() => setConfig((prev) => ({
              ...prev,
              blocks: [...prev.blocks, { id: `B${prev.blocks.length}`, sizeKB: '' }],
            }))}
            onRemove={(i) => setConfig((prev) => ({ ...prev, blocks: prev.blocks.filter((_, idx) => idx !== i) }))}
            addLabel="Add Block"
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Processes</h3>
          <EditableTable
            columns={PROC_COLUMNS}
            rows={processes}
            onChange={updateProcess}
            onAdd={() => setConfig((prev) => ({
              ...prev,
              processes: [...prev.processes, { id: `P${prev.processes.length + 1}`, sizeKB: '' }],
            }))}
            onRemove={(i) => setConfig((prev) => ({ ...prev, processes: prev.processes.filter((_, idx) => idx !== i) }))}
            addLabel="Add Process"
          />
        </div>

        <ModuleActions
          onSimulate={handleSimulate}
          onReset={handleReset}
          onClearResults={handleClearResults}
          simulating={simulating}
          hasResults={!!results}
        />
      </div>

      {results && (
        <div ref={resultsRef} className="scroll-mt-8 space-y-6">
          <MemoryBlockViz blocks={results.initialBlocks} title="Initial Memory Layout" metrics={null} />
          <MemoryBlockViz blocks={results.finalBlocks} title="Final Memory Layout" metrics={results.metrics} />
          <MetricsTable title="Allocation Results" columns={RESULT_COLUMNS} rows={results.allocations} />
          <MemoryAnalysisPanel results={results} blocks={blocks} processes={processes} algorithm={algorithm} partitionType={partitionType} />
          <SmartSuggestionPanel suggestion={suggestion} />
        </div>
      )}
    </div>
  )
}
