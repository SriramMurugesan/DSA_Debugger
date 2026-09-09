import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LandingPage() {
  const { loginWithGoogle, loginWithGithub, loginWithDev } = useAuth()
  const showDevLogin = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEV_LOGIN === 'true'
  return (
    <div className="flex flex-col h-full bg-background text-text overflow-y-auto">
      {/* Nav */}
      <nav className="h-16 border-b border-border bg-surface/60 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-8">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="MagizhCode Logo" className="h-9 w-9 object-contain" />
          <span className="text-xl font-extrabold tracking-tight">Magizh<span className="text-primary">Code</span></span>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={loginWithGoogle} className="text-sm font-semibold text-muted hover:text-text transition-colors">Sign In</button>
          <button onClick={loginWithGoogle} className="px-4 py-2 bg-primary text-background font-bold text-sm rounded-lg hover:bg-primary-light transition-colors shadow-lg shadow-primary/20">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 shrink-0 flex flex-col items-center justify-center px-8 py-28 text-center relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/8 blur-[120px] rounded-full" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-secondary/6 blur-[80px] rounded-full" />
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary mb-8 relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>Interactive Algorithm Visualizer — Built for Developers</span>
        </div>

        {/* Logo mark */}
        <div className="w-24 h-24 mb-8 relative z-10">
          <img src="/logo.png" alt="MagizhCode" className="w-full h-full object-contain drop-shadow-2xl" />
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-4xl relative z-10 leading-tight">
          Learn. Solve.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-light to-secondary">
            Visualize.
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted max-w-2xl mb-12 relative z-10 leading-relaxed">
          Master Data Structures and Algorithms by solving problems and watching your code execute step by step.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
          <button
            onClick={loginWithGoogle}
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-xl flex items-center justify-center space-x-2"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          <button
            onClick={loginWithGithub}
            className="w-full sm:w-auto px-8 py-3.5 bg-elevated border border-border text-text font-bold rounded-xl hover:border-primary/50 transition-colors shadow-lg flex items-center justify-center space-x-2"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M12,2C6.477,2,2,6.477,2,12c0,4.419,2.865,8.166,6.839,9.489c0.5,0.09,0.682-0.218,0.682-0.484c0-0.236-0.009-0.864-0.014-1.695c-2.782,0.602-3.369-1.337-3.369-1.337c-0.454-1.156-1.11-1.462-1.11-1.462c-0.908-0.62,0.069-0.608,0.069-0.608c1.003,0.07,1.531,1.032,1.531,1.032c0.892,1.53,2.341,1.088,2.91,0.832c0.092-0.647,0.35-1.088,0.636-1.338c-2.22-0.253-4.555-1.113-4.555-4.951c0-1.093,0.39-1.988,1.029-2.688c-0.103-0.253-0.446-1.272,0.098-2.65c0,0,0.84-0.27,2.75,1.026C10.727,6.236,11.363,6.128,12,6.124c0.637,0.004,1.273,0.112,2.072,0.334c1.909-1.296,2.748-1.026,2.748-1.026c0.546,1.379,0.202,2.398,0.1,2.65c0.64,0.7,1.028,1.595,1.028,2.688c0,3.848-2.339,4.695-4.566,4.943c0.359,0.309,0.678,0.92,0.678,1.855c0,1.338-0.012,2.419-0.012,2.747c0,0.268,0.18,0.58,0.688,0.482C19.138,20.161,22,16.416,22,12C22,6.477,17.523,2,12,2z"/>
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        {showDevLogin && (
          <div className="mt-6 relative z-10">
            <button
              onClick={loginWithDev}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-surface/80 border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all flex items-center gap-2 shadow-sm"
              title="Quickly test the platform with a pre-configured developer profile without setting up OAuth keys."
            >
              <span>⚡</span>
              <span>Test Mode: Instant Developer Login (Bypass OAuth)</span>
            </button>
          </div>
        )}
      </main>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: '⌨️', title: 'Practice', desc: 'Solve curated DSA problems grouped by patterns and difficulty.', color: 'text-primary' },
          { icon: '👁️', title: 'Visualize', desc: 'Watch arrays, pointers, trees, and graphs change step by step.', color: 'text-secondary' },
          { icon: '🗺️', title: 'Learn', desc: 'Follow a structured roadmap from arrays to advanced algorithms.', color: 'text-success' },
          { icon: '📈', title: 'Track', desc: 'See your completed problems, streaks, and learning progress.', color: 'text-warning' },
        ].map(f => (
          <div key={f.title} className="bg-elevated border border-border hover:border-border-active p-6 rounded-2xl flex flex-col items-start transition-colors">
            <div className={`text-3xl mb-5 ${f.color}`}>{f.icon}</div>
            <h3 className="text-lg font-bold mb-2">{f.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-border py-8 text-center text-muted text-xs mt-auto">
        &copy; {new Date().getFullYear()} Magizh Technologies — MagizhCode
      </footer>
    </div>
  )
}
