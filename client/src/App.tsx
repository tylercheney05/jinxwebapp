import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "containers/HomePage"
import LoginPage from "containers/LoginPage"
import RegisterPage from "containers/RegisterPage"
import DashboardPage from "containers/DashboardPage"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { checkAuth } from "features/user"
import "./App.css"
import ProtectedRoute from "utils/ProtectedRoute"

const App = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(checkAuth())
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
