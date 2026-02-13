import { useCallback, useEffect, useMemo, useState } from 'react'
import { useContext } from 'react'
import {
  assignTask,
  createTask,
  getMyTasks,
  getTasks,
  unassignTask,
  updateTaskStatus,
} from '../api/tasks.api'
import type { TaskStatus } from '../api/tasks.api'
import { getProjects } from '../api/projects.api'
import { getUsers } from '../api/users.api'
import { AuthContext } from '../auth/AuthContext'
import type { Task } from '../types/task'
import type { Project } from '../types/project'

type ViewScope = 'mine' | 'project'
type StatusFilter = 'ALL' | TaskStatus

interface OrgUser {
  role: string
  user: {
    id: string
    email: string
    name?: string
  }
}

const NEXT_STATUS: Record<TaskStatus, TaskStatus | null> = {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: null,
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const maybeResponse = (error as {
      response?: { data?: { message?: string } }
    }).response
    return maybeResponse?.data?.message || fallback
  }
  return fallback
}

const Tasks = () => {
  const auth = useContext(AuthContext)
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([])

  const [scope, setScope] = useState<ViewScope>('mine')
  const [projectId, setProjectId] = useState('')
  const [status, setStatus] = useState<StatusFilter>('ALL')

  const [newTaskProjectId, setNewTaskProjectId] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canManageAssignments =
    auth?.user?.role === 'OWNER' || auth?.user?.role === 'ADMIN'

  const userNameMap = useMemo(() => {
    const map = new Map<string, string>()
    for (const item of orgUsers) {
      map.set(item.user.id, item.user.name || item.user.email)
    }
    return map
  }, [orgUsers])

  const loadReferenceData = useCallback(async () => {
    try {
      const projectData = await getProjects()
      setProjects(projectData)
      if (projectData.length > 0) {
        setProjectId(prev => prev || projectData[0].id)
        setNewTaskProjectId(prev => prev || projectData[0].id)
      }

      if (canManageAssignments) {
        try {
          const usersData = await getUsers()
          setOrgUsers(usersData)
        } catch {
          setOrgUsers([])
        }
      } else {
        setOrgUsers([])
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load projects'))
    }
  }, [canManageAssignments])

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (scope === 'mine') {
        const data = await getMyTasks(status === 'ALL' ? undefined : status)
        setTasks(data)
      } else if (projectId) {
        const data = await getTasks(projectId)
        if (status === 'ALL') {
          setTasks(data)
        } else {
          setTasks(data.filter((t: Task) => t.status === status))
        }
      } else {
        setTasks([])
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to load tasks'))
    } finally {
      setLoading(false)
    }
  }, [projectId, scope, status])

  useEffect(() => {
    loadReferenceData()
  }, [loadReferenceData])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleCreateTask = async () => {
    if (!newTaskProjectId || !newTaskTitle.trim()) return
    setSaving(true)
    setError(null)
    try {
      await createTask(
        newTaskProjectId,
        newTaskTitle.trim(),
        newTaskDescription.trim() || undefined
      )
      setNewTaskTitle('')
      setNewTaskDescription('')
      setScope('project')
      setProjectId(newTaskProjectId)
      await loadTasks()
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to create task'))
    } finally {
      setSaving(false)
    }
  }

  const handleAssign = async (taskId: string, assigneeId: string) => {
    if (!assigneeId) return
    setSaving(true)
    setError(null)
    try {
      await assignTask(taskId, assigneeId)
      await loadTasks()
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to assign task'))
    } finally {
      setSaving(false)
    }
  }

  const handleUnassign = async (taskId: string) => {
    setSaving(true)
    setError(null)
    try {
      await unassignTask(taskId)
      await loadTasks()
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to unassign task'))
    } finally {
      setSaving(false)
    }
  }

  const handleAdvanceStatus = async (task: Task) => {
    const next = NEXT_STATUS[task.status as TaskStatus]
    if (!next) return
    setSaving(true)
    setError(null)
    try {
      await updateTaskStatus(task.id, next)
      await loadTasks()
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to update status'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Tasks</h2>
      </div>

      <section className="panel">
        <h3>Create Task</h3>
        <div className="tasks-create-grid">
          <select
            value={newTaskProjectId}
            onChange={e => setNewTaskProjectId(e.target.value)}
          >
            <option value="">Select Project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="Task title"
          />
          <input
            value={newTaskDescription}
            onChange={e => setNewTaskDescription(e.target.value)}
            placeholder="Task description (optional)"
          />
          <button
            className="primary"
            onClick={handleCreateTask}
            disabled={saving || !newTaskProjectId || !newTaskTitle.trim()}
          >
            {saving ? 'Saving...' : 'Create Task'}
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="tasks-filters">
          <select
            value={scope}
            onChange={e => setScope(e.target.value as ViewScope)}
          >
            <option value="mine">My Tasks</option>
            <option value="project">Project Tasks</option>
          </select>

          {scope === 'project' && (
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
            >
              <option value="">Select Project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={status}
            onChange={e => setStatus(e.target.value as StatusFilter)}
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>

        {error && <p className="form-error">{error}</p>}
        {loading && <p>Loading tasks...</p>}
        {!loading && tasks.length === 0 && <p>No tasks found for this view.</p>}

        <div className="list">
          {tasks.map(task => {
            const assigneeName = task.assignee
              ? task.assignee.name || task.assignee.email
              : task.assigneeId
                ? userNameMap.get(task.assigneeId) || task.assigneeId
                : 'Unassigned'
            const nextStatus = NEXT_STATUS[task.status as TaskStatus]

            return (
              <div key={task.id} className="list-item tasks-item">
                <div className="list-main">
                  <div className="list-title">{task.title}</div>
                  {task.description && (
                    <div className="list-subtle">{task.description}</div>
                  )}
                  <div className="tasks-meta">
                    <span className="badge">{task.status}</span>
                    <span>Assignee: {assigneeName}</span>
                    <span>
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="list-actions tasks-actions">
                  {canManageAssignments && (
                    <>
                      <select
                        defaultValue=""
                        onChange={e => {
                          handleAssign(task.id, e.target.value)
                          e.currentTarget.value = ''
                        }}
                        disabled={saving}
                      >
                        <option value="" disabled>
                          Assign to...
                        </option>
                        {orgUsers.map(u => (
                          <option key={u.user.id} value={u.user.id}>
                            {u.user.name || u.user.email}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleUnassign(task.id)}
                        disabled={saving || !task.assigneeId}
                      >
                        Unassign
                      </button>
                    </>
                  )}

                  <button
                    className="primary"
                    onClick={() => handleAdvanceStatus(task)}
                    disabled={saving || !nextStatus}
                  >
                    {nextStatus ? `Move to ${nextStatus}` : 'Completed'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Tasks
