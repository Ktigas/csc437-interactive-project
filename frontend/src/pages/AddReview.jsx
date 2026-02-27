import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { ReviewContext } from '../App'

function AddReview() {
  const navigate = useNavigate()
  const { reviews, setReviews } = useContext(ReviewContext)
  
  const [formData, setFormData] = useState({
    album: '',
    artist: '',
    genre: 'Pop',
    rating: '5',
    mood: 'Happy',
    reflection: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Create new review with unique ID
    const newReview = {
      ...formData,
      id: Date.now().toString(),
      rating: parseInt(formData.rating),
      coverArt: `https://placehold.co/400x400/1f2329/9aa0a6?text=${formData.album.replace(/\s+/g, '+')}`,
      date: new Date().toISOString().split('T')[0]
    }
    
    setReviews([newReview, ...reviews])
    navigate('/dashboard')
  }

  // Generate unique IDs for form fields
  const generateId = (field) => `add-${field}-${Math.random().toString(36).substr(2, 6)}`

  return (
    <>
      <NavBar backLink="/dashboard" backText="Dashboard" />
      
      <main className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Add New Review</h2>
  
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
              placeholder="Write your thoughts about this album..."
              style={{ resize: 'vertical' }}
            />
          </div>
  
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit">Save Review</button>
            <button type="button" onClick={() => navigate('/dashboard')} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </>
  )
}

export default AddReview