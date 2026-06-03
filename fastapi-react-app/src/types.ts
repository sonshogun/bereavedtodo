export type Relationship = 'spouse' | 'parent' | 'child' | 'sibling' | 'other'
export type WillStatus = 'yes' | 'no' | 'unknown'
export type ExecutorStatus = 'yes' | 'no' | 'unsure'
export type Bucket = 'immediate' | 'this-week' | 'this-month' | 'six-months'

export type IntakeAnswers = {
  state: string
  relationship: Relationship
  hasWill: WillStatus
  isExecutor: ExecutorStatus
}

export type Task = {
  id: string
  bucket: Bucket
  title: string
  why: string
  nextStep: string
  defaultEnabled: boolean
}

export type TaskState = {
  id: string
  enabled: boolean
  completed: boolean
  bucket?: Bucket          // stored at creation time for generated tasks
  custom?: { title: string; bucket: Bucket }
  bucketOverride?: Bucket
}

export type Board = {
  name: string
  intake: IntakeAnswers
  tasks: TaskState[]
  createdAt: string
}

export const BUCKET_LABELS: Record<Bucket, string> = {
  immediate: 'Today / Next 48 Hours',
  'this-week': 'This Week',
  'this-month': 'This Month',
  'six-months': 'Within 6 Months',
}

export const BUCKET_ORDER: Bucket[] = ['immediate', 'this-week', 'this-month', 'six-months']
