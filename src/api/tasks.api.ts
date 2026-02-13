import api from './axios'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export const getMyTasks = async (status?: TaskStatus) => {
  const res = await api.get('/tasks/mine', {
    params: status ? { status } : undefined,
  })
  return res.data
}

export const getTasks = async (projectId: string) => {
  const res = await api.get('/tasks', {
    params: { projectId },
  })
  return res.data
}

export const createTask = async (
  projectId: string,
  title: string,
  description?: string
) => {
  const res = await api.post('/tasks', {
    projectId,
    title,
    description,
  })
  return res.data
}

export const assignTask = async (taskId: string, assigneeId: string) => {
  const res = await api.post('/tasks/assign', {
    taskId,
    assigneeId,
  })
  return res.data
}

export const unassignTask = async (taskId: string) => {
  const res = await api.post('/tasks/unassign', {
    taskId,
  })
  return res.data
}

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus
) => {
  const res = await api.patch(`/tasks/${taskId}/status`, {
    status,
  })
  return res.data
}
