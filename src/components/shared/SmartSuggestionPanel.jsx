import { useState } from 'react'
import { AlertTriangle, Lightbulb, Wrench, X, CheckCircle } from 'lucide-react'

const severityConfig = {
  error: {
    border: 'border-l-red-500',
    bg: 'bg-red-50/80 dark:bg-red-950/40',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    titleColor: 'text-red-800 dark:text-red-200',
  },
  warning: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50/80 dark:bg-amber-950/40',
    icon: Lightbulb,
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-800 dark:text-amber-200',
  },
  unsafe: {
    border: 'border-l-orange-500',
    bg: 'bg-orange-50/80 dark:bg-orange-950/40',
    icon: AlertTriangle,
    iconColor: 'text-orange-500',
    titleColor: 'text-orange-800 dark:text-orange-200',
  },
  success: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-50/80 dark:bg-emerald-950/40',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
    titleColor: 'text-emerald-800 dark:text-emerald-200',
  },
}

/**
 * Unified Smart Suggestion & Fix Panel.
 * suggestion: { severity, title, explanation, details[], actions[] }
 */
export default function SmartSuggestionPanel({ suggestion }) {
  const [dismissedId, setDismissedId] = useState(null)
  const suggestionId = suggestion ? `${suggestion.severity}::${suggestion.title}` : null

  if (!suggestion || dismissedId === suggestionId) return null

  const config = severityConfig[suggestion.severity] || severityConfig.warning
  const Icon = config.icon

  return (
    <div
      className={`animate-slide-down rounded-xl border-l-4 ${config.border} ${config.bg} glass-card p-5`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <Icon className={`h-6 w-6 shrink-0 mt-0.5 ${config.iconColor}`} />
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-base ${config.titleColor}`}>{suggestion.title}</h4>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {suggestion.explanation}
            </p>
            {suggestion.details?.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {suggestion.details.map((detail, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Wrench className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            )}
            {suggestion.actions?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestion.actions.map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      action.onClick?.()
                      if (action.dismissOnClick) setDismissedId(suggestionId)
                    }}
                    className={action.variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissedId(suggestionId)}
          className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-black/5 hover:text-slate-600 dark:hover:bg-white/10"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
