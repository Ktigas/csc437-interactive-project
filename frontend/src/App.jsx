import { useState, createContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Review from './pages/Review'
import AddReview from './pages/AddReview'
import EditReview from './pages/EditReview'
import Profile from './pages/Profile'

export const ThemeContext = createContext()
export const ReviewContext = createContext()

// Mock data - will be shared across components
const initialReviews = [
  {
    id: '1',
    album: 'Blonde',
    artist: 'Frank Ocean',
    genre: 'R&B',
    mood: 'Reflective',
    rating: 5,
    reflection: 'A deeply introspective album that captures emotion and nostalgia. Each track flows seamlessly into the next, creating an immersive listening experience that rewards repeated listens.',
    coverArt: 'https://placehold.co/400x400/1f2329/9aa0a6?text=Blonde',
    date: '2024-01-15'
  },
  {
    id: '2',
    album: 'Ctrl',
    artist: 'SZA',
    genre: 'R&B',
    mood: 'Calm',
    rating: 4,
    reflection: 'SZA\'s debut album is a masterpiece of modern R&B. Vulnerable lyrics combined with innovative production make this a standout release.',
    coverArt: 'https://placehold.co/400x400/1f2329/9aa0a6?text=Ctrl',
    date: '2024-01-20'
  },
  {
    id: '3',
    album: 'Discovery',
    artist: 'Daft Punk',
    genre: 'Electronic',
    mood: 'Energetic',
    rating: 5,
    reflection: 'A groundbreaking electronic album that blends house, disco, and rock influences. Every track is a journey.',
    coverArt: 'https://placehold.co/400x400/1f2329/9aa0a6?text=Discovery',
    date: '2024-01-25'
  }
]

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [reviews, setReviews] = useState(initialReviews)
  const [user, setUser] = useState(null)

  // Set initial theme
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <ReviewContext.Provider value={{ reviews, setReviews }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login setUser={setUser} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
            <Route path="/review/:id" element={user ? <Review /> : <Navigate to="/" />} />
            <Route path="/add-review" element={user ? <AddReview /> : <Navigate to="/" />} />
            <Route path="/edit-review/:id" element={user ? <EditReview /> : <Navigate to="/" />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ReviewContext.Provider>
    </ThemeContext.Provider>
  )
}

export default App