import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const faqCategories = [
  {
    title: 'General',
    items: [
      {
        q: 'What is MiniOS Simulator?',
        a: 'MiniOS Simulator is an interactive educational tool that helps you understand core operating system algorithms like CPU scheduling, memory allocation, and deadlock detection through hands-on experimentation.',
      },
      {
        q: 'Do I need to install anything?',
        a: 'No. MiniOS runs entirely in your web browser. Simply open the website and start learning. No installation, accounts, or server connections required.',
      },
      {
        q: 'Is it free to use?',
        a: 'Yes! MiniOS Simulator is completely free and open-source under the MIT License. You can use, modify, and distribute it.',
      },
    ],
  },
  {
    title: 'Privacy & Data',
    items: [
      {
        q: 'Is my data safe?',
        a: 'Yes. All your data stays in your browser using localStorage. Nothing is sent to any server. Your simulations are completely private.',
      },
      {
        q: 'Do you use cookies?',
        a: 'No. MiniOS Simulator does not use any cookies or tracking technologies. Your browsing experience is completely private.',
      },
    ],
  },
  {
    title: 'Algorithms',
    items: [
      {
        q: 'Which algorithms are supported?',
        a: 'CPU Scheduling: FCFS, SJF, SRTF, Round Robin. Memory Allocation: First Fit, Best Fit, Worst Fit. Deadlock Detection: Banker\'s Algorithm.',
      },
      {
        q: 'What is the Smart Suggestion Engine?',
        a: 'The Smart Suggestion Engine analyzes your inputs and results to explain why something failed and offers one-click fixes to resolve issues.',
      },
      {
        q: 'How accurate are the simulations?',
        a: 'Our implementations follow standard OS textbook algorithms. The results accurately represent how these algorithms behave in real operating systems.',
      },
    ],
  },
  {
    title: 'Technical',
    items: [
      {
        q: 'Is it open source?',
        a: 'Yes. MiniOS Simulator is open-source and available on GitHub. You can view, modify, and contribute to the code.',
      },
      {
        q: 'Does it work on mobile?',
        a: 'Yes. MiniOS Simulator is responsive and works on desktop, tablet, and mobile devices.',
      },
      {
        q: 'What technologies are used?',
        a: 'MiniOS is built with React, Vite, and Tailwind CSS. It uses modern web technologies for a fast, responsive experience.',
      },
    ],
  },
]

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-slate-200/50 dark:border-slate-700/50 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 py-4 text-left cursor-pointer"
      >
        <span className="text-sm font-medium text-slate-800 dark:text-white">{question}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-40 pb-4' : 'max-h-0'}`}>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function FaqPage() {
  return (
    <div className="space-y-8">
      <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Frequently Asked Questions</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300">Everything you need to know about MiniOS Simulator</p>
        </div>
      </div>

      {faqCategories.map((cat) => (
        <section key={cat.title} className="glass-card p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{cat.title}</h2>
          <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
            {cat.items.map((faq) => (
              <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
