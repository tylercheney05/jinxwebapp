import { Card, CardHeader, CardTitle } from "../ui/card"
import { OrderListItem } from "types/OrderTypes"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { useState } from "react"
import PendingOrderContent from "./PendingOrderContent"
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer"
import useMediaQuery from '@mui/material/useMediaQuery';
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { useDidMountEffect } from "utils/SharedUtils"
import { cn } from "lib/utils"
import PendingCompleteOrder from "./PendingCompleteOrder"

interface Props {
  order: OrderListItem
  client: W3CWebSocket
}

const PendingOrder = ({ order, client }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const [startOpen, setStartOpen] = useState<boolean>(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const card = (
    <Card
      key={order.id}
      className={cn(
        order.is_in_progress ? "opacity-50" : "",
        order.is_complete ? "bg-jinxGreen/10 border-jinxGreen text-jinxGreen" : ""
      )}
    >
      <CardHeader className="relative">
        <CardTitle>{order.order_name__name}</CardTitle>
        {order.is_in_progress && <div className="absolute bottom-1 right-2">In Progress</div>}
        {order.is_complete && <div className="absolute bottom-1 right-2">Completed</div>}
      </CardHeader>
    </Card>
  )

  useDidMountEffect(() => {
    if (open) {
      setStartOpen(true)
      client.send(
        JSON.stringify({
          order_in_progress: true,
          order_id: order.id,
        })
      )
      client.close()
    } else if (!open && startOpen) {
      client.onopen = () => {
        client.send(
          JSON.stringify({
            order_in_progress: false,
            order_id: order.id,
          })
        )
      }
    }
  }, [open])

  return (
    <>
      <div className="w-[400px]">
        {isDesktop ? (
          <Dialog open={open} modal onOpenChange={setOpen}>
            <DialogTrigger className="w-full" disabled={order.is_in_progress}>
              {card}
            </DialogTrigger>
            <DialogContent>
              {order.is_complete ? (
                <PendingCompleteOrder order={order} />
              ) : (
                <PendingOrderContent order={order} client={client} setOpen={setOpen} />
              )}
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={open} modal onOpenChange={setOpen}>
            <DrawerTrigger className="w-full">{card}</DrawerTrigger>
            <DrawerContent>
              <PendingOrderContent order={order} client={client} setOpen={setOpen} />
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </>
  )
}

export default PendingOrder
