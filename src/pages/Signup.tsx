import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../auth/AuthContext'
import { signup } from '../api/auth.api'

const Signup = () => {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!auth) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signup(email, password, name)
      await auth.login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-field">
          <label>Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="primary" disabled={loading}>
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>

      <p className="form-hint">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}

export default Signup
