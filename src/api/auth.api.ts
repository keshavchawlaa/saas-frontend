import api from './axios'

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  })
  return response.data
}

export const signup = async (
  email: string,
  password: string,
  name?: string
) => {
  const response = await api.post('/auth/signup', {
    email,
    password,
    name,
  })
  return response.data
}

export const me = async () => {
  const res = await api.get('/auth/me')
  return res.data
}
