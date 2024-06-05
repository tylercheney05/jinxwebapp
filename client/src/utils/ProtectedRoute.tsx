import React from "react"
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { RootState } from "store"

interface Props {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.user)
  let location = useLocation()

  return <>{isAuthenticated === false ? <Navigate to="/login" state={{ from: location }} replace /> : children}</>
}

export default ProtectedRoute
