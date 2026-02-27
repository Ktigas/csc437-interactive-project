import { useContext } from 'react'
import NavBar from '../components/NavBar'
import Stars from '../components/Stars'
import { ReviewContext } from '../App'

function Profile({ user }) {
  const { reviews } = useContext(ReviewContext)
  
  // Calculate user stats from actual reviews
  const totalReviews = reviews.length
  
  // Find most common genre
  const genreCounts = reviews.reduce((acc, review) => {
    acc[review.genre] = (acc[review.genre] || 0) + 1
    return acc
  }, {})
  
  const favoriteGenre = Object.keys(genreCounts).length > 0 
    ? Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b)
    : 'N/A'
  
  // Calculate average rating
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0

  // Calculate monthly activity
  const currentMonth = new Date().getMonth()
  const reviewsThisMonth = reviews.filter(r => new Date(r.date).getMonth() === currentMonth).length

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
              <p style={{ fontSize: '1.1rem' }}>{user?.memberSince || 'January 2024'}</p>
            </div>
          </div>
        </section>
  
        <h2>Your Listening Summary</h2>
  
        <section className="grid grid-3">
          <div className="card">
            <h3>Total Reviews</h3>
            <p style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 'bold' }}>{totalReviews}</p>
            <p style={{ color: 'var(--muted)' }}>{reviewsThisMonth} this month</p>
          </div>
  
          <div className="card">
            <h3>Favorite Genre</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0', fontWeight: 'bold' }}>{favoriteGenre}</p>
            {favoriteGenre !== 'N/A' && (
              <p style={{ color: 'var(--muted)' }}>{genreCounts[favoriteGenre]} reviews</p>
            )}
          </div>
  
          <div className="card">
            <h3>Average Rating</h3>
            <div style={{ margin: '0.5rem 0' }}>
              <Stars rating={averageRating} />
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{averageRating.toFixed(1)}</p>
            <p style={{ color: 'var(--muted)' }}>out of 5 stars</p>
          </div>
        </section>

        <section className="card" style={{ marginTop: '2rem' }}>
          <h3>Activity Summary</h3>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            <div>
              <p style={{ color: 'var(--muted)' }}>Total Albums</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalReviews}</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)' }}>Unique Genres</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Object.keys(genreCounts).length}</p>
            </div>
            <div>
              <p style={{ color: 'var(--muted)' }}>This Month</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{reviewsThisMonth}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Profile