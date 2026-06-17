import { FileText, CheckCircle, AlertTriangle, Scale, BookOpen, RefreshCw } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="space-y-8">
      <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Terms of Service</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">Last updated: January 2025</p>
        </div>
      </div>

      <section className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">1. Acceptance of Terms</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          By accessing or using MiniOS Simulator, you agree to be bound by these Terms of Service.
          If you do not agree with any part of these terms, you may not use this application.
          This is a free, open-source educational tool provided as-is.
        </p>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">2. Intended Purpose</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          MiniOS Simulator is designed for educational purposes to help users understand operating
          system algorithms. It is not intended for production use or critical applications.
        </p>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-1">•</span>
            <span>Learning and understanding OS concepts</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-1">•</span>
            <span>Academic coursework and research</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-1">•</span>
            <span>Algorithm visualization and experimentation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-1">•</span>
            <span>Teaching and demonstration purposes</span>
          </li>
        </ul>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">3. No Warranty</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          This software is provided &quot;as is&quot; without warranty of any kind, either express or implied,
          including but not limited to the warranties of merchantability, fitness for a particular purpose,
          and noninfringement. We are not responsible for any issues arising from the use of this tool.
        </p>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">4. Intellectual Property</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          MiniOS Simulator is open-source software released under the MIT License. You are free to
          use, modify, and distribute this software. The source code is publicly available for
          review and contribution.
        </p>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">5. Limitation of Liability</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          In no event shall the developers or contributors be liable for any indirect, incidental,
          special, exemplary, or consequential damages arising from the use of this software,
          including but not limited to loss of data, profits, or business interruption.
        </p>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <RefreshCw className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">6. Changes to Terms</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          We reserve the right to modify these terms at any time. Changes will be reflected in
          the source code repository. Continued use of the application after changes constitutes
          acceptance of the new terms.
        </p>
      </section>
    </div>
  )
}
