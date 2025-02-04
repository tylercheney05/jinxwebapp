import { useGetOrderDetailQuery } from "services/orders"
import { AppDispatch, RootState } from "store"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
import DoubleClickButton from "../ui/button/doubleclickbutton"
import { deleteOrder } from "features/orders"
import { toast } from "react-toastify"
import OrderContentItem from "./other/orderContentItem"
import { OrderDetailItem, OrderListItem } from "/types/OrderTypes"
import { getName, getPrice } from "utils/orders/orderItem"

interface Props {
  order: OrderListItem
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderCart = ({ order, setOpen }: Props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.user)
  const { data } = useGetOrderDetailQuery(
    {
      id: order.id,
    },
    { refetchOnMountOrArgChange: true }
  )

  const totalPrice = data?.pending_price || 0

  const handleClick = () => {
    if (order?.id) {
      setOpen(false)
      setTimeout(() => {
        navigate(`/checkout-order/${order.id}`)
      }, 250)
    }
  }

  const handleClearCart = () => {
    if (order?.id && user?.id) {
      dispatch(deleteOrder({ id: order.id, collected_by: user.id })).then((data) => {
        if (data.meta.requestStatus === "fulfilled") {
          const notify = () => toast.success("Cart cleared successfully")
          notify()
        } else if (data.meta.requestStatus === "rejected") {
          const notify = () => toast.error("Error clearing cart")
          notify()
        }
      })
    }
  }

  return (
    <div className="xs:w-[200px] sm:w-[500px] p-8 max-h-[800px] overflow-auto">
      {data && data?.order_items.length > 0 && (
        <div className="mb-8 flex gap-4">
          <Button variant="default" onClick={handleClick}>
            Go to cart
          </Button>
          <DoubleClickButton variant="destructive" onClick={handleClearCart} smallConfirm>
            Clear cart
          </DoubleClickButton>
        </div>
      )}
      {data?.order_items?.map((order_item, index) => {
        return (
          <OrderContentItem
            index={index}
            order_item={order_item}
            name={getName(order_item)}
            price={getPrice(order_item)}
          />
        )
      })}
      <div className="mt-4">
        <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
      </div>
    </div>
  )
}

export default OrderCart
