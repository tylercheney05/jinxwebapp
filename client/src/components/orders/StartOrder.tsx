import { DrawerHeader, DrawerTitle } from "../ui/drawer"
import { useGetOrderItemListQuery, usePartialUpdateOrderMutation } from "services/orders"
import { OrderListItem } from "types/OrderTypes"
import OrderContentItems from "./OrderContentItems"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import useMediaQuery from "@mui/material/useMediaQuery"
import { Button } from "../ui/button"
import { w3cwebsocket } from "websocket"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { toast } from "react-toastify"
import DoubleClickButton from "../ui/button/doubleclickbutton"
import { ScrollArea } from "../ui/scroll-area"

interface Props {
  order: OrderListItem
  client: w3cwebsocket | null
}

const StartOrder = ({ order, client }: Props) => {
  const { data } = useGetOrderItemListQuery({ order: order.id }, { refetchOnMountOrArgChange: true })
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const navigate = useNavigate()
  const [partialUpdate, { isSuccess }] = usePartialUpdateOrderMutation()

  const handleClick = () => {
    if (client) {
      client.send(
        JSON.stringify({
          order_in_progress: true,
          order_id: order.id,
        })
      )
    }
    navigate(`/make-orders/${order.id}`)
  }

  useEffect(() => {
    if (isSuccess) {
      const notify = () => toast.success("Order completed successfully")
      notify()
      navigate("/make-orders")
    }
  }, [isSuccess])

  return (
    <ScrollArea>
      <div className="max-h-screen">
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
            {client ? (
              <Button onClick={handleClick}>Start Order</Button>
            ) : (
              <DoubleClickButton
                onClick={() =>
                  partialUpdate({
                    id: order.id,
                    data: {
                      is_complete: true,
                    },
                  })
                }
                alertMsg={
                  <>
                    Are you sure you want to mark this order as complete?
                    <br />
                    Click again to confirm.
                    <br />
                    Click anywhere else to cancel.
                  </>
                }
              >
                Complete Order
              </DoubleClickButton>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}

export default StartOrder
