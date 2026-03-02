import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { fetchTodos } from '../services/todos'
import type { TodoItem } from '../services/todos'
import TodoForm from '../components/TodoForm'
import TodoList from '../components/TodoList'

export default function TodoPage() {
  const { user, email, profile, logout } = useAuth()
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  if (!user) return null

  async function load(uid: string) {
    setError('')
    try {
      const list = await fetchTodos(uid)
      setTodos(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Liste yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(user.uid)
  }, [user.uid])

  const completedCount = todos.filter((t) => t.isCompleted).length
  const pendingCount = todos.filter((t) => !t.isCompleted).length
  const totalCount = todos.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : email?.split('@')[0] ?? 'Kullanıcı'
  const avatarLetter = (profile?.firstName ?? email ?? 'K')[0]

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* ── SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-white/[0.06] shrink-0 sticky top-0 h-screen overflow-y-auto">

        {/* ── Top hero area ── */}
        <div className="relative overflow-hidden px-8 pt-8 pb-6 border-b border-white/[0.06]">
          {/* Decorative blob */}
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-primary-600/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 -left-4 w-20 h-20 rounded-full bg-primary-800/15 blur-xl pointer-events-none" />

          {/* Logo */}
          <div className="relative flex items-baseline gap-0.5 mb-5">
            <span className="text-white font-bold text-base tracking-tight">tasks</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mb-0.5 shrink-0" />
          </div>

        </div>

        {/* ── Stats ── */}
        <div className="flex-1 px-8 py-6 space-y-3">
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-4">Durum</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-3">
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
              <p className="text-[11px] text-white/40 mt-0.5">Bekleyen</p>
            </div>
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-3">
              <p className="text-2xl font-bold text-primary-400">{completedCount}</p>
              <p className="text-[11px] text-white/40 mt-0.5">Tamamlanan</p>
            </div>
          </div>

          {/* Progress ring */}
          {totalCount > 0 && (
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-4 flex items-center gap-4">
              <div className="relative w-12 h-12 shrink-0">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke="#6366f1" strokeWidth="3"
                    strokeDasharray={`${progress * 0.942} 94.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                  {progress}%
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">İlerleme</p>
                <p className="text-[11px] text-white/40">{completedCount}/{totalCount} görev</p>
              </div>
            </div>
          )}
        </div>

        {/* ── User card (bottom) ── */}
        <div className="px-8 py-5 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-white uppercase">{avatarLetter}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-[11px] text-white/40 truncate">{email}</p>
            </div>
            <button
              onClick={logout}
              title="Çıkış yap"
              className="p-1.5 rounded-lg text-white/25 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center">
            <span className="text-white font-black tracking-tight">GC-TODOLIST</span>
          </div>
          <button onClick={logout} className="text-sm text-white/50 hover:text-white transition-colors">Çıkış</button>
        </header>

        {/* Content */}
        <main className="flex-1 px-6 sm:px-10 py-10 max-w-3xl w-full mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Görevler</h1>
            <p className="text-white/40 text-sm">
              {totalCount === 0 ? 'Henüz görev eklenmedi' : `${pendingCount} görev bekliyor`}
            </p>
          </div>

          {/* Mobile stats strip */}
          <div className="lg:hidden flex gap-3 mb-6">
            <div className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-4 py-3">
              <p className="text-lg font-bold text-white">{pendingCount}</p>
              <p className="text-[11px] text-white/40">Bekleyen</p>
            </div>
            <div className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-4 py-3">
              <p className="text-lg font-bold text-primary-400">{completedCount}</p>
              <p className="text-[11px] text-white/40">Tamamlanan</p>
            </div>
            {totalCount > 0 && (
              <div className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-4 py-3">
                <p className="text-lg font-bold text-white">{progress}%</p>
                <p className="text-[11px] text-white/40">İlerleme</p>
              </div>
            )}
          </div>

          {/* Add task form */}
          <TodoForm uid={user.uid} onAdded={(todo) => setTodos((prev) => [todo, ...prev])} />

          {/* Task list */}
          <TodoList
            uid={user.uid}
            todos={todos}
            loading={loading}
            error={error}
            setTodos={setTodos}
          />
        </main>
      </div>
    </div>
  )
}
