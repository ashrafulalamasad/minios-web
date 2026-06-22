import Navbar from './Navbar'
import Footer from './Footer'

export default function AppShell({ modules, activeModule, onNavigate, children }) {
  return (
    <div className="app-mesh-bg min-h-screen flex flex-col">
      <Navbar modules={modules} activeModule={activeModule} onNavigate={onNavigate} />

      <main className="flex-1 w-full pt-[60px] lg:pt-[72px]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 lg:py-6">
          {children}
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
