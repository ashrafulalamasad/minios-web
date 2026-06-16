import { ArrowLeft, AlertTriangle } from 'lucide-react'

export default function NotFoundPage({ onNavigate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="glass-card p-8 sm:p-12 max-w-md">
        <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">404</h1>
        <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-4">Page Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="btn-primary cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Home
        </button>
      </div>
    </div>
  )
}
