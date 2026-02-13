import { useEffect, useState } from 'react'
import {
  getUsers,
  addUser,
  changeUserRole,
  removeUser,
} from '../api/users.api'

interface OrgUser {
  role: string
  user: {
    id: string
    email: string
    name?: string
  }
}

const Users = () => {
  const [users, setUsers] = useState<OrgUser[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const loadUsers = async () => {
    const data = await getUsers()
    setUsers(data)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleAdd = async () => {
    if (!email || !password) return
    setLoading(true)
    try {
      await addUser(email, password, name)
      setEmail('')
      setPassword('')
      setName('')
      await loadUsers()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Users</h1>
      </div>

      <section className="panel">
        <h3>Add User</h3>
        <div className="grid-form">
          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            placeholder="Temp Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
          <button className="primary" onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </section>

      <section className="panel">
        <h3>Organization Members</h3>
        <div className="list">
          {users.map(u => (
            <div key={u.user.id} className="list-item">
              <div className="list-main">
                <div className="list-title">
                  {u.user.name || u.user.email}
                </div>
                <div className="list-subtle">{u.user.email}</div>
              </div>
              <div className="list-actions">
                <span className="badge">{u.role}</span>
                {u.role !== 'OWNER' && (
                  <>
                    <select
                      value={u.role}
                      onChange={e =>
                        changeUserRole(u.user.id, e.target.value).then(
                          loadUsers
                        )
                      }
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>

                    <button
                      className="danger"
                      onClick={() => removeUser(u.user.id).then(loadUsers)}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Users
