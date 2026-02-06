import api from './axios'

export const getMyTasks = async () => {
  const res = await api.get('/tasks/mine')
  return res.data
}
