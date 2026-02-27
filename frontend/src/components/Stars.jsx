function Stars({ rating }) {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    
    // Generate unique ID for accessibility
    const starsId = `stars-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div 
        className="stars" 
        aria-labelledby={starsId}
        role="img"
      >
        <span id={starsId} className="sr-only">
          {rating} out of 5 stars
        </span>
        <span aria-hidden="true">
          {'★'.repeat(fullStars)}
          {hasHalfStar && '½'}
          {'☆'.repeat(emptyStars)}
        </span>
      </div>
    )
  }
  
  export default Stars