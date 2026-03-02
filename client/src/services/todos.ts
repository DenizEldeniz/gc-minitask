import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    writeBatch,
    onSnapshot,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

// ── Types ─────────────────────────────────────────────────────────────────────

export type TodoItem = {
    id: string
    title: string
    description?: string
    isCompleted: boolean
    deadline?: string
    sortOrder: number
    createdAt: string
}

type TodoDoc = {
    title: string
    description?: string
    isCompleted: boolean
    deadline?: string
    sortOrder?: number
    createdAt?: Timestamp
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function todosCollection(uid: string) {
    return collection(db, 'users', uid, 'todos')
}

function todoFromDoc(id: string, data: TodoDoc): TodoItem {
    const createdAt =
        data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : new Date().toISOString()
    return {
        id,
        title: data.title ?? '',
        description: data.description,
        isCompleted: data.isCompleted ?? false,
        deadline: data.deadline,
        sortOrder: data.sortOrder ?? 0,
        createdAt,
    }
}

function sortTodos(items: TodoItem[]): TodoItem[] {
    return items.sort((a, b) => a.sortOrder - b.sortOrder || (b.createdAt > a.createdAt ? 1 : -1))
}

// ── Firestore functions ────────────────────────────────────────────────────────

/** Real-time listener — serves from local cache instantly, syncs from network in background. */
export function subscribeToTodos(
    uid: string,
    onData: (items: TodoItem[]) => void,
    onError: (err: Error) => void
): () => void {
    return onSnapshot(
        todosCollection(uid),
        (snap) => {
            const items = snap.docs.map((d) => todoFromDoc(d.id, d.data() as TodoDoc))
            onData(sortTodos(items))
        },
        (err) => onError(err)
    )
}

/** nextSortOrder is computed by the caller from current todos state — no extra Firestore read needed. */
export async function createTodo(
    uid: string,
    title: string,
    nextSortOrder: number,
    description?: string,
    deadline?: string
): Promise<TodoItem> {
    const payload: Record<string, unknown> = {
        title: title.trim(),
        isCompleted: false,
        sortOrder: nextSortOrder,
        createdAt: serverTimestamp(),
    }
    if (description?.trim()) payload.description = description.trim()
    if (deadline) payload.deadline = deadline

    const ref = await addDoc(todosCollection(uid), payload)

    return {
        id: ref.id,
        title: title.trim(),
        description: description?.trim(),
        isCompleted: false,
        deadline,
        sortOrder: nextSortOrder,
        createdAt: new Date().toISOString(),
    }
}

export async function updateTodo(
    uid: string,
    id: string,
    data: Partial<Pick<TodoItem, 'title' | 'description' | 'isCompleted' | 'deadline' | 'sortOrder'>>
): Promise<void> {
    const ref = doc(db, 'users', uid, 'todos', id)
    const updates: Record<string, unknown> = {}
    if (data.title !== undefined) updates.title = data.title
    if (data.description !== undefined) updates.description = data.description
    if (data.isCompleted !== undefined) updates.isCompleted = data.isCompleted
    if (data.deadline !== undefined) updates.deadline = data.deadline
    if (data.sortOrder !== undefined) updates.sortOrder = data.sortOrder
    await updateDoc(ref, updates)
}

export async function deleteTodo(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid, 'todos', id))
}

export async function reorderTodos(uid: string, items: TodoItem[]): Promise<void> {
    const batch = writeBatch(db)
    items.forEach((item, index) => {
        const ref = doc(db, 'users', uid, 'todos', item.id)
        batch.update(ref, { sortOrder: index })
    })
    await batch.commit()
}
