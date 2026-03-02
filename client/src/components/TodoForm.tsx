import { useState } from 'react'
import { createTodo } from '../services/todos'
import type { TodoItem } from '../services/todos'

type Props = {
  uid: string
  currentCount: number
  onAdded?: (todo: TodoItem) => void
}

export default function TodoForm({ uid, currentCount, onAdded }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const MAX_TITLE = 100
  const titleTooLong = title.length > MAX_TITLE

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const t = title.trim()
    if (!t || titleTooLong) return
    setError('')
    setLoading(true)
    try {
      const todo = await createTodo(uid, t, currentCount, description || undefined, deadline || undefined)
      onAdded?.(todo)
      setTitle('')
      setDescription('')
      setDeadline('')
      setExpanded(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit}>
        {/* Main input row */}
        <div className={`flex gap-2 bg-white/[0.04] border rounded-xl p-2 transition-colors ${titleTooLong
          ? 'border-rose-500/50'
          : 'border-white/[0.08] focus-within:border-primary-500/50'
          }`}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Yeni görev ekle..."
            className="flex-1 bg-transparent px-3 py-2 text-white placeholder-white/25 text-sm outline-none"
          />
          {/* Expand toggle */}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? 'Detayları gizle' : 'Açıklama & tarih ekle'}
            className={`p-2 rounded-lg transition-colors ${expanded
              ? 'text-primary-400 bg-primary-500/10'
              : 'text-white/30 hover:text-white/60 hover:bg-white/[0.06]'
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={expanded ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
              />
            </svg>
          </button>
          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !title.trim() || titleTooLong}
            className="flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-500 disabled:bg-white/[0.06] disabled:text-white/20 text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ekle
              </>
            )}
          </button>
        </div>

        {/* Expandable extra fields */}
        {expanded && (
          <div className="mt-2 space-y-2 animate-fade-in">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Açıklama (opsiyonel)..."
              rows={2}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white/80 placeholder-white/25 text-sm outline-none focus:border-primary-500/50 transition-colors resize-none"
            />
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 focus-within:border-primary-500/50 transition-colors">
              <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="flex-1 bg-transparent text-white/80 text-sm outline-none [color-scheme:dark]"
              />
              {deadline && (
                <button
                  type="button"
                  onClick={() => setDeadline('')}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-1 px-2">
          {error
            ? <p className="text-xs text-rose-400">{error}</p>
            : <span />
          }
          {title.length > 0 && (
            <p className={`text-xs tabular-nums ${titleTooLong ? 'text-rose-400' : 'text-white/30'
              }`}>{title.length}/{MAX_TITLE}</p>
          )}
        </div>
      </form>
    </div>
  )
}
