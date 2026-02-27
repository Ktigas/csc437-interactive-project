import { Link, useNavigate } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle'

function NavBar({ title, backLink, backText, showEdit, editLink, rightContent }) {
  const navigate = useNavigate()
  
  return (
    <header>
      <nav>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {backLink && (
            <button 
              onClick={() => navigate(backLink)} 
              style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}
              aria-label={`Go back to ${backText || 'previous page'}`}
            >
              ← {backText || 'Back'}
            </button>
          )}
          {title && <strong style={{ fontSize: '1.2rem' }}>{title}</strong>}
        </div>
        
        <div className="nav-links">
          {rightContent}
          {showEdit && <Link to={editLink}>Edit Review</Link>}
          <DarkModeToggle />
        </div>
      </nav>
    </header>
  )
}

export default NavBar