import { Link } from 'react-router-dom'
import { Flame, Trophy, Target, ArrowRight, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../utils/api'

interface DashboardData {
  solved: number;
  total: number;
  streak: number;
  progress: number;
  categories: {
    name: string;
    solved: number;
    total: number;
    path: string;
  }[];
}

export function Dashboard() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard', { withCredentials: true })
      return res.data
    }
  })

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8 mb-4" />
        <p className="text-muted">Loading your progress...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-crimson mb-2 font-bold">Failed to load dashboard.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-surface rounded hover:bg-elevated">Retry</button>
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-background scrollbar-thin">
      <div className="max-w-5xl mx-auto px-8 py-10 space-y-10">

        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-extrabold text-text tracking-tight mb-1">Welcome back 👋</h1>
          <p className="text-muted text-sm">Continue your algorithm mastery journey.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard
            icon={<Trophy size={26} />}
            iconColor="text-primary"
            iconBg="bg-primary/10 border-primary/20"
            label="Problems Solved"
            value={data.solved.toString()}
            sub={`/ ${data.total} total`}
          />
          <StatCard
            icon={<Flame size={26} />}
            iconColor="text-orange-400"
            iconBg="bg-orange-500/10 border-orange-500/20"
            label="Current Streak"
            value={data.streak.toString()}
            sub="days"
          />
          <div className="bg-elevated border border-border p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl border bg-success/10 border-success/20 flex items-center justify-center text-success shrink-0`}>
                <Target size={26} />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Progress</div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-black text-text">{data.progress}%</span>
                </div>
                <div className="w-full bg-surface rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full" style={{ width: `${data.progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-text flex items-center gap-3">
              <span className="w-1 h-6 bg-primary rounded-full inline-block" />
              Continue Learning
            </h2>
            <Link to="/roadmap" className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
              Full Roadmap <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.categories.map(cat => {
              const pct = cat.total > 0 ? Math.round((cat.solved / cat.total) * 100) : 0
              return (
                <Link
                  key={cat.name}
                  to={cat.path}
                  className="bg-elevated border border-border hover:border-border-active p-5 rounded-xl transition-all group shadow-sm flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-text group-hover:text-primary transition-colors text-base">{cat.name}</h3>
                    <span className="text-xs font-bold text-muted bg-surface px-2 py-0.5 rounded">
                      {cat.solved}/{cat.total}
                    </span>
                  </div>
                  <div className="mt-auto">
                    <div className="w-full bg-surface rounded-full h-1">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-muted mt-1.5 font-medium">{pct}% complete</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ icon, iconColor, iconBg, label, value, sub }: {
  icon: React.ReactNode
  iconColor: string
  iconBg: string
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="bg-elevated border border-border p-6 rounded-2xl flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl border ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-muted mb-1">{label}</div>
        <div className="text-3xl font-black text-text leading-none">
          {value}
          {sub && <span className="text-base font-medium text-muted ml-1">{sub}</span>}
        </div>
      </div>
    </div>
  )
}
