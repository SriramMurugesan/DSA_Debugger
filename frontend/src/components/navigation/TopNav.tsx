import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, User as UserIcon } from 'lucide-react'

export function TopNav() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Problems', path: '/problems' },
    { name: 'Roadmap', path: '/roadmap' },
    { name: 'Visualizer', path: '/visualizer' },
  ]

  return (
    <nav className="h-14 border-b border-border bg-surface shrink-0 z-50 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-8">
        <Link to="/dashboard" className="flex items-center space-x-2.5">
          <img src="/logo.png" alt="MagizhCode Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-extrabold text-text tracking-tight">
            Magizh<span className="text-primary">Code</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-4 text-sm font-semibold transition-colors ${
                  isActive ? 'text-primary' : 'text-muted hover:text-text'
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* User avatar */}
      <div className="flex items-center space-x-3 relative" ref={menuRef}>
        {user ? (
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary/40 bg-primary/10 overflow-hidden hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary font-bold text-sm">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
            )}
          </button>
        ) : (
          <Link to="/" className="text-sm font-semibold text-primary hover:text-primary-light">Sign In</Link>
        )}

        {menuOpen && user && (
          <div className="absolute top-10 right-0 w-64 bg-elevated border border-border rounded-xl shadow-xl overflow-hidden py-1 z-50">
            <div className="px-4 py-3 border-b border-border">
              <div className="font-bold text-sm text-text truncate">{user.name}</div>
              <div className="text-xs text-muted truncate">{user.email}</div>
            </div>
            <div className="py-1">
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-muted hover:text-text hover:bg-surface transition-colors">
                <UserIcon size={14} className="mr-2" /> Profile
              </Link>
              <button 
                onClick={() => { setMenuOpen(false); logout(); }}
                className="w-full flex items-center px-4 py-2 text-sm text-crimson hover:bg-crimson/10 transition-colors"
              >
                <LogOut size={14} className="mr-2" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
