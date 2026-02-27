import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import ReviewCard from '../components/ReviewCard'
import Stars from '../components/Stars'
import { ReviewContext } from '../App'

function Dashboard({ user }) {
  const { reviews } = useContext(ReviewContext)
  const [filterRating, setFilterRating] = useState('all')
  const [filterGenre, setFilterGenre] = useState('all')
  const [appliedFilters, setAppliedFilters] = useState({ rating: 'all', genre: 'all' })

  const applyFilters = () => {
    setAppliedFilters({ rating: filterRating, genre: filterGenre })
  }

  // Filter reviews based on applied filters
  const filteredReviews = reviews.filter(review => {
    if (appliedFilters.rating === '4-5' && review.rating < 4) return false
    if (appliedFilters.rating === '3' && review.rating !== 3) return false
    if (appliedFilters.rating === '1-2' && review.rating > 2) return false
    if (appliedFilters.genre !== 'all' && review.genre !== appliedFilters.genre) return false
    return true
  })

  // Calculate average rating of filtered reviews
  const avgRating = filteredReviews.length > 0 
    ? filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length 
    : 0

  // Get unique genres for filter dropdown
  const genres = ['all', ...new Set(reviews.map(r => r.genre))]

  // Generate stable IDs
  const ratingFilterId = 'rating-filter'
  const genreFilterId = 'genre-filter'

  return (
    <>
      <NavBar 
        title="Trackd"
        rightContent={
          <>
            <Link to="/add-review">Add Review</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/">Logout</Link>
          </>
        }
      />
      
      <main>
        <h2>Welcome back, {user?.name || 'User'}!</h2>
        
        <section className="card">
          <h3>Filter Reviews</h3>
          <div className="grid grid-3">
            <div>
              <label htmlFor={ratingFilterId}>Star Rating</label>
              <select 
                id={ratingFilterId}
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                aria-label="Filter by rating"
              >
                <option value="all">All Ratings</option>
                <option value="4-5">4-5 stars</option>
                <option value="3">3 stars</option>
                <option value="1-2">1-2 stars</option>
              </select>
            </div>
  
            <div>
              <label htmlFor={genreFilterId}>Genre</label>
              <select 
                id={genreFilterId}
                value={filterGenre}
                onChange={(e) => setFilterGenre(e.target.value)}
                aria-label="Filter by genre"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>
  
            <div style={{ alignSelf: 'end' }}>
              <button type="button" onClick={applyFilters}>Apply Filters</button>
            </div>
          </div>
        </section>
  
        {filteredReviews.length > 0 && (
          <section className="card">
            <strong>Average Rating (Filtered)</strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Stars rating={avgRating} />
              <span>({avgRating.toFixed(1)} stars)</span>
            </div>
          </section>
        )}
  
        <section className="grid grid-3">
          {filteredReviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </section>
        
        {filteredReviews.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
            No reviews match the selected filters.
          </p>
        )}

        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '2rem' }}>
          Showing {filteredReviews.length} of {reviews.length} reviews
        </p>
      </main>
    </>
  )
}

export default Dashboard