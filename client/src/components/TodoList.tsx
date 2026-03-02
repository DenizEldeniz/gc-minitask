import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import type { DropResult } from '@hello-pangea/dnd'
import { deleteTodo, updateTodo, reorderTodos } from '../services/todos'
import type { TodoItem } from '../services/todos'
import TodoItemRow from './TodoItemRow'

type Props = {
  uid: string
  todos: TodoItem[]
  loading: boolean
  error: string
  setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>
}

export default function TodoList({ uid, todos, loading, error, setTodos }: Props) {

  // ── actions ────────────────────────────────────────────────────────────────

  async function handleToggle(id: string, isCompleted: boolean) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted } : t)))
    try {
      await updateTodo(uid, id, { isCompleted })
    } catch {
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: !isCompleted } : t)))
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteTodo(uid, id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch { /* ignore */ }
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    if (result.destination.index === result.source.index) return

    const pending = todos.filter((t) => !t.isCompleted)
    const completed = todos.filter((t) => t.isCompleted)

    // Reorder within pending only
    const reordered = Array.from(pending)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)

    const next = [...reordered, ...completed]
    setTodos(next) // optimistic update

    try {
      await reorderTodos(uid, reordered) // only persist pending order
    } catch {
      setTodos(todos) // rollback on failure
    }
  }

  // ── states ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <svg className="animate-spin h-7 w-7 text-primary-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm text-white/30">Yükleniyor...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-rose-400 text-sm">
        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    )
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-xl border border-white/[0.06] bg-white/[0.03] flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <p className="text-white/40 text-sm font-medium">Görev bulunamadı</p>
        <p className="text-white/20 text-xs mt-1">Yukarıdan yeni bir görev ekle</p>
      </div>
    )
  }

  const pending = todos.filter((t) => !t.isCompleted)
  const completed = todos.filter((t) => t.isCompleted)

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">

        {/* Pending — draggable */}
        {pending.length > 0 && (
          <section>
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-3">
              Bekleyen — {pending.length}
            </p>
            <Droppable droppableId="pending">
              {(provided) => (
                <ul
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  {pending.map((todo, index) => (
                    <Draggable key={todo.id} draggableId={todo.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.85 : 1,
                          }}
                        >
                          <TodoItemRow
                            todo={todo}
                            onToggle={(checked) => handleToggle(todo.id, checked)}
                            onDelete={() => handleDelete(todo.id)}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </section>
        )}

        {/* Completed — static, not draggable */}
        {completed.length > 0 && (
          <section>
            <p className="text-[11px] font-semibold text-white/20 uppercase tracking-widest mb-3">
              Tamamlanan — {completed.length}
            </p>
            <ul className="space-y-2">
              {completed.map((todo) => (
                <TodoItemRow
                  key={todo.id}
                  todo={todo}
                  onToggle={(checked) => handleToggle(todo.id, checked)}
                  onDelete={() => handleDelete(todo.id)}
                />
              ))}
            </ul>
          </section>
        )}

      </div>
    </DragDropContext>
  )
}
