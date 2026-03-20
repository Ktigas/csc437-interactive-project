import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { ReviewContext } from '../App'
import { reviewsAPI } from '../utils/api'

function EditReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { reviews, setReviews } = useContext(ReviewContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    album: '',
    artist: '',
    genre: '',
    rating: '5',
    mood: '',
    reflection: '',
    coverArt: ''
  })

  useEffect(() => {
    fetchReview()
  }, [id])

  const fetchReview = async () => {
    try {
      const review = await reviewsAPI.getOne(id)
      if (review) {
        setFormData({
          ...review,
          rating: review.rating.toString()
        })
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      const review = reviews.find(r => r._id === id || r.id === id)
      if (review) {
        setFormData({
          ...review,
          rating: review.rating.toString()
        })
      } else {
        navigate('/dashboard')
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const updatedReview = await reviewsAPI.update(id, {
        ...formData,
        rating: parseInt(formData.rating)
      })
      
      setReviews(reviews.map(review => 
        (review._id === id || review.id === id) ? updatedReview : review
      ))
      navigate(`/review/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setLoading(true)
      try {
        await reviewsAPI.delete(id)
        setReviews(reviews.filter(r => r._id !== id && r.id !== id))
        navigate('/dashboard')
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }
  }

  if (!formData.album) return <main>Loading...</main>

  const generateId = (field) => `edit-${field}-${Math.random().toString(36).substr(2, 6)}`

  return (
    <>
      <NavBar backLink={`/review/${id}`} backText="Back to Review" />
      
      <main className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Edit Review</h2>
  
        {error && <div className="error">{error}</div>}
  
        <form onSubmit={handleUpdate}>
          <div>
            <label htmlFor={generateId('album')}>Album Title *</label>
            <input
              id={generateId('album')}
              name="album"
              value={formData.album}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
  
          <div>
            <label htmlFor={generateId('artist')}>Artist *</label>
            <input
              id={generateId('artist')}
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
  
          <div>
            <label htmlFor={generateId('coverArt')}>Cover Image URL</label>
            <input
              id={generateId('coverArt')}
              name="coverArt"
              type="url"
              value={formData.coverArt}
              onChange={handleChange}
              placeholder="https://example.com/album-cover.jpg"
              disabled={loading}
            />
            {formData.coverArt && (
              <div style={{ marginTop: '0.5rem' }}>
                <img 
                  src={formData.coverArt} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', borderRadius: '8px' }}
                />
              </div>
            )}
          </div>
  
          <div>
            <label htmlFor={generateId('genre')}>Genre</label>
            <select
              id={generateId('genre')}
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              disabled={loading}
            >
              <option>Pop</option>
              <option>R&B</option>
              <option>Electronic</option>
              <option>Rock</option>
              <option>Hip-Hop</option>
              <option>Jazz</option>
              <option>Classical</option>
            </select>
          </div>
  
          <div>
            <label htmlFor={generateId('rating')}>Rating (1-5)</label>
            <select
              id={generateId('rating')}
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              disabled={loading}
            >
              {[5,4,3,2,1].map(num => (
                <option key={num} value={num}>{num} star{num !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
  
          <div>
            <label htmlFor={generateId('mood')}>Mood</label>
            <select
              id={generateId('mood')}
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              disabled={loading}
            >
              <option>Happy</option>
              <option>Reflective</option>
              <option>Energetic</option>
              <option>Calm</option>
              <option>Melancholic</option>
              <option>Nostalgic</option>
              <option>Upbeat</option>
            </select>
          </div>
  
          <div>
            <label htmlFor={generateId('reflection')}>Reflection</label>
            <textarea
              id={generateId('reflection')}
              name="reflection"
              rows="6"
              value={formData.reflection}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
              disabled={loading}
            />
          </div>
  
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Review'}
            </button>
            <button type="button" onClick={handleDelete} style={{ background: '#dc3545' }} disabled={loading}>
              Delete Review
            </button>
          </div>
        </form>
      </main>
    </>
  )
}

export default EditReview