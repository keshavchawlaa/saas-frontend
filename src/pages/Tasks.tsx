import { useEffect, useState } from 'react'
import { getMyTasks } from '../api/tasks.api'
import type { Task } from '../types/task'

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getMyTasks()
        setTasks(data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div>Loading tasks…</div>

  if (!tasks.length) return <div>No tasks assigned.</div>

  return (
    <div>
      <h2>My Tasks</h2>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <strong>{t.title}</strong> — {t.status}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Tasks
