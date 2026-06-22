import { useState, useCallback, useMemo } from 'react'
import { ShieldAlert } from 'lucide-react'
import InstructionsPanel from '../shared/InstructionsPanel'
import SmartSuggestionPanel from '../shared/SmartSuggestionPanel'
import MetricsTable from '../shared/MetricsTable'
import ModuleActions from '../shared/ModuleActions'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../../utils/storageKeys'
import { DEFAULT_DEADLOCK } from '../../constants/defaults'
import {
  runSafetyCheck,
  computeNeed,
  validateRequest,
  simulateRequest,
  optimizeResources,
} from '../../algorithms/deadlock/bankers'
import { validateDeadlockInputs } from '../../algorithms/deadlock/validate'
import { analyzeDeadlockSuggestions, applyDeadlockFix } from '../../algorithms/deadlock/suggest'

const INSTRUCTIONS = [
  'Set the number of processes (P) and resources (R) to size the matrices.',
  'Available: instances of each resource currently free in the system.',
  'Allocation: resources currently held by each process.',
  'Max: maximum demand of each resource per process. Need = Max − Allocation.',
  'Enable Resource Request to simulate a process requesting additional resources and re-check safety.',
  'The safety steps table shows how the Banker\'s algorithm finds (or fails to find) a safe sequence.',
]

function resizeMatrix(rows, cols, existing) {
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => existing?.[i]?.[j] ?? ''),
  )
}

