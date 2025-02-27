import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "store"
import NotAllowed from "components/NotAllowed"
import PageLoading from "../PageLoading"

interface Props {
  children: React.ReactNode
}

const StaffRoute = ({ children }: Props) => {
  const { user } = useSelector((state: RootState) => state.user)

  return <>{!user ? <PageLoading /> : !user?.is_staff ? <NotAllowed /> : children}</>
}

export default StaffRoute
