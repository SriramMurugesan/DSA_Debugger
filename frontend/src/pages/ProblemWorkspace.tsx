import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { LeftPanel } from '../components/layout/LeftPanel'
import { useExecutionStore } from '../store/executionStore'
import { Header } from '../components/layout/Header'
import { ConsoleOutput } from '../components/debugger/ConsoleOutput'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../utils/api'
import { Loader2, CheckCircle2, Play, BookOpen } from 'lucide-react'

export function ProblemWorkspace() {
  const { slug } = useParams()
  const queryClient = useQueryClient()
  const { status, code, setCode, clearExecution, setTestCallSnippet, executeCode } = useExecutionStore()
  const isVisualizing = status !== 'idle'

  const { data: problem, isLoading, error } = useQuery({
    queryKey: ['problem', slug],
    queryFn: async () => {
      const res = await apiClient.get(`/problems/${slug}`, { withCredentials: true })
      return res.data
    },
    retry: false
  })

  const generateCallForTestCase = (tc: any) => {
    if (!problem) return ''
    const pyCode = problem.starterCode?.python || ''
    const match = pyCode.match(/def\s+([a-zA-Z0-9_]+)\s*\(/)
    if (!match) return ''
    const funcName = match[1]

    const input = tc?.input
    if (typeof input === 'object' && input !== null && !Array.isArray(input)) {
      const args = Object.entries(input)
        .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
        .join(', ')
      return `\n\n# --- Call to Visualize ---\nresult = ${funcName}(${args})\nprint("Result:", result)\n`
    } else {
      return `\n\n# --- Call to Visualize ---\nresult = ${funcName}(${JSON.stringify(input)})\nprint("Result:", result)\n`
    }
  }

  useEffect(() => {
    // When a new problem is loaded, reset the visualizer and load its starter code
    if (problem && problem.starterCode && problem.starterCode.python) {
      clearExecution()
      const firstTc = problem.testCases?.[0]
      const driver = firstTc ? generateCallForTestCase(firstTc) : ''
      setTestCallSnippet(driver)

      const initialStarter = problem.starterCode.python
      if (!code || code === initialStarter) {
        setCode(initialStarter + driver)
      }
    }
  }, [slug, problem?.id, clearExecution, setTestCallSnippet])

  const submitMutation = useMutation({
    mutationFn: async (status: string) => {
      await apiClient.post(`/problems/${slug}/submit?status=${status}`, {}, { withCredentials: true })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problem', slug] })
      queryClient.invalidateQueries({ queryKey: ['problems'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary w-8 h-8 mb-4" />
        <p className="text-muted">Loading problem...</p>
      </div>
    )
  }

  if (error || !problem) {
    return <div className="p-8 text-crimson font-bold">Problem not found!</div>
  }

  // --- SOLVE MODE COMPONENTS ---
  
  const ProblemDescription = (
    <div className="w-full h-full flex flex-col min-w-0 bg-background overflow-y-auto p-6 scrollbar-thin">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-text mb-2 flex items-center gap-2">
            {problem.title}
            {problem.status === 'SOLVED' && <CheckCircle2 className="text-primary w-5 h-5" />}
          </h1>
          <div className="flex items-center space-x-3 mb-6">
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
              problem.difficulty === 'easy' ? 'text-success bg-success/10' :
              problem.difficulty === 'medium' ? 'text-warning bg-warning/10' :
              'text-crimson bg-crimson/10'
            }`}>
              {problem.difficulty}
            </span>
            <span className="text-xs text-muted font-semibold bg-surface px-2 py-0.5 rounded">{problem.category}</span>
          </div>
        </div>
        <button
          onClick={() => submitMutation.mutate('SOLVED')}
          disabled={submitMutation.isPending || problem.status === 'SOLVED'}
          className="px-4 py-2 bg-primary/10 text-primary border border-primary/30 rounded font-bold text-xs hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          {submitMutation.isPending ? <Loader2 className="animate-spin w-4 h-4 mx-auto" /> : (problem.status === 'SOLVED' ? 'Solved' : 'Mark as Solved')}
        </button>
      </div>
      
      <div className="prose prose-invert max-w-none text-sm text-text/90 mb-8 whitespace-pre-wrap leading-relaxed">
        {problem.description}
      </div>

      {problem.examples?.map((ex: any, i: number) => (
        <div key={i} className="mb-6">
          <div className="text-sm font-bold text-text mb-2">Example {i + 1}:</div>
          <div className="bg-surface border border-border rounded-lg p-4 font-mono text-xs">
            <div className="mb-1"><span className="text-muted">Input:</span> <span className="text-primary/90">{ex.input}</span></div>
            <div className="mb-1"><span className="text-muted">Output:</span> <span className="text-success">{ex.output}</span></div>
            {ex.explanation && (
              <div className="mt-2 text-muted whitespace-pre-wrap"><span className="text-muted font-bold">Explanation:</span> {ex.explanation}</div>
            )}
          </div>
        </div>
      ))}

      {problem.constraints?.length > 0 && (
        <div className="mb-6">
          <div className="text-sm font-bold text-text mb-2">Constraints:</div>
          <ul className="list-disc list-inside text-xs font-mono text-muted space-y-1">
            {problem.constraints.map((c: string, i: number) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}
    </div>
  )

  const runWithTestCase = (tc: any) => {
    const callStr = generateCallForTestCase(tc)
    const baseCode = code.replace(/\n\n# --- Call to Visualize [\s\S]*$/, '').trimEnd()
    const newCode = baseCode + callStr
    setCode(newCode)
    setTimeout(() => {
      executeCode('visualize')
    }, 50)
  }

  const TestCases = (
    <div className="w-full h-full flex flex-col min-w-0 bg-background">
      <div className="px-4 py-1.5 border-b border-border/50 bg-background/50 text-[10px] font-bold text-muted uppercase tracking-widest shrink-0 shadow-sm flex items-center justify-between">
        <div className="flex items-center">
          <span className="w-1 h-3 bg-success/80 mr-2"></span> Test Cases
        </div>
        <span className="text-[10px] text-muted lowercase">Click any case to visualize</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin space-y-3">
        {problem.testCases?.map((tc: any, i: number) => (
          <div key={i} className="bg-surface border border-border rounded p-3 text-xs font-mono group hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-muted text-[10px] font-bold uppercase tracking-wider group-hover:text-primary transition-colors">Case {i + 1}</span>
              <button
                onClick={() => runWithTestCase(tc)}
                className="px-2 py-0.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded text-[10px] font-bold flex items-center gap-1 transition-all"
                title="Run & visualize this test case"
              >
                <Play size={10} fill="currentColor" /> Visualize
              </button>
            </div>
            <div className="mb-1 break-all">
              <span className="text-muted">Input:</span> <span className="text-text">{typeof tc.input === 'object' ? JSON.stringify(tc.input) : tc.input}</span>
            </div>
            <div className="break-all">
              <span className="text-muted">Expected:</span> <span className="text-success">{typeof tc.expectedOutput === 'object' ? JSON.stringify(tc.expectedOutput) : tc.expectedOutput}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="w-full h-full">
      {isVisualizing ? (
        // VISUALIZER MODE
        <AppLayout
          hideHeader={false}
          header={
            <div className="flex flex-col w-full">
              <div className="bg-surface border-b border-border px-4 py-1 flex items-center justify-between text-xs bg-gradient-to-r from-surface via-surface to-elevated">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text">{problem.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase">{problem.difficulty}</span>
                </div>
                <button
                  onClick={clearExecution}
                  className="flex items-center gap-1 text-[11px] font-bold text-muted hover:text-text px-2.5 py-1 rounded bg-elevated border border-border hover:border-border-active transition-all"
                >
                  <BookOpen size={12} />
                  <span>Problem Description & Tests</span>
                </button>
              </div>
              <Header />
            </div>
          }
        />
      ) : (
        // SOLVE MODE
        <AppLayout
          hideHeader={false}
          header={<Header />}
          topLeft={ProblemDescription}
          topRight={<LeftPanel />}
          bottomLeft={TestCases}
          bottomRight={<ConsoleOutput />}
        />
      )}
    </div>
  )
}
