import { useState, useCallback, useMemo, useRef, useEffect, Fragment } from 'react'
import { ShieldAlert, ChevronRight, XCircle, CheckCircle2, AlertTriangle, ArrowRight, Check, X, Hash } from 'lucide-react'
import InstructionsPanel from '../shared/InstructionsPanel'
import SmartSuggestionPanel from '../shared/SmartSuggestionPanel'
import ModuleActions from '../shared/ModuleActions'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../../utils/storageKeys'
import { DEFAULT_DEADLOCK, DEFAULT_DEADLOCK_UNSAFE } from '../../constants/defaults'
import {
  runSafetyCheck,
  computeNeed,
  optimizeResources,
} from '../../algorithms/deadlock/bankers'
import { validateDeadlockInputs } from '../../algorithms/deadlock/validate'
import { analyzeDeadlockSuggestions, applyDeadlockFix } from '../../algorithms/deadlock/suggest'

const INSTRUCTIONS = [
  'Set the number of processes (P) and resources (R) to size the matrices.',
  'Available: instances of each resource currently free in the system.',
  'Allocation: resources currently held by each process.',
  'Max: maximum demand of each resource per process. Need = Max − Allocation.',
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

function ArrowIcon({ delay }) {
  return (
    <div
      className="flex-shrink-0 text-slate-300 dark:text-slate-600 animate-step-enter"
      style={{ animationDelay: `${delay}s` }}
    >
      <ChevronRight className="h-5 w-5" />
    </div>
  )
}

function StepCard({ label, sublabel, variant, delay, barDelay }) {
  const isSafe = variant === 'safe'
  const isUnsafe = variant === 'unsafe'
  const isBlocked = variant === 'blocked'
  return (
    <div
      className={`step-card ${isSafe ? 'step-safe' : ''} ${isUnsafe ? 'step-unsafe' : ''} ${isBlocked ? 'step-blocked' : ''} animate-step-enter`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="step-label">{label}</div>
      {sublabel && <div className="step-sublabel">{sublabel}</div>}
      <div className={`step-bar ${isSafe ? 'step-bar-safe' : ''} ${isUnsafe || isBlocked ? 'step-bar-unsafe' : ''}`}
        style={{ animationDelay: `${barDelay}s` }}
      />
    </div>
  )
}

function SafetySequence({ steps, isSafe, safeSequence, processCount }) {
  if (!steps?.length) return null

  const finishedProcesses = []
  for (const step of steps) {
    if (step.action === 'Can finish') finishedProcesses.push(step.process)
  }

  const lastFinish = steps[steps.length - 1]?.finish || []
  const stuckProcesses = lastFinish
    .map((f, i) => (!f ? `P${i}` : null))
    .filter(Boolean)

  const totalItems = isSafe ? safeSequence.length : finishedProcesses.length + stuckProcesses.length
  const baseDelay = 0.25
  const stagger = 0.4

  return (
    <div className="glass-card p-5 overflow-hidden">
      {/* Status badge */}
      <div className="flex items-center gap-2 mb-3 animate-step-enter" style={{ animationDelay: '0.05s' }}>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          isSafe
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
        }`}>
          {isSafe ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5" />
          )}
          {isSafe ? 'Safe State' : 'Unsafe State'}
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {isSafe
            ? `${safeSequence.length} processes in safe sequence`
            : `${stuckProcesses.length} of ${processCount} processes blocked`
          }
        </span>
      </div>

      {/* Progress bar across the top */}
      <div className="progress-track">
        <div
          className={`progress-fill ${isSafe ? 'progress-fill-safe' : 'progress-fill-unsafe'}`}
          style={{ animationDuration: `${totalItems * stagger + 0.5}s` }}
        />
      </div>

      <div className="overflow-x-auto py-3">
        <div className="flex items-center gap-0 min-w-max px-2 justify-center">
          {isSafe ? (
            safeSequence.map((proc, i) => (
              <Fragment key={proc}>
                <StepCard
                  label={proc}
                  sublabel={steps.find(s => s.process === proc) ? `[${steps.find(s => s.process === proc).work.join(',')}]` : ''}
                  variant="safe"
                  delay={baseDelay + i * stagger}
                  barDelay={baseDelay + i * stagger + 0.15}
                />
                {i < safeSequence.length - 1 && <ArrowIcon delay={baseDelay + i * stagger + 0.1} />}
              </Fragment>
            ))
          ) : (
            <>
              {finishedProcesses.map((proc, i) => (
                <Fragment key={proc}>
                  <StepCard
                    label={proc}
                    sublabel="finishes"
                    variant="safe"
                    delay={baseDelay + i * stagger}
                    barDelay={baseDelay + i * stagger + 0.15}
                  />
                  {i < finishedProcesses.length - 1 && <ArrowIcon delay={baseDelay + i * stagger + 0.1} />}
                </Fragment>
              ))}
              {finishedProcesses.length > 0 && stuckProcesses.length > 0 && (
                <div className="mx-1 flex-shrink-0 animate-step-enter" style={{ animationDelay: `${baseDelay + finishedProcesses.length * stagger}s` }}>
                  <XCircle className="h-5 w-5 text-orange-400" />
                </div>
              )}
              {stuckProcesses.map((proc, i) => (
                <Fragment key={proc}>
                  <StepCard
                    label={proc}
                    sublabel="blocked"
                    variant="blocked"
                    delay={baseDelay + (finishedProcesses.length + i) * stagger}
                    barDelay={baseDelay + (finishedProcesses.length + i) * stagger + 0.15}
                  />
                  {i < stuckProcesses.length - 1 && <ArrowIcon delay={baseDelay + (finishedProcesses.length + i) * stagger + 0.1} />}
                </Fragment>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Status footer */}
      <div
        className={`text-center text-sm font-semibold animate-step-enter ${
          isSafe
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-orange-600 dark:text-orange-400'
        }`}
        style={{ animationDelay: `${baseDelay + totalItems * stagger + 0.3}s` }}
      >
        {isSafe
          ? `✓ All ${processCount} processes executed — Safe State`
          : `✗ Deadlock detected — ${stuckProcesses.length} process${stuckProcesses.length > 1 ? 'es' : ''} blocked`
        }
      </div>
    </div>
  )
}

function SafetyStepsTable({ steps, isSafe }) {
  if (!steps?.length) return null

  const icons = { process: Hash, action: ArrowRight, work: Hash, finish: Check }
  const colConfig = [
    { key: 'process', label: 'Process', icon: Hash },
    { key: 'action', label: 'Action', icon: ArrowRight },
    { key: 'work', label: 'Work', icon: Hash },
    { key: 'finish', label: 'Finish', icon: Check },
  ]

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2">
        <CheckCircle2 className={`h-4 w-4 ${isSafe ? 'text-emerald-500' : 'text-orange-500'}`} />
        <h3 className="font-semibold text-slate-800 dark:text-white">Safety Algorithm Steps</h3>
        <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">{steps.length} step{steps.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50">
              {colConfig.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <col.icon className="h-3.5 w-3.5 text-slate-400" />
                    {col.label}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {steps.map((step, i) => {
              const isFinish = step.action === 'Can finish'
              const isStuck = step.action !== 'Can finish'
              return (
                <tr
                  key={i}
                  className="animate-row-enter border-t border-slate-100 dark:border-slate-800"
                  style={{
                    animationDelay: `${i * 0.12}s`,
                    background: isFinish
                      ? 'rgba(5, 150, 105, 0.03)'
                      : isStuck
                        ? 'rgba(239, 68, 68, 0.03)'
                        : undefined,
                  }}
                >
                  {/* Process */}
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-800 dark:text-slate-100 font-mono text-base">
                      {step.process}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {isFinish ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          <Check className="h-3 w-3" /> Finish
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:text-red-300">
                          <X className="h-3 w-3" /> Blocked
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Work Vector */}
                  <td className="px-4 py-3">
                    <code className="font-mono text-xs bg-white/60 dark:bg-slate-900/40 px-2.5 py-1 rounded-md border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-300">
                      [{step.work?.join(', ') ?? ''}]
                    </code>
                  </td>

                  {/* Finish */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {step.finish?.map((f, j) => (
                        <span
                          key={j}
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold font-mono ${
                            f
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                          }`}
                        >
                          {f ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                          P{j}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {/* Footer summary */}
      <div className={`px-5 py-2.5 border-t border-slate-200/50 dark:border-slate-700/50 text-xs font-medium flex items-center gap-2 ${
        isSafe ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20' : 'text-orange-600 dark:text-orange-400 bg-orange-50/30 dark:bg-orange-950/20'
      }`}>
        {isSafe ? (
          <><CheckCircle2 className="h-3.5 w-3.5" /> All processes completed — system is in a safe state</>
        ) : (
          <><AlertTriangle className="h-3.5 w-3.5" /> Unable to find a safe sequence — system is in an unsafe state</>
        )}
      </div>
    </div>
  )
}

export default function BankersAlgorithm() {
  const [config, setConfig] = useLocalStorage(STORAGE_KEYS.DEADLOCK, DEFAULT_DEADLOCK)
  const [safety, setSafety] = useState(null)
  const [simulating, setSimulating] = useState(false)
  const [simulateCounter, setSimulateCounter] = useState(0)

  const [preset, setPreset] = useState('safe')

  const {
    processCount, resourceCount, available, allocation, max,
  } = config

  const errors = useMemo(
    () => validateDeadlockInputs(available, allocation, max, processCount, resourceCount),
    [available, allocation, max, processCount, resourceCount],
  )

  const need = useMemo(() => computeNeed(allocation, max), [allocation, max])

  const suggestion = useMemo(() => {
    const base = analyzeDeadlockSuggestions(config, safety, [], null)
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
            setSimulateCounter((c) => c + 1)
          } else if (a.fixType === 'reduce_max') {
            const fixed = applyDeadlockFix(a.fixType, config, need)
            setConfig(fixed)
            const newSafety = runSafetyCheck(fixed.available, fixed.allocation, fixed.max)
            setSafety(newSafety)
            setSimulateCounter((c) => c + 1)
          } else if (a.fixType === 'reduce_all_max') {
            const fixed = applyDeadlockFix(a.fixType, config, need)
            setConfig(fixed)
            const newSafety = runSafetyCheck(fixed.available, fixed.allocation, fixed.max)
            setSafety(newSafety)
            setSimulateCounter((c) => c + 1)
          } else {
            const fixed = applyDeadlockFix(a.fixType, config, need)
            setConfig(fixed)
          }
        },
      })),
    }
  }, [config, safety, available, allocation, max, need, setConfig])

  const handlePresetChange = useCallback((e) => {
    const value = e.target.value
    setPreset(value)
    setConfig(value === 'unsafe' ? DEFAULT_DEADLOCK_UNSAFE : DEFAULT_DEADLOCK)
    setSafety(null)
    setSimulateCounter(0)
  }, [setConfig])

  const handleSimulate = useCallback(() => {
    if (errors.length) return
    setSimulating(true)
    setTimeout(() => {
      try {
        const baseSafety = runSafetyCheck(available, allocation, max)
        setSafety(baseSafety)
      } catch {
        setSafety(null)
      } finally {
        setSimulating(false)
        setSimulateCounter(c => c + 1)
      }
    }, 300)
  }, [available, allocation, max, errors])

  const handleResize = useCallback((newP, newR) => {
    setConfig((prev) => ({
      ...prev,
      processCount: newP,
      resourceCount: newR,
      available: resizeMatrix(1, newR, [prev.available])[0],
      allocation: resizeMatrix(newP, newR, prev.allocation),
      max: resizeMatrix(newP, newR, prev.max),
    }))
    setSafety(null)
    setSimulateCounter(0)
  }, [setConfig])

  const handleReset = useCallback(() => {
    setConfig(preset === 'unsafe' ? DEFAULT_DEADLOCK_UNSAFE : DEFAULT_DEADLOCK)
    setSafety(null)
    setSimulateCounter(0)
  }, [setConfig, preset])

  const handleClearResults = useCallback(() => {
    setSafety(null)
    setSimulateCounter(0)
  }, [])

  const outputRef = useRef(null)

  useEffect(() => {
    if (simulateCounter > 0 && outputRef.current) {
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 400)
    }
  }, [simulateCounter])

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

      <div className="glass-card p-5 space-y-6">
        <div className="flex items-start justify-between gap-4">
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
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Scenario</label>
          <select
            value={preset}
            onChange={handlePresetChange}
            className="input-field mt-1 min-w-[130px]"
          >
            <option value="safe">Safe State</option>
            <option value="unsafe">Unsafe State</option>
          </select>
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

        <ModuleActions
          onSimulate={handleSimulate}
          onReset={handleReset}
          onClearResults={handleClearResults}
          simulating={simulating}
          hasResults={!!safety}
        />
      </div>

      {(safety || suggestion) && (
        <div ref={outputRef} className="space-y-5 scroll-mt-40">
          {safety && (
            <SafetySequence
              key={`seq-${simulateCounter}`}
              steps={safety.steps}
              isSafe={safety.isSafe}
              safeSequence={safety.safeSequence}
              processCount={processCount}
            />
          )}

          {safety && (
            <SafetyStepsTable steps={safety.steps} isSafe={safety.isSafe} />
          )}

          <SmartSuggestionPanel suggestion={suggestion} />
        </div>
      )}
    </div>
  )
}
