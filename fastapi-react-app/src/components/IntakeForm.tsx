import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Relationship, WillStatus, ExecutorStatus, IntakeAnswers, Task, Board } from '../types'
import { generateTasks } from '../lib/api'
import { setBoard } from '../lib/storage'
import ReviewTasks from './ReviewTasks'

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District of Columbia', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
]

type IntakeData = {
  state: string
  relationship: Relationship | ''
  hasWill: WillStatus | ''
  isExecutor: ExecutorStatus | ''
}

function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T | ''
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
            value === opt.value
              ? 'bg-stone-800 text-white border-stone-800'
              : 'bg-white text-stone-600 border-stone-300 hover:border-stone-500'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function IntakeForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'intake' | 'name' | 'review'>('intake')
  const [intake, setIntake] = useState<IntakeData>({
    state: '',
    relationship: '',
    hasWill: '',
    isExecutor: '',
  })
  const [boardName, setBoardName] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [toggles, setToggles] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const intakeComplete =
    intake.state !== '' &&
    intake.relationship !== '' &&
    intake.hasWill !== '' &&
    intake.isExecutor !== ''

  async function handleProceedToReview() {
    if (!boardName.trim()) return
    setLoading(true)
    setError(null)
    try {
      const generated = await generateTasks(intake as IntakeAnswers)
      setTasks(generated)
      setToggles(Object.fromEntries(generated.map((t) => [t.id, t.defaultEnabled])))
      setStep('review')
    } catch {
      setError('Could not load tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleToggle(id: string) {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleCreate() {
    const board: Board = {
      name: boardName.trim(),
      intake: intake as IntakeAnswers,
      tasks: tasks.map((t) => ({
        id: t.id,
        enabled: toggles[t.id] ?? t.defaultEnabled,
        completed: false,
        bucket: t.bucket,
      })),
      createdAt: new Date().toISOString(),
    }
    setBoard(board)
    navigate('/checklist')
  }

  if (step === 'review') {
    return (
      <ReviewTasks
        boardName={boardName.trim()}
        tasks={tasks}
        toggles={toggles}
        onToggle={handleToggle}
        onCreate={handleCreate}
      />
    )
  }

  if (step === 'name') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-start justify-center py-16 px-4">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <p className="text-sm text-stone-400 mb-2">Step 2 of 3</p>
            <h1 className="text-2xl font-semibold text-stone-900">Name your checklist</h1>
            <p className="mt-2 text-stone-500 text-sm leading-relaxed">
              Naming it after your loved one can make this feel a little less clinical.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Their name</label>
              <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleProceedToReview()}
                placeholder="e.g. Mom, Dad, Robert"
                className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              onClick={handleProceedToReview}
              disabled={!boardName.trim() || loading}
              className="w-full rounded-full bg-stone-800 px-6 py-3 text-white font-medium disabled:opacity-40 hover:bg-stone-700 transition-colors"
            >
              {loading ? 'Loading…' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8">
          <p className="text-sm text-stone-400 mb-2">Step 1 of 3</p>
          <h1 className="text-2xl font-semibold text-stone-900">Let&apos;s build your checklist</h1>
          <p className="mt-2 text-stone-500 text-sm leading-relaxed">
            A few quick questions so we can focus on what matters for your situation.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-7">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              What state are you in?
            </label>
            <select
              value={intake.state}
              onChange={(e) => setIntake({ ...intake, state: e.target.value })}
              className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white"
            >
              <option value="">Select a state</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Your relationship to the person who passed
            </label>
            <PillGroup<Relationship>
              value={intake.relationship}
              onChange={(v) => setIntake({ ...intake, relationship: v })}
              options={[
                { value: 'spouse', label: 'Spouse / Partner' },
                { value: 'parent', label: 'Parent' },
                { value: 'child', label: 'Child' },
                { value: 'sibling', label: 'Sibling' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Did they have a will?
            </label>
            <PillGroup<WillStatus>
              value={intake.hasWill}
              onChange={(v) => setIntake({ ...intake, hasWill: v })}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'unknown', label: "I'm not sure" },
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Are you the executor of their estate?
            </label>
            <PillGroup<ExecutorStatus>
              value={intake.isExecutor}
              onChange={(v) => setIntake({ ...intake, isExecutor: v })}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'unsure', label: 'Not sure' },
              ]}
            />
          </div>

          <button
            onClick={() => setStep('name')}
            disabled={!intakeComplete}
            className="w-full rounded-full bg-stone-800 px-6 py-3 text-white font-medium disabled:opacity-40 hover:bg-stone-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
