import { Link } from 'react-router-dom'
import Stars from './Stars'

function ReviewCard({ review }) {
  const { id, album, artist, genre, mood, rating, coverArt } = review
  
  return (
    <Link to={`/review/${id}`} className="card review" aria-label={`View review for ${album} by ${artist}`}>
      <img 
        src={coverArt || "https://placehold.co/400x400/1f2329/9aa0a6?text=Album+Cover"} 
        alt={`${album} album cover`}
        loading="lazy"
      />
      <h3 style={{ margin: '0.5rem 0 0.25rem' }}>{album}</h3>
      <p style={{ color: 'var(--muted)', margin: '0 0 0.5rem' }}>{artist}</p>
      <Stars rating={rating} />
      <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
        <span>{genre}</span>
        {mood && <span> • {mood}</span>}
      </div>
    </Link>
  )
}

export default ReviewCard