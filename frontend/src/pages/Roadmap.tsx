import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, ChevronRight, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../utils/api'

interface RoadmapTopic {
  id: string
  phase: string
  title: string
  icon: string
  category: string
  subtopics: { label: string }[]
}

const roadmapTopics: RoadmapTopic[] = [
  {
    id: 'arrays', phase: 'Phase 1', title: 'Arrays & Hashing', icon: '📦', category: 'Arrays & Hashing',
    subtopics: [{ label: 'Static Arrays' }, { label: 'Dynamic Arrays' }, { label: 'Hash Maps' }, { label: 'Hash Sets' }]
  },
  {
    id: 'twopointers', phase: 'Phase 2', title: 'Two Pointers', icon: '👈', category: 'Two Pointers',
    subtopics: [{ label: 'Opposite Direction' }, { label: 'Same Direction' }, { label: 'Fast & Slow' }]
  },
  {
    id: 'slidingwindow', phase: 'Phase 3', title: 'Sliding Window', icon: '🖼️', category: 'Sliding Window',
    subtopics: [{ label: 'Fixed Window' }, { label: 'Variable Window' }, { label: 'Window + HashMap' }]
  },
  {
    id: 'stack', phase: 'Phase 4', title: 'Stack', icon: '🥞', category: 'Stack',
    subtopics: [{ label: 'Stack Basics' }, { label: 'Monotonic Stack' }, { label: 'Balanced Brackets' }]
  },
  {
    id: 'binarysearch', phase: 'Phase 5', title: 'Binary Search', icon: '🔍', category: 'Binary Search',
    subtopics: [{ label: 'Classic Binary Search' }, { label: 'Search on Boundary' }, { label: 'Rotated Array' }]
  },
  {
    id: 'linkedlist', phase: 'Phase 6', title: 'Linked List', icon: '🔗', category: 'Linked List',
    subtopics: [{ label: 'Singly Linked List' }, { label: 'Doubly Linked List' }, { label: 'Fast & Slow Pointers' }]
  },
  {
    id: 'trees', phase: 'Phase 7', title: 'Trees', icon: '🌲', category: 'Trees / Binary Trees',
    subtopics: [{ label: 'Binary Trees' }, { label: 'BST' }, { label: 'BFS / Level Order' }, { label: 'DFS' }]
  },
  {
    id: 'trie', phase: 'Phase 8', title: 'Tries', icon: '🌳', category: 'Tries',
    subtopics: [{ label: 'Prefix Tree' }, { label: 'Word Search' }]
  },
  {
    id: 'backtracking', phase: 'Phase 9', title: 'Backtracking', icon: '🔙', category: 'Backtracking',
    subtopics: [{ label: 'Combinations' }, { label: 'Permutations' }]
  },
  {
    id: 'graphs', phase: 'Phase 10', title: 'Graphs', icon: '🕸️', category: 'Graphs',
    subtopics: [{ label: 'Adjacency List' }, { label: 'BFS / DFS' }, { label: 'Islands Problems' }]
  },
  {
    id: 'advancedgraphs', phase: 'Phase 11', title: 'Advanced Graphs', icon: '🗺️', category: 'Advanced Graphs',
    subtopics: [{ label: 'Dijkstra' }, { label: 'Minimum Spanning Tree' }]
  },
  {
    id: 'heap', phase: 'Phase 12', title: 'Heap / PQ', icon: '🏔️', category: 'Heap / Priority Queue',
    subtopics: [{ label: 'Min Heap' }, { label: 'Max Heap' }]
  },
  {
    id: 'intervals', phase: 'Phase 13', title: 'Intervals', icon: '➖', category: 'Intervals',
    subtopics: [{ label: 'Overlapping' }, { label: 'Merge' }]
  },
  {
    id: 'greedy', phase: 'Phase 14', title: 'Greedy', icon: '🤑', category: 'Greedy',
    subtopics: [{ label: 'Local Optimum' }]
  },
  {
    id: 'dp', phase: 'Phase 15', title: 'Dynamic Programming', icon: '⚡', category: 'Dynamic Programming',
    subtopics: [{ label: '1D DP' }, { label: '2D DP' }, { label: 'Memoization' }, { label: 'Tabulation' }]
  },
  {
    id: 'bit', phase: 'Phase 16', title: 'Bit Manipulation', icon: '0️⃣', category: 'Bit Manipulation',
    subtopics: [{ label: 'XOR' }, { label: 'Shifts' }]
  },
]

