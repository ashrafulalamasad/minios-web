import { Shield, Eye, Server, Globe, Code2 } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-slate-900/[0.02] dark:bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-amber-600 dark:text-amber-500" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Privacy Policy</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">Last updated: January 2025</p>
        </div>
      </div>

      <section className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">1. Overview</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          MiniOS Web is an open-source educational tool that runs entirely in your web browser.
          We do not collect, store, or transmit any personal data to external servers. Your privacy
          is our priority, and we have designed this application with privacy by default.
        </p>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Server className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">2. Data Storage</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          All simulation data, including your inputs and results, are stored locally in your browser
          using localStorage. This data never leaves your device and is only accessible to you.
        </p>
        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">✓</span>
            <span>Process configurations and memory block settings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">✓</span>
            <span>Algorithm selection preferences</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">✓</span>
            <span>Theme and display settings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-1">✓</span>
            <span>Simulation results (until you clear them)</span>
          </li>
        </ul>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">3. No Cookies</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          MiniOS Web does not use any cookies or tracking technologies. Your browsing experience
          is completely private. We do not use analytics, advertising pixels, or any form of user tracking.
        </p>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">4. Third-Party Services</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          We do not integrate with any third-party analytics, advertising, or tracking services.
          The application is self-contained and does not make any external network requests during use.
        </p>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <Code2 className="h-5 w-5 text-amber-600 dark:text-amber-500" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">5. Open Source</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          MiniOS Web is open-source software. You can review the source code to verify our
          privacy practices. We believe in transparency and invite the community to audit our code.
        </p>
      </section>

      <section className="glass-card p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">6. Changes to This Policy</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Any updates to this privacy policy will be reflected in the source code repository.
          We encourage users to review the policy periodically for any changes.
        </p>
      </section>
    </div>
  )
}
