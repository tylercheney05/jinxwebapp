import React from "react"
import { useSelector } from "react-redux"
import { RootState } from "store"
import NotAllowed from "components/NotAllowed"
import { LoadingIcon } from "components/Icons"

interface Props {
  children: React.ReactNode
}

const StaffRoute = ({ children }: Props) => {
  const { user } = useSelector((state: RootState) => state.user)

  return <>{!user ? <LoadingIcon /> : !user?.is_staff ? <NotAllowed /> : children}</>
}

export default StaffRoute
