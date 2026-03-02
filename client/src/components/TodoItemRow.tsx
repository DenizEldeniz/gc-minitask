import type { TodoItem } from '../services/todos'
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd'

type Props = {
  todo: TodoItem
  onToggle: (checked: boolean) => void
  onDelete: () => void
  dragHandleProps?: DraggableProvidedDragHandleProps | null
}

// ── Deadline badge ─────────────────────────────────────────────────────────────

function DeadlineBadge({ deadline }: { deadline: string }) {
  const date = new Date(deadline)
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekEnd = new Date(todayStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const isOverdue = date < todayStart
  const isToday = date >= todayStart && date < new Date(todayStart.getTime() + 86_400_000)
  const isThisWeek = date >= todayStart && date <= weekEnd

  const label = date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })

  const style = isOverdue || isToday
    ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    : isThisWeek
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : 'text-white/40 bg-white/[0.04] border-white/[0.08]'

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium border rounded-md px-1.5 py-0.5 shrink-0 ${style}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      {isOverdue ? `Geçti · ${label}` : isToday ? `Bugün` : label}
    </span>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function TodoItemRow({ todo, onToggle, onDelete, dragHandleProps }: Props) {
  return (
    <li
      className={`group flex items-start gap-3 rounded-xl border px-4 py-3.5 transition-all duration-150 ${todo.isCompleted
        ? 'border-white/[0.04] bg-white/[0.02]'
        : 'border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] hover:border-white/[0.12]'
        }`}
    >
      {/* Drag handle */}
      {dragHandleProps && (
        <span
          {...dragHandleProps}
          className="mt-0.5 shrink-0 text-white/0 group-hover:text-white/20 transition-colors cursor-grab active:cursor-grabbing"
          aria-label="Sırala"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm8-15a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
          </svg>
        </span>
      )}

      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onToggle(!todo.isCompleted)}
        className={`shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${todo.isCompleted
          ? 'bg-primary-600 border-primary-600'
          : 'border-white/20 hover:border-primary-500 bg-transparent'
          }`}
        aria-label={todo.isCompleted ? 'Tamamlamayı geri al' : 'Tamamla'}
      >
        {todo.isCompleted && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-medium transition-colors leading-snug ${todo.isCompleted ? 'line-through text-white/25' : 'text-white/80'
              }`}
          >
            {todo.title}
          </span>
          {todo.deadline && !todo.isCompleted && (
            <DeadlineBadge deadline={todo.deadline} />
          )}
        </div>
        {todo.description && (
          <p className={`text-xs mt-1 leading-relaxed ${todo.isCompleted ? 'text-white/15' : 'text-white/35'}`}>
            {todo.description}
          </p>
        )}
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        className="p-1.5 mt-0.5 shrink-0 rounded-md text-white/0 group-hover:text-white/25 hover:!text-rose-400 hover:bg-rose-500/10 transition-all focus:text-white/25"
        title="Sil"
        aria-label="Sil"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </li>
  )
}
