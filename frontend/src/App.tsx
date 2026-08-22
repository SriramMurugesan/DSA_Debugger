import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/navigation/ProtectedRoute'

import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { ProblemList } from './pages/ProblemList'
import { ProblemWorkspace } from './pages/ProblemWorkspace'
import { Roadmap } from './pages/Roadmap'
import { FreeVisualizer } from './pages/FreeVisualizer'
import { TopNav } from './components/navigation/TopNav'

const queryClient = new QueryClient()

// Auto-redirect if logged in
function LandingOrDashboard() {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen bg-background" />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col h-screen w-full bg-background text-text overflow-hidden">
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingOrDashboard />} />
              
              {/* App Routes with TopNav */}
              <Route path="/*" element={
                <div className="flex flex-col h-full w-full overflow-hidden">
                  <TopNav />
                  <div className="flex-1 overflow-hidden relative">
                    <Routes>
                      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/problems" element={<ProtectedRoute><ProblemList /></ProtectedRoute>} />
                      <Route path="/problems/:slug" element={<ProtectedRoute><ProblemWorkspace /></ProtectedRoute>} />
                      <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
                      <Route path="/visualizer" element={<ProtectedRoute><FreeVisualizer /></ProtectedRoute>} />
                    </Routes>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
