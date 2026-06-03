import type { IntakeAnswers, Task } from '../types'

export async function generateTasks(intake: IntakeAnswers): Promise<Task[]> {
  const res = await fetch('/api/tasks/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(intake),
  })
  if (!res.ok) throw new Error('Failed to generate tasks')
  return res.json() as Promise<Task[]>
}