export function Roadmap() {
  const { data: problems = [], isLoading } = useQuery({
    queryKey: ['problems'],
    queryFn: async () => {
      const res = await apiClient.get('/problems', { withCredentials: true })
      return res.data
    }
  })

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8 mb-4" />
        <p className="text-muted">Loading roadmap...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-background scrollbar-thin">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-8 pt-12 pb-4 text-center">
        <h1 className="text-4xl font-extrabold text-text tracking-tight mb-3">
          DSA Learning <span className="text-primary">Roadmap</span>
        </h1>
        <p className="text-muted text-base max-w-xl mx-auto">
          A structured journey from fundamentals to advanced algorithms. Click any topic to start solving.
        </p>
      </div>

      {/* Zigzag Timeline */}
      <div className="max-w-4xl mx-auto px-8 pb-24 relative mt-10">
        {/* Vertical spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-border to-border/30 -translate-x-1/2 pointer-events-none" />

        {roadmapTopics.map((topic, index) => {
          const isLeft = index % 2 === 0
          const topicProblems = problems.filter((p: any) => p.category === topic.category)

          return (
            <div key={topic.id} className="relative flex items-start mb-16 group">

              {/* Spine dot */}
              <div className="absolute left-1/2 top-8 -translate-x-1/2 z-20">
                <div className="w-4 h-4 rounded-full bg-primary border-2 border-background shadow-lg shadow-primary/30 transition-all group-hover:scale-125" />
              </div>

              {/* Left side (even) */}
              {isLeft ? (
                <>
                  {/* Card — left */}
                  <div className="w-[44%] pr-10">
                    <TopicCard topic={topic} topicProblems={topicProblems} />
                  </div>
                  {/* Connector line left → spine */}
                  <div className="absolute left-[44%] top-10 w-[6%] h-px bg-primary/40" />
                  {/* Spacer right */}
                  <div className="w-[56%]" />
                </>
              ) : (
                <>
                  {/* Spacer left */}
                  <div className="w-[56%]" />
                  {/* Connector line spine → right */}
                  <div className="absolute left-[50%] top-10 w-[6%] h-px bg-primary/40" />
                  {/* Card — right */}
                  <div className="w-[44%] pl-10">
                    <TopicCard topic={topic} topicProblems={topicProblems} />
                  </div>
                </>
              )}
            </div>
          )
        })}

        {/* End badge */}
        <div className="flex flex-col items-center mt-4 relative z-10">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 mb-3">
            <span className="text-background font-black text-lg">✓</span>
          </div>
          <div className="text-primary font-bold text-sm tracking-widest uppercase">You made it!</div>
          <div className="text-muted text-xs mt-1">DSA Master</div>
        </div>
      </div>
    </div>
  )
}

function TopicCard({ topic, topicProblems }: {
  topic: RoadmapTopic
  topicProblems: any[]
}) {
  return (
    <div className={`
      bg-elevated border border-border rounded-2xl overflow-hidden shadow-lg
      hover:border-border-active hover:shadow-primary/10 hover:shadow-xl
      transition-all duration-200 group-hover:-translate-y-0.5
    `}>
      {/* Card header */}
      <div className="px-5 pt-5 pb-4 border-b border-border/60">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold tracking-widest text-muted uppercase">{topic.phase}</span>
          <span className="text-base">{topic.icon}</span>
        </div>
        <h3 className="text-lg font-extrabold text-text">{topic.title}</h3>
        {/* Subtopics */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {topic.subtopics.map(st => (
            <span key={st.label} className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-muted font-medium">
              {st.label}
            </span>
          ))}
        </div>
      </div>

      {/* Problems */}
      <div className="px-5 py-3 space-y-1">
        {topicProblems.length > 0 ? topicProblems.slice(0, 5).map(prob => (
          <Link
            key={prob.slug}
            to={`/problems/${prob.slug}`}
            className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface/80 transition-colors group/prob"
          >
            <div className="flex items-center gap-2">
              <Circle size={12} className="text-muted shrink-0" />
              <span className="text-sm text-text/80 group-hover/prob:text-text font-medium truncate max-w-[200px]" title={prob.title}>{prob.title}</span>
            </div>
            <div className="flex items-center gap-2">
              {prob.status === 'SOLVED' && <CheckCircle2 size={12} className="text-primary" />}
              <ChevronRight size={12} className="text-muted opacity-0 group-hover/prob:opacity-100 transition-opacity" />
            </div>
          </Link>
        )) : (
          <p className="text-muted text-xs py-2">Problems coming soon...</p>
        )}
      </div>

      {/* Footer link */}
      <div className="px-5 pb-4 pt-1">
        <Link
          to={`/problems?category=${encodeURIComponent(topic.category)}`}
          className="text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
        >
          View all problems <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  )
}
