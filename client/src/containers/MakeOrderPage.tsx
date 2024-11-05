import { useSelector } from "react-redux"
import { RootState } from "store"
import Layout from "components/Layout"
import LocationNeededRoute from "components/routes/LocationNeededRoute"
import { LoadingIcon } from "components/Icons"
import MakeOrder from "components/orders/MakeOrder"

const MakeOrderPage = () => {
  const { user, loading } = useSelector((state: RootState) => state.user)

  return (
    <Layout title="Jinx | Make Orders" content="Make Orders Page">
      <LocationNeededRoute>{loading || user == null ? <LoadingIcon /> : <MakeOrder />}</LocationNeededRoute>
    </Layout>
  )
}

export default MakeOrderPage
