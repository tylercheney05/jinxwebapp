import { DrawerHeader, DrawerTitle } from "../ui/drawer"
import { useGetOrderItemListQuery } from "services/orders"
import { OrderListItem } from "types/OrderTypes"
import OrderContentItems from "./OrderContentItems"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import useMediaQuery from "@mui/material/useMediaQuery"
import { Button } from "../ui/button"
import { w3cwebsocket } from "websocket"
import { useNavigate } from "react-router-dom"

interface Props {
  order: OrderListItem
  client: w3cwebsocket
}

const StartOrder = ({ order, client }: Props) => {
  const { data } = useGetOrderItemListQuery({ order: order.id }, { refetchOnMountOrArgChange: true })
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
        <OrderContentItems data={data} />
        <div>
          <Button onClick={handleClick}>Start Order</Button>
        </div>
      </div>
    </div>
  )
}

export default StartOrder
