import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Stars from '../components/Stars'
import { ReviewContext } from '../App'

function Review() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { reviews, setReviews } = useContext(ReviewContext)
  const [review, setReview] = useState(null)

  useEffect(() => {
    const found = reviews.find(r => r.id === id)
    if (found) {
      setReview(found)
    } else {
      navigate('/dashboard')
    }
  }, [id, reviews, navigate])

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(r => r.id !== id))
      navigate('/dashboard')
    }
  }

  if (!review) return <main>Loading...</main>

  return (
    <>
      <NavBar 
        backLink="/dashboard"
        backText="Dashboard"
        showEdit={true}
        editLink={`/edit-review/${id}`}
      />
      
      <main className="card">
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <img 
            src={review.coverArt} 
            alt={`${review.album} album cover`}
            style={{ width: '200px', height: '200px', borderRadius: '8px', objectFit: 'cover' }}
          />
          
          <div style={{ flex: 1 }}>
            <h2>{review.album}</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--muted)', marginBottom: '1rem' }}>
              {review.artist}
            </p>
            <Stars rating={review.rating} />
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--bg)', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                {review.genre}
              </span>
              {review.mood && (
                <span style={{ background: 'var(--bg)', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                  {review.mood}
                </span>
              )}
            </div>
            <p style={{ marginTop: '1rem', color: 'var(--muted)' }}>
              Reviewed on {new Date(review.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Reflection</h3>
          <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{review.reflection}</p>
        </div>
        
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(`/edit-review/${id}`)}>Edit Review</button>
          <button onClick={handleDelete} style={{ background: '#dc3545' }}>Delete Review</button>
        </div>
      </main>
    </>
  )
}

export default Review