function MatrixEditor({ label, matrix, onChange, readOnly = false }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</h3>
      <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-700/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50">
              <th className="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Process</th>
              {matrix[0]?.map((_, j) => (
                <th key={j} className="px-3 py-2 text-center font-semibold text-slate-600 dark:text-slate-300">R{j}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2 font-mono text-slate-700 dark:text-slate-200">P{i}</td>
                {row.map((val, j) => (
                  <td key={j} className="px-2 py-1">
                    <input
                      type="number"
                      min={0}
                      value={val}
                      readOnly={readOnly}
                      onChange={(e) => {
                        const next = matrix.map((r) => [...r])
                        next[i][j] = e.target.value === '' ? '' : Number(e.target.value)
                        onChange(next)
                      }}
                      className={`input-field text-center font-mono ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const STEP_COLUMNS = [
  { key: 'process', label: 'Process' },
  { key: 'action', label: 'Action' },
  { key: 'work', label: 'Work Vector', format: (v) => `[${v?.join(', ') ?? ''}]` },
  { key: 'finish', label: 'Finish', format: (v) => v?.map((f, i) => `P${i}:${f ? '✓' : '✗'}`).join(' ') },
]

export default function BankersAlgorithm() {
  const [config, setConfig] = useLocalStorage(STORAGE_KEYS.DEADLOCK, DEFAULT_DEADLOCK)
  const [safety, setSafety] = useState(null)
  const [requestResult, setRequestResult] = useState(null)
  const [simulating, setSimulating] = useState(false)

  const {
    processCount, resourceCount, available, allocation, max,
    requestProcess, request, enableRequest,
  } = config

  const errors = useMemo(
    () => validateDeadlockInputs(available, allocation, max, processCount, resourceCount),
    [available, allocation, max, processCount, resourceCount],
  )

  const need = useMemo(() => computeNeed(allocation, max), [allocation, max])

  const requestErrors = useMemo(() => {
    if (!enableRequest || !safety) return []
    return validateRequest(requestProcess, request, available, need)
  }, [enableRequest, requestProcess, request, available, need, safety])

  const suggestion = useMemo(() => {
    const base = analyzeDeadlockSuggestions(config, safety, requestErrors, requestResult)
    if (!base) return null
    return {
      ...base,
      actions: base.actions?.map((a) => ({
        ...a,
        onClick: () => {
          if (a.fixType === 'optimize') {
            const { available: optAvail, safety: optSafety } = optimizeResources(available, allocation, max)
            setConfig((prev) => ({ ...prev, available: optAvail }))
            setSafety(optSafety)
            setRequestResult(null)
          } else {
            const fixed = applyDeadlockFix(a.fixType, config, need)
            setConfig(fixed)
          }
        },
      })),
    }
  }, [config, safety, requestErrors, requestResult, available, allocation, max, need, setConfig])

  const handleSimulate = useCallback(() => {
    if (errors.length) return
    setSimulating(true)
    setTimeout(() => {
      try {
        const baseSafety = runSafetyCheck(available, allocation, max)
        setSafety(baseSafety)

        let reqRes = null
        if (enableRequest) {
          const reqErrs = validateRequest(requestProcess, request, available, need)
          if (!reqErrs.length) {
            reqRes = simulateRequest(requestProcess, request, available, allocation, max)
            setRequestResult(reqRes)
          } else {
            setRequestResult(null)
          }
        } else {
          setRequestResult(null)
        }
      } catch {
        setSafety(null)
        setRequestResult(null)
      } finally {
        setSimulating(false)
      }
    }, 300)
  }, [available, allocation, max, enableRequest, requestProcess, request, need, errors])

  const handleResize = useCallback((newP, newR) => {
    setConfig((prev) => ({
      ...prev,
      processCount: newP,
      resourceCount: newR,
      available: resizeMatrix(1, newR, [prev.available])[0],
      allocation: resizeMatrix(newP, newR, prev.allocation),
      max: resizeMatrix(newP, newR, prev.max),
      request: resizeMatrix(1, newR, [prev.request])[0],
    }))
    setSafety(null)
    setRequestResult(null)
  }, [setConfig])

  const handleReset = useCallback(() => {
    setConfig(DEFAULT_DEADLOCK)
    setSafety(null)
    setRequestResult(null)
  }, [setConfig])

  const handleClearResults = useCallback(() => {
    setSafety(null)
    setRequestResult(null)
  }, [])

  const displaySafety = requestResult?.safety ?? safety

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-white">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Deadlock Detection</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Banker&apos;s Algorithm</p>
        </div>
      </div>

      <InstructionsPanel title="How it works" items={INSTRUCTIONS} />
      <SmartSuggestionPanel suggestion={suggestion} />

      <div className="glass-card p-5 space-y-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="banker-processes" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Processes</label>
            <input
              id="banker-processes"
              type="number"
              min={1}
              max={10}
              value={processCount}
              onChange={(e) => handleResize(Number(e.target.value), resourceCount)}
              className="input-field w-20 mt-1"
            />
          </div>
          <div>
            <label htmlFor="banker-resources" className="text-xs font-semibold text-slate-500 dark:text-slate-400">Resources</label>
            <input
              id="banker-resources"
              type="number"
              min={1}
              max={10}
              value={resourceCount}
              onChange={(e) => handleResize(processCount, Number(e.target.value))}
              className="input-field w-20 mt-1"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Available Vector</h3>
          <div className="flex flex-wrap gap-2">
            {available.map((val, j) => (
              <div key={j} className="flex flex-col items-center gap-1">
                <span className="text-xs text-slate-500">R{j}</span>
                <input
                  type="number"
                  min={0}
                  value={val}
                    onChange={(e) => {
                      const next = [...available]
                      next[j] = e.target.value === '' ? '' : Number(e.target.value)
                      setConfig((prev) => ({ ...prev, available: next }))
                      setSafety(null)
                    }}
                  className="input-field w-16 text-center font-mono"
                />
              </div>
            ))}
          </div>
        </div>

        <MatrixEditor
          label="Allocation Matrix"
          matrix={allocation}
          onChange={(m) => { setConfig((prev) => ({ ...prev, allocation: m })); setSafety(null) }}
        />

        <MatrixEditor
          label="Max Matrix"
          matrix={max}
          onChange={(m) => { setConfig((prev) => ({ ...prev, max: m })); setSafety(null) }}
        />

        <MatrixEditor label="Need Matrix (Max − Allocation)" matrix={need} onChange={() => {}} readOnly />

        <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={enableRequest}
              onChange={(e) => setConfig((prev) => ({ ...prev, enableRequest: e.target.checked }))}
              className="rounded border-slate-300"
            />
            Simulate Resource Request
          </label>

          {enableRequest && (
            <div className="mt-3 flex flex-wrap items-end gap-4">
              <div>
                <label htmlFor="banker-request-process" className="text-xs text-slate-500">Requesting Process</label>
                <select
                  id="banker-request-process"
                  value={requestProcess}
                  onChange={(e) => setConfig((prev) => ({ ...prev, requestProcess: Number(e.target.value) }))}
                  className="input-field mt-1"
                >
                  {Array.from({ length: processCount }, (_, i) => (
                    <option key={i} value={i}>P{i}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                {request.map((val, j) => (
                  <div key={j} className="flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-500">R{j}</span>
                    <input
                      type="number"
                      min={0}
                      value={val}
                      onChange={(e) => {
                        const next = [...request]
                        next[j] = e.target.value === '' ? '' : Number(e.target.value)
                        setConfig((prev) => ({ ...prev, request: next }))
                      }}
                      className="input-field w-16 text-center font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <ModuleActions
          onSimulate={handleSimulate}
          onReset={handleReset}
          onClearResults={handleClearResults}
          simulating={simulating}
          hasResults={!!displaySafety}
        />
      </div>

      {displaySafety && (
        <>
          <div className={`glass-card p-4 text-sm font-semibold ${displaySafety.isSafe ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
            {displaySafety.isSafe
              ? `Safe State — Sequence: ${displaySafety.safeSequence.join(' → ')}`
              : 'Unsafe State — No safe sequence found'}
          </div>
          <MetricsTable title="Safety Algorithm Steps" columns={STEP_COLUMNS} rows={displaySafety.steps} />
        </>
      )}
    </div>
  )
}
