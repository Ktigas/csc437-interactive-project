import { useState, useEffect, createContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Review from './pages/Review'
import AddReview from './pages/AddReview'
import EditReview from './pages/EditReview'
import Profile from './pages/Profile'
import { getAuthToken, setAuthToken } from './utils/api'

export const ThemeContext = createContext()
export const ReviewContext = createContext()
export const AuthContext = createContext()

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [reviews, setReviews] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchUserFromToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserFromToken = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setAuthToken(null);
      }
    } catch (err) {
      console.error("Token validation failed:", err);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <AuthContext.Provider value={{ user, setUser }}>
        <ReviewContext.Provider value={{ reviews, setReviews }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
              <Route path="/review/:id" element={user ? <Review /> : <Navigate to="/" />} />
              <Route path="/add-review" element={user ? <AddReview /> : <Navigate to="/" />} />
              <Route path="/edit-review/:id" element={user ? <EditReview /> : <Navigate to="/" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </ReviewContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  )
}

export default App