import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../utils/api'

interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  category: string;
  status: string;
}

// Fixed categories that match backend
export const ALL_CATEGORIES = [
  'All',
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees / Binary Trees',
  'Tries',
  'Backtracking',
  'Graphs',
  'Advanced Graphs',
  'Heap / Priority Queue',
  'Intervals',
  'Greedy',
  'Dynamic Programming',
  'Bit Manipulation'
]

export function ProblemList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'All'
  const initialDifficulty = searchParams.get('difficulty') || 'All'

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [activeDifficulty, setActiveDifficulty] = useState(initialDifficulty)
  const [searchQuery, setSearchQuery] = useState('')

  // Sync state if URL search params change (e.g. from Roadmap or Dashboard links)
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'All'
    const urlDifficulty = searchParams.get('difficulty') || 'All'
    if (urlCategory !== activeCategory) setActiveCategory(urlCategory)
    if (urlDifficulty !== activeDifficulty) setActiveDifficulty(urlDifficulty)
  }, [searchParams])

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat)
    const newParams = new URLSearchParams(searchParams)
    if (cat === 'All') newParams.delete('category')
    else newParams.set('category', cat)
    setSearchParams(newParams)
  }

  const handleDifficultySelect = (diff: string) => {
    setActiveDifficulty(diff)
    const newParams = new URLSearchParams(searchParams)
    if (diff === 'All') newParams.delete('difficulty')
    else newParams.set('difficulty', diff)
    setSearchParams(newParams)
  }

  const { data: problems = [], isLoading } = useQuery<Problem[]>({
    queryKey: ['problems', activeCategory, activeDifficulty],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (activeCategory !== 'All') params.append('category', activeCategory)
      if (activeDifficulty !== 'All') params.append('difficulty', activeDifficulty)
      
      const res = await apiClient.get(`/problems?${params.toString()}`, { withCredentials: true })
      return res.data
    }
  })

  const filtered = useMemo(() => {
    return problems.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [problems, searchQuery])

  const getDifficultyStyle = (diff: string) => {
    switch (diff) {
      case 'easy':   return 'text-success bg-success/10 border border-success/20'
      case 'medium': return 'text-warning bg-warning/10 border border-warning/20'
      case 'hard':   return 'text-crimson bg-crimson/10 border border-crimson/20'
      default: return 'text-muted'
    }
  }

  const difficulties = ['All', 'easy', 'medium', 'hard']

  return (
    <div className="w-full h-full overflow-y-auto bg-background scrollbar-thin">
      <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-text tracking-tight mb-1">Practice Problems</h1>
            <p className="text-muted text-sm">Master algorithms with our curated collection.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-elevated border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-text focus:border-primary outline-none transition-colors w-60 placeholder:text-muted"
              />
            </div>
          </div>
        </div>

        {/* Difficulty filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted mr-1">Difficulty:</span>
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => handleDifficultySelect(d)}
              className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all border ${
                activeDifficulty === d
                  ? 'bg-primary text-background border-primary'
                  : 'bg-elevated border-border text-muted hover:border-border-active hover:text-text'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted mr-1">Category:</span>
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                activeCategory === cat
                  ? 'bg-primary text-background border-primary'
                  : 'bg-elevated border-border text-muted hover:border-border-active hover:text-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-elevated border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface text-[10px] uppercase tracking-widest text-muted">
                <th className="p-4 w-12 font-bold">Status</th>
                <th className="p-4 font-bold">Title</th>
                <th className="p-4 font-bold">Difficulty</th>
                <th className="p-4 font-bold">Category</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-muted">
                    <Loader2 className="animate-spin inline-block mr-2" size={16} /> Loading problems...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-muted text-sm">
                    No problems match your filters.
                  </td>
                </tr>
              ) : filtered.map(problem => (
                <tr
                  key={problem.id}
                  className="border-b border-border/40 hover:bg-surface/60 transition-colors group"
                >
                  <td className="p-4 text-center">
                    {problem.status === 'SOLVED' ? (
                      <div className="w-4 h-4 rounded-full bg-primary mx-auto" />
                    ) : problem.status === 'IN_PROGRESS' ? (
                      <div className="w-4 h-4 rounded-full border-2 border-warning mx-auto" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-border mx-auto group-hover:border-primary/60 transition-colors" />
                    )}
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="font-bold text-text hover:text-primary transition-colors"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getDifficultyStyle(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted font-medium">{problem.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
