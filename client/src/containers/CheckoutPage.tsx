import Layout from "components/Layout"
import LocationNeededRoute from "components/routes/LocationNeededRoute"
import { useSelector } from "react-redux"
import { RootState } from "store"
import { LoadingIcon } from "components/Icons"
import CheckoutOrderForm from "components/orders/CheckoutOrderForm"
import { useParams } from "react-router-dom"
import { useGetOrderDetailQuery } from "services/orders"

const CheckoutPage = () => {
  const { user, loading } = useSelector((state: RootState) => state.user)
  const { id } = useParams<{ id: string }>()
  const { data } = useGetOrderDetailQuery({ id: id }, { refetchOnMountOrArgChange: true })

  return (
    <Layout title="Jinx | Make Orders" content="Make Orders Page" backgroundColor="white">
      <LocationNeededRoute>
        {loading || user == null || data === undefined ? <LoadingIcon /> : <CheckoutOrderForm order={data} />}
      </LocationNeededRoute>
    </Layout>
  )
}

export default CheckoutPage
