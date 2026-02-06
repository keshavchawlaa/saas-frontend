import api from './axios'

export const getUsers = async () => {
  const res = await api.get('/auth/users')
  return res.data
}

export const addUser = async (
  email: string,
  password: string,
  name?: string
) => {
  const res = await api.post('/auth/add-user', {
    email,
    password,
    name,
  })
  return res.data
}
export const changeUserRole = async (userId: string, role: string) => {
  const res = await api.patch(`/auth/users/${userId}/role`, { role })
  return res.data
}

export const removeUser = async (userId: string) => {
  const res = await api.delete(`/auth/users/${userId}`)
  return res.data
}

