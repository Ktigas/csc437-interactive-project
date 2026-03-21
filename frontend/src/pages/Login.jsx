import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { authAPI, setAuthToken } from '../utils/api'
import { AuthContext } from '../App'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const data = await authAPI.login({ email, password });
      setAuthToken(data.token);
      setUser(data.user);
      // Store user data in localStorage
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('memberSince', data.user.memberSince);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const name = email.split('@')[0];
    
    try {
      const data = await authAPI.register({ email, password, name });
      setAuthToken(data.token);
      setUser(data.user);
      // Store user data in localStorage
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('memberSince', data.user.memberSince);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const emailId = 'login-email'
  const passwordId = 'login-password'

  return (
    <>
      <NavBar title="Trackd 🎶" />
      <main className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Trackd 🎶</h1>
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {error && <p id="login-error" className="error" role="alert">{error}</p>}

          <button type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          
          <button 
            type="button" 
            onClick={handleRegister} 
            style={{ width: '100%', marginTop: '0.5rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </main>
    </>
  )
}

export default Login