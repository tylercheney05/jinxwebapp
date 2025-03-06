import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { checkAuth } from "features/user"

import HomePage from "containers/HomePage"
import LoginPage from "containers/LoginPage"
import RegisterPage from "containers/RegisterPage"
import TakeOrderPage from "containers/TakeOrderPage"
import "./App.css"
import AdminPage from "containers/AdminPage"

import ProtectedRoute from "components/routes/ProtectedRoute"
import AdminRoute from "components/routes/AdminRoute"
import StaffRoute from "./components/routes/StaffRoute"
import MakeOrdersPage from "./containers/MakeOrdersPage"
import MakeOrderPage from "./containers/MakeOrderPage"
import CheckoutPage from "./containers/CheckoutPage"
import MakeOrdersBackupPage from "./containers/MakeOrdersBackupPage"

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
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        <Route
          path="/take-order"
          element={
            <ProtectedRoute>
              <StaffRoute>
                <TakeOrderPage />
              </StaffRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/make-orders"
          element={
            <ProtectedRoute>
              <StaffRoute>
                <MakeOrdersPage />
              </StaffRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/make-orders/backup"
          element={
            <ProtectedRoute>
              <StaffRoute>
                <MakeOrdersBackupPage />
              </StaffRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/make-orders/:id"
          element={
            <ProtectedRoute>
              <StaffRoute>
                <MakeOrderPage />
              </StaffRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout-order/:id"
          element={
            <ProtectedRoute>
              <StaffRoute>
                <CheckoutPage />
              </StaffRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
