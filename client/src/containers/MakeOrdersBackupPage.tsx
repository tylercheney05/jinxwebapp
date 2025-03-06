import { useSelector } from "react-redux"
import { RootState } from "store"
import Layout from "components/Layout"
import LocationNeededRoute from "components/routes/LocationNeededRoute"
import { LoadingIcon } from "components/Icons"
import PendingOrders from "components/orders/PendingOrders"
import { useGetPendingOrdersQuery } from "services/orders"

const MakeOrdersBackupPage = () => {
  const { locationId } = useSelector((state: RootState) => state.location)
  const { user, loading } = useSelector((state: RootState) => state.user)
  const { data } = useGetPendingOrdersQuery(
    {
      location_id: locationId,
    },
    { refetchOnMountOrArgChange: true }
  )

  return (
    <Layout title="Jinx | Make Orders" content="Make Orders Page">
      <LocationNeededRoute>
        {loading || user == null ? <LoadingIcon /> : <PendingOrders ordersQueued={data} client={null} />}
      </LocationNeededRoute>
    </Layout>
  )
}

export default MakeOrdersBackupPage
