import type { Task } from '../types'
import { BUCKET_ORDER, BUCKET_LABELS } from '../types'

export default function ReviewTasks({
  boardName,
  tasks,
  toggles,
  onToggle,
  onCreate,
}: {
  boardName: string
  tasks: Task[]
  toggles: Record<string, boolean>
  onToggle: (id: string) => void
  onCreate: () => void
}) {
  const enabledCount = Object.values(toggles).filter(Boolean).length

  return (
    <div className="min-h-screen bg-stone-50 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <p className="text-sm text-stone-400 mb-2">Step 3 of 3</p>
          <h1 className="text-2xl font-semibold text-stone-900">Review your tasks</h1>
          <p className="mt-2 text-stone-500 text-sm leading-relaxed">
            We&apos;ve pre-selected the tasks most relevant to your situation. Uncheck anything that doesn&apos;t apply.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {BUCKET_ORDER.map((bucket) => {
            const bucketTasks = tasks.filter((t) => t.bucket === bucket)
            if (bucketTasks.length === 0) return null
            return (
              <div key={bucket}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  {BUCKET_LABELS[bucket]}
                </h2>
                <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100">
                  {bucketTasks.map((task) => (
                    <label
                      key={task.id}
                      className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-stone-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={toggles[task.id] ?? task.defaultEnabled}
                        onChange={() => onToggle(task.id)}
                        className="mt-0.5 w-4 h-4 rounded border-stone-300 text-stone-800 focus:ring-stone-400"
                      />
                      <span className={`text-sm leading-relaxed ${
                        toggles[task.id] ? 'text-stone-900' : 'text-stone-400 line-through'
                      }`}>
                        {task.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8">
          <button
            onClick={onCreate}
            className="w-full rounded-full bg-stone-800 px-6 py-3 text-white font-medium hover:bg-stone-700 transition-colors"
          >
            Create {boardName}&apos;s checklist ({enabledCount} tasks)
          </button>
        </div>
      </div>
    </div>
  )
}
