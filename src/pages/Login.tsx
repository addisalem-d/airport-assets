
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext' // 1. Import your hook
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth() // 2. Access the login function from context
  
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('Aiport123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Assuming your authService.login returns the user data or token
      const result = await authService.login(username, password)
            console.log('Login successful:', result)

      // Update the Global Auth State
      // If result contains a user object or name, pass it here
      login(username) 

      //  I Use React Router to navigate instead of window.location
      navigate('/dashboard', { replace: true })
      
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMessage = err.response?.data?.detail || 
                          err.message || 
                          'Login failed. Please try again.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Airport Assets Management </h1>
        <p>Sign in to your account</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Username</label>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className={styles.demo}>Demo credentials: admin / admin123</p>
      </div>
    </div>
  )
}