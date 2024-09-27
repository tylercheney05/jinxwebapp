import Layout from "components/Layout"
import LocationNeededRoute from "components/routes/LocationNeededRoute"
import { useSelector } from "react-redux"
import { RootState } from "store"
import { LoadingIcon } from "components/Icons"
import PendingOrders from "components/orders/PendingOrders"
import { useEffect } from "react"

const MakeOrdersPage = () => {
  const { user, loading } = useSelector((state: RootState) => state.user)

  return (
    <Layout title="Jinx | Make Orders" content="Make Orders Page">
      <LocationNeededRoute>{loading || user == null ? <LoadingIcon /> : <PendingOrders />}</LocationNeededRoute>
    </Layout>
  )
}

export default MakeOrdersPage
