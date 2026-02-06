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
    <div>
      <h1>Users</h1>

      <h3>Add User</h3>
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
        Add
      </button>

      <hr />

      <h3>Organization Members</h3>
      <ul>
  {users.map(u => (
    <li key={u.user.id}>
      {u.user.email} — <strong>{u.role}</strong>

      {u.role !== 'OWNER' && (
        <>
          <select
            value={u.role}
            onChange={e =>
              changeUserRole(u.user.id, e.target.value).then(loadUsers)
            }
          >
            <option value="MEMBER">MEMBER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button
            onClick={() =>
              removeUser(u.user.id).then(loadUsers)
            }
          >
            Remove
          </button>
        </>
      )}
    </li>
  ))}
</ul>

    </div>
  )
}

// export default Users

// import { useEffect, useState } from 'react'
// import { useAuth } from '../auth/useAuth'
// import {
//   getUsers,
//   addUser,
//   changeUserRole,
//   removeUser,
// } from '../api/users.api'

// interface OrgUser {
//   role: 'OWNER' | 'ADMIN' | 'MEMBER'
//   user: {
//     id: string
//     email: string
//     name?: string
//   }
// }

// const Users = () => {
//   const { user, isLoading } = useAuth()

//   const [users, setUsers] = useState<OrgUser[]>([])
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [name, setName] = useState('')
//   const [loading, setLoading] = useState(false)

//   const loadUsers = async () => {
//     const data = await getUsers()
//     setUsers(data)
//   }

//   useEffect(() => {
//     if (isLoading || !user) return
//     loadUsers()
//   }, [isLoading, user])

//   const handleAdd = async () => {
//     setLoading(true)
//     try {
//       await addUser(email, password, name)
//       setEmail('')
//       setPassword('')
//       setName('')
//       await loadUsers()
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (isLoading) return <div>Loading…</div>

//   return (
//     <div>
//       <h1>Users</h1>

//       <h3>Add User</h3>
//       <input
//         placeholder="Email"
//         value={email}
//         onChange={e => setEmail(e.target.value)}
//       />
//       <input
//         placeholder="Name"
//         value={name}
//         onChange={e => setName(e.target.value)}
//       />
//       <input
//         placeholder="Temp Password"
//         value={password}
//         onChange={e => setPassword(e.target.value)}
//         type="password"
//       />
//       <button onClick={handleAdd} disabled={loading}>
//         Add
//       </button>

//       <hr />

//       <h3>Organization Members</h3>
//       <ul>
//         {users.map(u => (
//           <li key={u.user.id}>
//             {u.user.email} — <strong>{u.role}</strong>

//             {u.role !== 'OWNER' && (
//               <>
//                 <select
//                   value={u.role}
//                   onChange={e =>
//                     changeUserRole(u.user.id, e.target.value as OrgUser['role'])
//                       .then(loadUsers)
//                   }
//                 >
//                   <option value="MEMBER">MEMBER</option>
//                   <option value="ADMIN">ADMIN</option>
//                 </select>

//                 <button onClick={() => removeUser(u.user.id).then(loadUsers)}>
//                   Remove
//                 </button>
//               </>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }

export default Users
