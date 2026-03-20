import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { ReviewContext } from '../App'
import { reviewsAPI } from '../utils/api'

function AddReview() {
  const navigate = useNavigate()
  const { setReviews } = useContext(ReviewContext)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    album: '',
    artist: '',
    genre: 'Pop',
    rating: '5',
    mood: 'Happy',
    reflection: '',
    coverArt: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const newReview = {
        ...formData,
        rating: parseInt(formData.rating),
        coverArt: formData.coverArt || `https://placehold.co/400x400/1f2329/9aa0a6?text=${encodeURIComponent(formData.album)}`
      }
      
      const savedReview = await reviewsAPI.create(newReview)
      setReviews(prev => [savedReview, ...prev])
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateId = (field) => `add-${field}-${Math.random().toString(36).substr(2, 6)}`

  return (
    <>
      <NavBar backLink="/dashboard" backText="Dashboard" />
      
      <main className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Add New Review</h2>
  
        {error && <div className="error">{error}</div>}
  
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor={generateId('album')}>Album Title *</label>
            <input
              id={generateId('album')}
              name="album"
              value={formData.album}
              onChange={handleChange}
              required
              placeholder="e.g., Blonde"
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
              placeholder="e.g., Frank Ocean"
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
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '-0.5rem' }}>
              Leave blank to use placeholder
            </p>
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
              placeholder="Write your thoughts about this album..."
              style={{ resize: 'vertical' }}
              disabled={loading}
            />
          </div>
  
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Review'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  )
}

export default AddReview