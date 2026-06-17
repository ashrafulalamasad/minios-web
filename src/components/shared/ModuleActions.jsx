import { Play, RotateCcw, X } from 'lucide-react'

export default function ModuleActions({
  onSimulate,
  onReset,
  onClearResults,
  simulating = false,
  simulateLabel = 'Simulate',
  hasResults = false,
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={onSimulate} disabled={simulating} className="btn-primary cursor-pointer">
        <Play className="h-4 w-4" />
        {simulating ? 'Running...' : simulateLabel}
      </button>
      {hasResults && (
        <button type="button" onClick={onClearResults} className="btn-secondary cursor-pointer">
          <X className="h-4 w-4" />
          Clear Result
        </button>
      )}
      <button type="button" onClick={onReset} className="btn-secondary cursor-pointer">
        <RotateCcw className="h-4 w-4" />
        Reset to Default
      </button>
    </div>
  )
}
