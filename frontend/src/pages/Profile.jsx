import { useState, useEffect, useContext } from 'react'
import NavBar from '../components/NavBar'
import Stars from '../components/Stars'
import { AuthContext } from '../App'
import { reviewsAPI } from '../utils/api'

function Profile() {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    favoriteGenre: null,
    reviewsThisMonth: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await reviewsAPI.getStats()
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <NavBar backLink="/dashboard" backText="Dashboard" />
        <main>
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading profile statistics...</div>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <NavBar backLink="/dashboard" backText="Dashboard" />
        <main>
          <div className="error" style={{ textAlign: 'center', padding: '2rem' }}>
            Error: {error}
            <button onClick={fetchStats} style={{ marginLeft: '1rem' }}>Retry</button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <NavBar backLink="/dashboard" backText="Dashboard" />
      
      <main>
        <h2>Your Profile</h2>
        
        <section className="card" style={{ marginBottom: '2rem' }}>
          <h3>Account Information</h3>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div>
              <p style={{ color: 'var(--muted)', marginBottom: '0.25rem' }}>Name</p>
              <p style={{ fontSize: '1.1rem' }}>{user?.name || 'Music Listener'}</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)', marginBottom: '0.25rem' }}>Email</p>
              <p style={{ fontSize: '1.1rem' }}>{user?.email || 'user@example.com'}</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)', marginBottom: '0.25rem' }}>Member since</p>
              <p style={{ fontSize: '1.1rem' }}>{user?.memberSince ? new Date(user.memberSince).toLocaleDateString() : 'January 2024'}</p>
            </div>
          </div>
        </section>
  
        <h2>Your Listening Summary</h2>
  
        <section className="grid grid-3">
          <div className="card">
            <h3>Total Reviews</h3>
            <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold' }}>{stats.totalReviews}</p>
            <p style={{ color: 'var(--muted)' }}>{stats.reviewsThisMonth} this month</p>
          </div>
  
          <div className="card">
            <h3>Favorite Genre</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0', fontWeight: 'bold' }}>{stats.favoriteGenre || 'N/A'}</p>
            {stats.favoriteGenre && stats.genreCounts && (
              <p style={{ color: 'var(--muted)' }}>{stats.genreCounts[stats.favoriteGenre]} reviews</p>
            )}
          </div>
  
          <div className="card">
            <h3>Average Rating</h3>
            <div style={{ margin: '0.5rem 0' }}>
              <Stars rating={stats.averageRating} />
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.averageRating.toFixed(1)}</p>
            <p style={{ color: 'var(--muted)' }}>out of 5 stars</p>
          </div>
        </section>

        <section className="card" style={{ marginTop: '2rem' }}>
          <h3>Activity Summary</h3>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            <div>
              <p style={{ color: 'var(--muted)' }}>Total Albums</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalReviews}</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)' }}>Unique Genres</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Object.keys(stats.genreCounts || {}).length}</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)' }}>This Month</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.reviewsThisMonth}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Profile