import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Board, Bucket, TaskState, Task } from '../types'
import { BUCKET_ORDER, BUCKET_LABELS } from '../types'
import { getBoard, setBoard } from '../lib/storage'

type TaskDetail = Pick<Task, 'title' | 'why' | 'nextStep'>

function GripIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" aria-hidden>
      <circle cx="2.5" cy="2.5" r="1.5" />
      <circle cx="7.5" cy="2.5" r="1.5" />
      <circle cx="2.5" cy="7" r="1.5" />
      <circle cx="7.5" cy="7" r="1.5" />
      <circle cx="2.5" cy="11.5" r="1.5" />
      <circle cx="7.5" cy="11.5" r="1.5" />
    </svg>
  )
}

function SortableTaskRow({
  ts,
  detail,
  isExpanded,
  onToggleComplete,
  onToggleExpand,
  onDelete,
}: {
  ts: TaskState
  detail: TaskDetail | null
  isExpanded: boolean
  onToggleComplete: (id: string) => void
  onToggleExpand: (id: string) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: ts.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
    position: isDragging ? ('relative' as const) : undefined,
  }

  const isCustom = !!ts.custom
  const title = ts.custom?.title ?? detail?.title ?? ''

  return (
    <div ref={setNodeRef} style={style} className="first:rounded-t-2xl last:rounded-b-2xl overflow-hidden bg-white">
      <div className="flex items-center gap-2 px-3 py-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex-shrink-0 p-1 text-stone-300 hover:text-stone-400 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
          tabIndex={-1}
        >
          <GripIcon />
        </button>
        <button
          type="button"
          onClick={() => onToggleComplete(ts.id)}
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            ts.completed
              ? 'bg-stone-800 border-stone-800'
              : 'bg-white border-stone-300 hover:border-stone-500'
          }`}
          aria-label={ts.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {ts.completed && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        {isCustom ? (
          <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
            <span className={`text-sm ${ts.completed ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
              {title}
            </span>
            <button
              type="button"
              onClick={() => onDelete(ts.id)}
              className="flex-shrink-0 text-stone-300 hover:text-stone-500 transition-colors"
              aria-label="Remove task"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onToggleExpand(ts.id)}
            className="flex-1 flex items-center justify-between text-left gap-2 min-w-0"
          >
            <span className={`text-sm ${ts.completed ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
              {title}
            </span>
            <svg
              className={`flex-shrink-0 w-4 h-4 text-stone-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      {!isCustom && isExpanded && detail && (
        <div className="px-4 pb-4 pl-14 flex flex-col gap-3 bg-stone-50 border-t border-stone-100">
          <div className="pt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Why it matters</p>
            <p className="text-sm text-stone-600 leading-relaxed">{detail.why}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Next step</p>
            <p className="text-sm text-stone-600 leading-relaxed">{detail.nextStep}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function AddTaskRow({ bucket, onAdd }: { bucket: Bucket; onAdd: (title: string, bucket: Bucket) => void }) {
  const [isAdding, setIsAdding] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleOpen() {
    setIsAdding(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function handleAdd() {
    if (input.trim()) onAdd(input.trim(), bucket)
    setInput('')
    setIsAdding(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') { setIsAdding(false); setInput('') }
  }

  if (isAdding) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 mt-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder="Add a task…"
          className="flex-1 text-sm bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="flex items-center gap-2 px-3 py-2 mt-2 text-sm text-stone-400 hover:text-stone-600 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Add a task
    </button>
  )
}

function getEffectiveBucket(ts: TaskState): Bucket {
  if (ts.bucketOverride) return ts.bucketOverride
  if (ts.custom) return ts.custom.bucket
  return ts.bucket ?? 'immediate'
}

export default function ChecklistView() {
  const navigate = useNavigate()
  const [board, setLocalBoard] = useState<Board | null>(null)
  const [detailMap, setDetailMap] = useState<Map<string, TaskDetail>>(new Map())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    const stored = getBoard()
    if (!stored) { navigate('/'); return }
    setLocalBoard(stored)

    fetch('/api/tasks/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stored.intake),
    })
      .then((r) => r.json())
      .then((tasks: Task[]) => {
        setDetailMap(new Map(tasks.map((t) => [t.id, { title: t.title, why: t.why, nextStep: t.nextStep }])))
      })
      .catch(() => {})
  }, [navigate])

  if (!board) return null

  const b: Board = board

  const enabledTasks = b.tasks.filter((t) => t.enabled)
  const completedCount = b.tasks.filter((t) => t.completed).length
  const totalCount = enabledTasks.length
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  function save(updated: Board) {
    setBoard(updated)
    setLocalBoard(updated)
  }

  function toggleComplete(id: string) {
    save({ ...b, tasks: b.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t) })
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function deleteTask(id: string) {
    save({ ...b, tasks: b.tasks.filter((t) => t.id !== id) })
  }

  function addCustomTask(title: string, bucket: Bucket) {
    const newTask: TaskState = {
      id: `custom-${Date.now()}`,
      enabled: true,
      completed: false,
      custom: { title, bucket },
    }
    save({ ...b, tasks: [...b.tasks, newTask] })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = b.tasks.findIndex((t) => t.id === active.id)
    const newIndex = b.tasks.findIndex((t) => t.id === over.id)
    const activeTs = b.tasks[oldIndex]
    const overTs = b.tasks[newIndex]
    if (!activeTs || !overTs) return

    const activeBucket = getEffectiveBucket(activeTs)
    const overBucket = getEffectiveBucket(overTs)
    let reordered = arrayMove(b.tasks, oldIndex, newIndex)

    if (activeBucket !== overBucket) {
      reordered = reordered.map((t) => {
        if (t.id !== active.id) return t
        if (t.custom) return { ...t, custom: { ...t.custom, bucket: overBucket } }
        return { ...t, bucketOverride: overBucket }
      })
    }

    save({ ...b, tasks: reordered })
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-lg font-semibold text-stone-900">{b.name}&apos;s checklist</h1>
          <p className="text-sm text-stone-400 mt-0.5">{completedCount} of {totalCount} tasks complete</p>
          <div className="mt-2 h-1 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-1 bg-stone-800 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-6">
          {BUCKET_ORDER.map((bucket) => {
            const bucketTasks = enabledTasks.filter((ts) => getEffectiveBucket(ts) === bucket)
            return (
              <div key={bucket}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  {BUCKET_LABELS[bucket]}
                </h2>
                <SortableContext items={bucketTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
                    {bucketTasks.map((ts) => (
                      <SortableTaskRow
                        key={ts.id}
                        ts={ts}
                        detail={ts.custom ? null : (detailMap.get(ts.id) ?? null)}
                        isExpanded={expanded.has(ts.id)}
                        onToggleComplete={toggleComplete}
                        onToggleExpand={toggleExpand}
                        onDelete={deleteTask}
                      />
                    ))}
                  </div>
                </SortableContext>
                <AddTaskRow bucket={bucket} onAdd={addCustomTask} />
              </div>
            )
          })}
        </div>
      </DndContext>
    </div>
  )
}
