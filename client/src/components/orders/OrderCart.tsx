import { useGetOrderItemListQuery } from "services/orders"
import { RootState } from "store"
import { useSelector } from "react-redux"
import OrderContentItems from "./OrderContentItems"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"

const OrderCart = () => {
  const { user } = useSelector((state: RootState) => state.user)
  const { data } = useGetOrderItemListQuery(
    {
      order__collected_by: String(user?.id),
      order__is_paid: "false",
    },
    { refetchOnMountOrArgChange: true }
  )

  const totalPrice = data?.reduce((acc, item) => acc + item.price, 0) || 0

  return (
    <div className="xs:w-[200px] sm:w-[500px] p-8 max-h-[800px] overflow-auto">
      <OrderContentItems data={data} />
      <div className="mt-4">
        <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
      </div>
      {data && data?.length > 0 && (
        <div className="mt-8">
          <Link to={`/checkout-order/${data[0].order__id}`}>
            <Button variant="default">Checkout</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default OrderCart
