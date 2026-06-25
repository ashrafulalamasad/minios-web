import { AlertTriangle, Lightbulb, CheckCircle, ArrowRight, Zap } from 'lucide-react'

const severityConfig = {
  error: {
    border: 'border-l-red-500',
    bg: 'bg-red-50/90 dark:bg-red-950/50',
    icon: AlertTriangle,
    iconBg: 'bg-red-100 dark:bg-red-900/50',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-800 dark:text-red-200',
    badge: 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-300',
  },
  warning: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50/90 dark:bg-amber-950/50',
    icon: Lightbulb,
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-800 dark:text-amber-200',
    badge: 'bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300',
  },
  unsafe: {
    border: 'border-l-orange-500',
    bg: 'bg-orange-50/90 dark:bg-orange-950/50',
    icon: AlertTriangle,
    iconBg: 'bg-orange-100 dark:bg-orange-900/50',
    iconColor: 'text-orange-600 dark:text-orange-400',
    titleColor: 'text-orange-800 dark:text-orange-200',
    badge: 'bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-300',
  },
  success: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-50/90 dark:bg-emerald-950/50',
    icon: CheckCircle,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    titleColor: 'text-emerald-800 dark:text-emerald-200',
    badge: 'bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300',
  },
}

export default function SmartSuggestionPanel({ suggestion }) {
  if (!suggestion) return null

  const config = severityConfig[suggestion.severity] || severityConfig.warning
  const Icon = config.icon
  const hasDetails = suggestion.details?.length > 0
  const hasActions = suggestion.actions?.length > 0

  return (
    <div
      className={`rounded-2xl border-l-[5px] ${config.border} ${config.bg} glass-card overflow-hidden`}
      role="alert"
    >
      {/* Header */}
      <div className="flex items-start gap-4 px-6 py-5">
        <div className={`rounded-xl p-3 ${config.iconBg} ${config.iconColor} shrink-0`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-lg ${config.titleColor}`}>{suggestion.title}</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {suggestion.explanation}
          </p>
        </div>
      </div>

      {/* Details */}
      {hasDetails && (
        <div className="border-t border-slate-200/40 dark:border-slate-700/40 mx-6" />
      )}
      {hasDetails && (
        <div className="px-6 py-4 space-y-3">
          {suggestion.details.map((detail, i) => (
            <div
              key={i}
              className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 animate-slide-down"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className={`inline-flex items-center justify-center rounded-full w-6 h-6 text-xs font-bold shrink-0 mt-0.5 ${config.badge}`}>
                {i + 1}
              </span>
              <span className="leading-relaxed pt-0.5">{detail}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {hasActions && (
        <div className="px-6 py-4 border-t border-slate-200/40 dark:border-slate-700/40 flex flex-wrap gap-2.5">
          {suggestion.actions.map((action, i) => (
            <button
              key={i}
              type="button"
              onClick={() => action.onClick?.()}
              className={
                action.variant === 'primary'
                  ? 'inline-flex items-center gap-2 rounded-xl bg-slate-800 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-slate-900 shadow-md shadow-black/10 dark:shadow-white/10 transition-all hover:bg-slate-700 dark:hover:bg-slate-100 hover:shadow-lg active:scale-[0.97]'
                  : 'inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-md active:scale-[0.97]'
              }
            >
              {action.label}
              <ArrowRight className="h-3.5 w-3.5 opacity-60" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
