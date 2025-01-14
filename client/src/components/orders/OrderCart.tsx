import { useGetOrderItemListQuery } from "services/orders"
import { RootState } from "store"
import { useSelector } from "react-redux"
import OrderContentItems from "./OrderContentItems"
import { Button } from "../ui/button"
import { Link, useNavigate } from "react-router-dom"

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderCart = ({ setOpen }: Props) => {
  const navigate = useNavigate()
  const { user } = useSelector((state: RootState) => state.user)
  const { data } = useGetOrderItemListQuery(
    {
      order__collected_by: String(user?.id),
      order__is_paid: "false",
    },
    { refetchOnMountOrArgChange: true }
  )

  const totalPrice = data?.reduce((acc, item) => acc + item.price, 0) || 0

  const handleClick = () => {
    if (data && data.length > 0) {
      const orderId = data[0].order__id
      setOpen(false)
      setTimeout(() => {
        navigate(`/checkout-order/${orderId}`)
      }, 250)
    }
  }

  return (
    <div className="xs:w-[200px] sm:w-[500px] p-8 max-h-[800px] overflow-auto">
      {data && data?.length > 0 && (
        <div className="mb-8">
          <Button variant="default" onClick={handleClick}>
            Go to cart
          </Button>
        </div>
      )}
      <OrderContentItems data={data} />
      <div className="mt-4">
        <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
      </div>
    </div>
  )
}

export default OrderCart
