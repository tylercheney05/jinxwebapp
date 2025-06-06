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
    <Layout title="Jinx | Make Orders" content="Make Orders Page" backgroundColor="secondary">
      <LocationNeededRoute>
        {loading || user == null ? (
          <LoadingIcon />
        ) : (
          <div className="flex flex-col items-center">
            <div className="mt-4 font-bold text-2xl">Backup Page</div>
            <div className="mt-4 font-bold text-lg">Please make orders from top to bottom</div>
            <PendingOrders ordersQueued={data} client={null} showRecipe={true} />
          </div>
        )}
      </LocationNeededRoute>
    </Layout>
  )
}

export default MakeOrdersBackupPage
