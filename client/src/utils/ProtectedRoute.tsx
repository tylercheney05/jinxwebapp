import React from "react"
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { RootState } from "store"

interface Props {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: Props) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user)
  let location = useLocation()

  return <>{isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />}</>
}

export default ProtectedRoute
