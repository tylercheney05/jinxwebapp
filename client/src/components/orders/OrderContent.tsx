import { useEffect, useState } from "react"
import { completeOrder, listOrderItems } from "features/orders"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { OrderListItem, OrderListItems } from "types/OrderTypes"
import { Label } from "../ui/label"
import { SugarIcon, ZeroSugarIcon } from "../Icons"
import DoubleClickButton from "../ui/button/doubleclickbutton"
import { toast } from "react-toastify"

interface Props {
  order: OrderListItem
}

const OrderContent = ({ order }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.user)
  const [orderItems, setOrderItems] = useState<OrderListItems>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)

  useEffect(() => {
    dispatch(listOrderItems({ order__completed_by: String(user?.id), order__is_paid: "false" })).then((data) => {
      setOrderItems(data.payload)
      setTotalPrice(data.payload.reduce((acc: any, item: OrderListItem) => acc + item.price, 0))
    })
  }, [])

  const handleClick = () => {
    dispatch(completeOrder({ id: order.id, is_paid: true })).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        const notify = () => toast.success("Order completed successfully")
        notify()
      }
    })
  }

  return (
    <div className="xs:w-[200px] sm:w-[500px] p-8">
      <h1 className="text-xl font-bold mb-8">Order</h1>
      <div>
        {orderItems.map((item, index) => (
          <div key={item.id} className="flex flex-col mb-4">
            <Label className="underline mb-2">Item #{index + 1}</Label>
            <div className="flex gap-2 items-center">
              {item.zero_sugar ? <ZeroSugarIcon size="16px" /> : <SugarIcon size="16px" />}
              {item.menu_item__name} - {item.cup__size__display} - ${item.price.toFixed(2)}
            </div>
          </div>
        ))}
        <div className="mt-8">
          <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
        </div>
      </div>
      <div className="mt-8">
        <DoubleClickButton
          variant="default"
          onClick={handleClick}
          alertMsg="Please ensure the order is paid for and then click button again to confirm."
        >
          Complete Order
        </DoubleClickButton>
      </div>
    </div>
  )
}

export default OrderContent