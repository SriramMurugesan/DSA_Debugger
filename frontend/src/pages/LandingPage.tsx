import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  X
} from 'lucide-react'

export function LandingPage() {
  const { login, register } = useAuth()
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const authCardRef = useRef<HTMLDivElement>(null)

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setError(null)
    setShowAuthModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }

    if (authMode === 'signup' && !name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)
    try {
      if (authMode === 'signup') {
        await register(email.trim(), password, name.trim())
      } else {
        await login(email.trim(), password)
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Authentication failed. Please check your credentials.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToAuth = () => {
    if (authCardRef.current) {
      authCardRef.current.scrollIntoView({ behavior: 'smooth' })
    } else {
      setShowAuthModal(true)
    }
  }

  const dsaBadges = [
    'Arrays & Hashing',
    'Two Pointers',
    'Sliding Window',
    'Monotonic Stack',
    'Binary Search',
    'Linked Lists',
    'Binary Trees & BST',
    'Trie Trees',
    'Backtracking',
    'Graphs (BFS/DFS)',
    'Advanced Graphs',
    'Heap & PQ',
    'Intervals',
    'Greedy Choices',
    'Dynamic Programming',
    'Bit Manipulation'
  ]

  return (
    <div className="flex flex-col h-full bg-[#050505] text-[#F5F0E6] overflow-y-auto selection:bg-[#F2C55C]/30 selection:text-white font-sans scroll-smooth">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#F2C55C]/[0.045] blur-[150px] rounded-full" />
        <div className="absolute top-[35%] right-[-5%] w-[600px] h-[500px] bg-[#D99A32]/[0.03] blur-[140px] rounded-full" />
        <div className="absolute top-[65%] left-[-10%] w-[700px] h-[500px] bg-[#F2C55C]/[0.035] blur-[160px] rounded-full" />
      </div>

      {/* ─── 1. TOP NAVBAR (Floating with generous top gap) ─────────────── */}
      <header className="sticky top-0 z-50 pt-5 md:pt-7 pb-3 px-4 md:px-8 pointer-events-none transition-all">
        <nav className="pointer-events-auto max-w-6xl mx-auto h-16 md:h-18 rounded-2xl md:rounded-full border border-white/[0.09] bg-[#090909]/90 backdrop-blur-2xl px-6 md:px-8 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center space-x-3.5">
            <img src="/logo.png" alt="Magizh Logo" className="h-8 w-8 object-contain drop-shadow-[0_0_12px_rgba(242,197,92,0.3)]" />
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-extrabold tracking-[0.18em] uppercase text-white">
                Magizh<span className="text-[#F2C55C]"> Technologies</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-500 font-medium">
                MagizhCode Platform
              </span>
            </div>
          </div>

          {/* Center Nav Links */}
          <div className="hidden lg:flex items-center space-x-8 text-xs font-medium tracking-wider text-neutral-400">
            <a href="#features" className="hover:text-[#F2C55C] transition-colors">FEATURES</a>
            <a href="#curriculum" className="hover:text-[#F2C55C] transition-colors">CURRICULUM</a>
            <a href="#how-it-works" className="hover:text-[#F2C55C] transition-colors">HOW IT WORKS</a>
            <a href="#access" className="hover:text-[#F2C55C] transition-colors">SIGN IN</a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => openAuth('signin')}
              className="text-xs font-bold tracking-wider text-neutral-400 hover:text-white transition-colors uppercase px-3 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="gold-pill-btn px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-extrabold shadow-[0_0_20px_rgba(242,197,92,0.3)]"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* ─── 2. HERO SECTION ───────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-16 px-6 md:px-12 text-center max-w-6xl mx-auto">
        {/* Eyebrow Label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-[#F2C55C]/20 mb-8 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F2C55C] animate-pulse" />
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#F2C55C]">
            Algorithm Visualization & DSA Mastery
          </span>
        </div>

        {/* Grand Headline (Playfair Editorial Serif) */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif tracking-tight text-white mb-6 leading-[1.08] max-w-5xl">
          We build the <span className="font-serif italic font-normal text-[#F2C55C]">clarity</span>
          <br className="hidden sm:block" />
          your code is missing.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans font-normal">
          From abstract concept to interview mastery. Watch data structures, pointers, and recursive frames mutate line-by-line in real-time.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto justify-center">
          <button
            onClick={scrollToAuth}
            className="w-full sm:w-auto gold-pill-btn px-8 py-3.5 rounded-full text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(242,197,92,0.35)]"
          >
            <span>Start Solving Now</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => openAuth('signin')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold border border-white/15 hover:border-[#F2C55C]/50 text-neutral-200 hover:text-white transition-all bg-white/[0.02] backdrop-blur-sm flex items-center justify-center gap-2"
          >
            <span>Sign In to Account</span>
          </button>
        </div>

        {/* Partner / Ecosystem Logos Ribbon (Directly matching Image 2) */}
        <div className="w-full pt-8 pb-4 border-t border-white/[0.06] flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-[0.28em] text-neutral-500 font-semibold mb-6">
            ENGINEERED WITH MODERN RUNTIME ARCHITECTURE
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl">
            {['PYTHON 3.12 AST', 'FASTAPI RUNTIME', 'MONACO STUDIO', 'POSTGRESQL CLOUD', 'STEP TRACER'].map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 rounded-xl bg-white/[0.025] border border-white/[0.07] text-neutral-300 text-xs font-semibold tracking-wider hover:border-[#F2C55C]/30 hover:bg-white/[0.04] transition-all flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-[#F2C55C]" />
                {tech}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ─── 3. THREE PROBLEM STATEMENTS (Exact 3 Cards from Image 2) ─── */}
      <section className="relative z-10 py-16 px-6 md:px-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#0c0c0c] border border-white/[0.08] hover:border-[#F2C55C]/40 p-8 rounded-3xl flex flex-col justify-between transition-all group shadow-xl">
            <div>
              <div className="text-[#F2C55C] text-xs font-bold tracking-widest uppercase mb-4">01 / BARRIER</div>
              <h3 className="text-xl md:text-2xl font-serif text-white mb-3 leading-snug group-hover:text-[#F2C55C] transition-colors">
                You understand solutions, but freeze on unseen problems.
              </h3>
              <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-normal">
                Memorizing code syntax fails when edge-cases arise. Seeing pointer mechanics and memory mutations builds deep algorithmic intuition that sticks.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-[#F2C55C] tracking-wider">
              <span>EXPLORE ROADMAP</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0c0c0c] border border-white/[0.08] hover:border-[#F2C55C]/40 p-8 rounded-3xl flex flex-col justify-between transition-all group shadow-xl">
            <div>
              <div className="text-[#F2C55C] text-xs font-bold tracking-widest uppercase mb-4">02 / TIME SINK</div>
              <h3 className="text-xl md:text-2xl font-serif text-white mb-3 leading-snug group-hover:text-[#F2C55C] transition-colors">
                You spend hours placing print statements to trace variable states.
              </h3>
              <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-normal">
                Traditional terminal debuggers are tedious for complex data structures. MagizhCode automatically normalizes lists, trees, graphs, and dicts at every step.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-[#F2C55C] tracking-wider">
              <span>LIVE TRACE ENGINE</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0c0c0c] border border-white/[0.08] hover:border-[#F2C55C]/40 p-8 rounded-3xl flex flex-col justify-between transition-all group shadow-xl">
            <div>
              <div className="text-[#F2C55C] text-xs font-bold tracking-widest uppercase mb-4">03 / MASTERY</div>
              <h3 className="text-xl md:text-2xl font-serif text-white mb-3 leading-snug group-hover:text-[#F2C55C] transition-colors">
                Mastering technical interviews takes months you don't have.
              </h3>
              <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-normal">
                Skip 800 random problems. Follow a curated, high-yield curriculum of 75+ pattern-based problems from Two Pointers to Dynamic Programming.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold text-[#F2C55C] tracking-wider">
              <span>CURATED 16 PATTERNS</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. AUTHENTICATION SECTION / CARD ──────────────────────────── */}
      <section id="access" ref={authCardRef} className="relative z-10 py-16 px-6 md:px-12 max-w-xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#F2C55C] font-semibold">GET STARTED</span>
          <h2 className="text-3xl md:text-4xl font-serif text-white mt-1">Access Your Learning Studio</h2>
        </div>

        <div className="bg-[#0e0e0e]/95 backdrop-blur-2xl border border-white/[0.09] hover:border-[#F2C55C]/40 transition-all rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* Tabs */}
          <div className="flex border-b border-white/[0.08] mb-6">
            <button
              onClick={() => { setAuthMode('signin'); setError(null) }}
              className={`flex-1 pb-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors relative ${
                authMode === 'signin' ? 'text-[#F2C55C]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
              {authMode === 'signin' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2C55C] rounded-full shadow-[0_0_12px_rgba(242,197,92,0.8)]" />
              )}
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setError(null) }}
              className={`flex-1 pb-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors relative ${
                authMode === 'signup' ? 'text-[#F2C55C]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Create Account
              {authMode === 'signup' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2C55C] rounded-full shadow-[0_0_12px_rgba(242,197,92,0.8)]" />
              )}
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#F2C55C] outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  required
                  placeholder="developer@magizh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#F2C55C] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#F2C55C] outline-none transition-colors"
                />
              </div>
              {authMode === 'signup' && (
                <span className="text-[10px] text-neutral-500 mt-1 block">Minimum 6 characters</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3.5 gold-pill-btn rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin text-black" />
              ) : (
                <>
                  <span>{authMode === 'signin' ? 'Sign In to Workspace' : 'Create Free Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* ─── 5. FOUR FEATURE CARDS (Stacked Large Cards matching Image 2) ─── */}
      <section id="features" className="relative z-10 py-16 px-6 md:px-12 max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#F2C55C] font-semibold">CORE CAPABILITIES</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white mt-1">Platform Architecture & Engines</h2>
        </div>

        <div className="space-y-6">
          {/* Feature 1 */}
          <div className="bg-[#0c0c0c] border border-white/[0.08] hover:border-[#F2C55C]/30 p-8 md:p-10 rounded-3xl transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C55C]">ENGINE 01</span>
                <h3 className="text-2xl md:text-3xl font-serif text-white mt-1 mb-2">Live AST Execution & Step Tracing</h3>
                <p className="text-sm font-serif italic text-neutral-400 mb-4">
                  Step backward and forward through your code's chronological history.
                </p>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-normal">
                  Our Python backend executes code using `sys.settrace()` inside an AST-isolated sandbox. It records variables, call stacks, and prints at every tick, serializing state into a step timeline delivered via gzip compression.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 shrink-0 min-w-[200px]">
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#55B88A]" /> AST Security Validator
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2C55C]" /> 1,000 Step Execution Limit
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D99A32]" /> Instant Rewind / Time Travel
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-[#0c0c0c] border border-white/[0.08] hover:border-[#F2C55C]/30 p-8 md:p-10 rounded-3xl transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C55C]">CURRICULUM 02</span>
                <h3 className="text-2xl md:text-3xl font-serif text-white mt-1 mb-2">Curated 75+ DSA Problem Roadmap</h3>
                <p className="text-sm font-serif italic text-neutral-400 mb-4">
                  Targeted pattern-based problem solving with cloud progress persistence.
                </p>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-normal">
                  Overcome interview fatigue with structured categories: Arrays & Hashing, Two Pointers, Sliding Window, Monotonic Stacks, Binary Trees, Graphs, and DP. All progress syncs with your Aiven PostgreSQL database.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 shrink-0 min-w-[200px]">
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#55B88A]" /> 16 Pattern Categories
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2C55C]" /> Cloud Problem Progress
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D99A32]" /> Streak & Solved Tracker
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-[#0c0c0c] border border-white/[0.08] hover:border-[#F2C55C]/30 p-8 md:p-10 rounded-3xl transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C55C]">VISUALIZER 03</span>
                <h3 className="text-2xl md:text-3xl font-serif text-white mt-1 mb-2">Deep Memory & Object Graphs</h3>
                <p className="text-sm font-serif italic text-neutral-400 mb-4">
                  Visual animations for arrays, linked lists, trees, and graphs.
                </p>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-normal">
                  No more mental overload simulating pointers. Watch pointers shift, linked list nodes update, recursion stacks push/pop, and array windows slide seamlessly across your screen.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 shrink-0 min-w-[200px]">
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#55B88A]" /> Dynamic 1D & 2D Arrays
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2C55C]" /> Linked List & Tree Nodes
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D99A32]" /> Live Call Stack Inspector
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-[#0c0c0c] border border-white/[0.08] hover:border-[#F2C55C]/30 p-8 md:p-10 rounded-3xl transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C55C]">STUDIO 04</span>
                <h3 className="text-2xl md:text-3xl font-serif text-white mt-1 mb-2">Monaco Code Editor & Custom Testcases</h3>
                <p className="text-sm font-serif italic text-neutral-400 mb-4">
                  The same editor engine powering VS Code, directly in your browser.
                </p>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-normal">
                  Write clean Python code with syntax highlighting, automatic indentation, active-line execution indicators, and custom test input validation.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 shrink-0 min-w-[200px]">
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#55B88A]" /> Monaco VS-Dark Theme
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2C55C]" /> Active Line Tracking
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-neutral-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D99A32]" /> Test Case Assertions
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. TECHNOLOGY BADGES GRID (Exact Match to Image 2) ────────── */}
      <section id="curriculum" className="relative z-10 py-16 px-6 md:px-12 max-w-6xl mx-auto w-full border-t border-white/[0.06]">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#F2C55C] font-semibold">PATTERNS COVERED</span>
          <h2 className="text-2xl md:text-4xl font-serif text-white mt-1">16 Algorithmic Pillars</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          {dsaBadges.map((badge) => (
            <div
              key={badge}
              className="bg-[#0d0d0d] border border-white/[0.07] hover:border-[#F2C55C]/40 p-3.5 rounded-2xl flex items-center justify-between text-xs font-medium text-neutral-300 transition-all hover:bg-white/[0.02]"
            >
              <span className="truncate">{badge}</span>
              <Sparkles size={12} className="text-[#F2C55C] shrink-0 opacity-70 ml-2" />
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. THREE WAYS TO MASTER (Exact match to "Three ways to work with us") ─── */}
      <section id="how-it-works" className="relative z-10 py-20 px-6 md:px-12 max-w-6xl mx-auto w-full border-t border-white/[0.06]">
        <div className="text-center mb-16">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#F2C55C] font-semibold">METHODOLOGY</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white mt-1">Three ways to master DSA with us</h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto mt-3">
            Designed for engineers preparing for FAANG interviews, university exams, or production system architecture.
          </p>
        </div>

        <div className="space-y-6">
          {/* Main Top Card */}
          <div className="bg-[#0d0d0d] border border-white/[0.08] hover:border-[#F2C55C]/40 p-8 md:p-10 rounded-3xl transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C55C]">RECOMMENDED PATH</span>
                <h3 className="text-3xl font-serif text-white mt-1 mb-2">The Structured Roadmap</h3>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-normal mb-6">
                  Follow an ordered progression designed by senior software engineers. Unlock patterns sequentially to build compounding knowledge from arrays to complex graph algorithms.
                </p>
                <button
                  onClick={scrollToAuth}
                  className="gold-pill-btn px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold inline-flex items-center gap-2"
                >
                  <span>Explore Full Roadmap</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Progress Milestones Graphic */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 flex flex-col gap-4 min-w-[280px]">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Phase 1: Fundamentals</span>
                  <CheckCircle2 size={16} className="text-[#55B88A]" />
                </div>
                <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#F2C55C] to-[#D99A32] h-full w-full rounded-full" />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pt-2">
                  <span>Phase 2: Non-Linear Structures</span>
                  <span className="text-[#F2C55C] font-bold">In Progress</span>
                </div>
                <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#F2C55C] to-[#D99A32] h-full w-2/3 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Dual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0d0d0d] border border-white/[0.08] hover:border-[#F2C55C]/40 p-8 rounded-3xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C55C]">SPRINT 01</span>
                  <span className="text-3xl font-serif text-white/20 font-bold">01</span>
                </div>
                <h4 className="text-xl font-serif text-white mt-2 mb-2">Topic Deep-Dives</h4>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
                  Have an interview next week focused on Dynamic Programming or Graphs? Jump directly to filtered categories to practice and visualize targeted question sets.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/[0.06] text-xs font-bold text-[#F2C55C] flex items-center gap-1">
                <span>FILTER PROBLEMS</span>
                <ChevronRight size={14} />
              </div>
            </div>

            <div className="bg-[#0d0d0d] border border-white/[0.08] hover:border-[#F2C55C]/40 p-8 rounded-3xl transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F2C55C]">DEBUGGER 02</span>
                  <span className="text-3xl font-serif text-white/20 font-bold">02</span>
                </div>
                <h4 className="text-xl font-serif text-white mt-2 mb-2">Free-Play Studio</h4>
                <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
                  Bring your own broken code or test an algorithm idea from scratch. Our CodeFlow tracer instruments any valid Python logic and animates state changes step-by-step.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/[0.06] text-xs font-bold text-[#F2C55C] flex items-center gap-1">
                <span>OPEN FREE VISUALIZER</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. FOOTER (Exact match to Image 2) ───────────────────────── */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#050505] pt-16 pb-12 px-6 md:px-12 text-neutral-400 text-xs">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Company Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Magizh Logo" className="h-7 w-7 object-contain" />
              <span className="text-sm font-extrabold tracking-[0.2em] uppercase text-white">
                Magizh<span className="text-[#F2C55C]"> Technologies</span>
              </span>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed max-w-sm">
              Building high-performance software engineering tools and intuitive algorithmic learning infrastructure.
            </p>
            <div className="flex items-center space-x-3 pt-2 text-neutral-500">
              <span className="hover:text-white transition-colors cursor-pointer">GitHub</span>
              <span>•</span>
              <span className="hover:text-white transition-colors cursor-pointer">LinkedIn</span>
              <span>•</span>
              <span className="hover:text-white transition-colors cursor-pointer">X / Twitter</span>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h5 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">Product</h5>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Visualizer</a></li>
              <li><a href="#curriculum" className="hover:text-white transition-colors">Roadmap</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Practice Problems</a></li>
              <li><a href="#access" className="hover:text-white transition-colors">Studio</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h5 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">Technology</h5>
            <ul className="space-y-2 text-neutral-500">
              <li>Python 3.12</li>
              <li>FastAPI</li>
              <li>Aiven PostgreSQL</li>
              <li>Monaco Studio</li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h5 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">Legal & Security</h5>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-white transition-colors cursor-pointer">Security Sandbox</li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-600 gap-4">
          <p>© {new Date().getFullYear()} Magizh Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with precision by Magizh Technologies</span>
          </p>
        </div>
      </footer>

      {/* ─── 9. AUTH MODAL (Popup when clicking top buttons) ─────────── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0e0e0e] border border-white/[0.12] rounded-3xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] text-left">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/[0.05] transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex border-b border-white/[0.08] mb-6">
              <button
                onClick={() => { setAuthMode('signin'); setError(null) }}
                className={`flex-1 pb-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors relative ${
                  authMode === 'signin' ? 'text-[#F2C55C]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sign In
                {authMode === 'signin' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2C55C] rounded-full shadow-[0_0_12px_rgba(242,197,92,0.8)]" />
                )}
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setError(null) }}
                className={`flex-1 pb-3 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors relative ${
                  authMode === 'signup' ? 'text-[#F2C55C]' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Create Account
                {authMode === 'signup' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F2C55C] rounded-full shadow-[0_0_12px_rgba(242,197,92,0.8)]" />
                )}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#F2C55C] outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="email"
                    required
                    placeholder="developer@magizh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#F2C55C] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#F2C55C] outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 gold-pill-btn rounded-xl text-xs uppercase tracking-wider font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={18} className="animate-spin text-black" />
                ) : (
                  <>
                    <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
