import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { ReviewContext } from '../App'

function EditReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { reviews, setReviews } = useContext(ReviewContext)
  
  const [formData, setFormData] = useState({
    album: '',
    artist: '',
    genre: '',
    rating: '5',
    mood: '',
    reflection: ''
  })

  useEffect(() => {
    const review = reviews.find(r => r.id === id)
    if (review) {
      setFormData({
        ...review,
        rating: review.rating.toString()
      })
    } else {
      navigate('/dashboard')
    }
  }, [id, reviews, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    
    const updatedReviews = reviews.map(review => 
      review.id === id 
        ? { 
            ...review, 
            ...formData, 
            rating: parseInt(formData.rating),
            date: new Date().toISOString().split('T')[0] // Update review date
          }
        : review
    )
    
    setReviews(updatedReviews)
    navigate(`/review/${id}`)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setReviews(reviews.filter(r => r.id !== id))
      navigate('/dashboard')
    }
  }

  if (!formData.album) return <main>Loading...</main>

  // Generate unique IDs for form fields
  const generateId = (field) => `edit-${field}-${Math.random().toString(36).substr(2, 6)}`

  return (
    <>
      <NavBar backLink={`/review/${id}`} backText="Back to Review" />
      
      <main className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Edit Review</h2>
  
        <form onSubmit={handleUpdate}>
          <div>
            <label htmlFor={generateId('album')}>Album Title *</label>
            <input
              id={generateId('album')}
              name="album"
              value={formData.album}
              onChange={handleChange}
              required
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
            />
          </div>
  
          <div>
            <label htmlFor={generateId('genre')}>Genre</label>
            <select
              id={generateId('genre')}
              name="genre"
              value={formData.genre}
              onChange={handleChange}
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
            />
          </div>
  
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit">Update Review</button>
            <button type="button" onClick={handleDelete} style={{ background: '#dc3545' }}>Delete Review</button>
          </div>
        </form>
      </main>
    </>
  )
}

export default EditReview