import { DrawerHeader, DrawerTitle } from "../ui/drawer"
import { OrderListItem } from "types/OrderTypes"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import useMediaQuery from "@mui/material/useMediaQuery"
import { Button } from "../ui/button"
import { w3cwebsocket } from "websocket"
import { useNavigate } from "react-router-dom"
import OrderContentItem from "./other/orderContentItem"
import { useGetOrderDetailQuery } from "services/orders"
import { getName, getPrice } from "utils/orders/orderItem"

interface Props {
  order: OrderListItem
  client: w3cwebsocket
}

const StartOrder = ({ order, client }: Props) => {
  const { data } = useGetOrderDetailQuery(
    {
      id: order.id,
    },
    { refetchOnMountOrArgChange: true }
  )
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const navigate = useNavigate()

  const handleClick = () => {
    client.send(
      JSON.stringify({
        order_in_progress: true,
        order_id: order.id,
      })
    )
    navigate(`/make-orders/${order.id}`)
  }

  return (
    <div>
      {isDesktop ? (
        <DialogHeader className="mb-4">
          <DialogTitle>Start order for {order.order_name__name}</DialogTitle>
        </DialogHeader>
      ) : (
        <DrawerHeader className="mb-4">
          <DrawerTitle>Start order for {order.order_name__name}</DrawerTitle>
        </DrawerHeader>
      )}
      <div>
        {data?.order_items?.map((order_item, index) => (
          <OrderContentItem
            index={index}
            order_item={order_item}
            name={getName(order_item)}
            price={getPrice(order_item)}
          />
        ))}
        <div>
          <Button onClick={handleClick}>Start Order</Button>
        </div>
      </div>
    </div>
  )
}

export default StartOrder
