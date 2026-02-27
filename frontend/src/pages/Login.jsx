import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'

function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Accept any credentials for MVP
    if (email && password) {
      setUser({ 
        email, 
        name: email.split('@')[0] || 'Music Listener',
        memberSince: 'January 2024'
      })
      navigate('/dashboard')
    } else {
      setError('Please enter both email and password')
    }
  }

  // Generate stable IDs for form inputs
  const emailId = 'login-email'
  const passwordId = 'login-password'

  return (
    <>
      <NavBar title="Trackd" />
      <main className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Trackd</h1>
        <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '2rem' }}>
          Your personal music review journal.
        </p>

        <form onSubmit={handleLogin} noValidate>
          <div>
            <label htmlFor={emailId}>Email</label>
            <input
              id={emailId}
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? 'login-error' : undefined}
              required
            />
          </div>

          <div>
            <label htmlFor={passwordId}>Password</label>
            <input
              id={passwordId}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? 'login-error' : undefined}
              required
            />
          </div>

          {error && <p id="login-error" className="error" role="alert">{error}</p>}

          <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
            Log In
          </button>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center', marginTop: '1rem' }}>
            Demo: Any email and password work
          </p>
        </form>
      </main>
    </>
  )
}

export default Login