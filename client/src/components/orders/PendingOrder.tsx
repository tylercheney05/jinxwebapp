import useMediaQuery from "@mui/material/useMediaQuery"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { useState } from "react"
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer"
import { Card, CardHeader, CardTitle } from "../ui/card"
import { cn } from "lib/utils"
import { OrderListItem } from "types/OrderTypes"
import PendingCompleteOrder from "./PendingCompleteOrder"
import StartOrder from "./StartOrder"
import { w3cwebsocket } from "websocket"

interface Props {
  order: OrderListItem
  client: w3cwebsocket
}

const PendingOrder = ({ order, client }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
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

  return (
    <div className="w-[400px]">
      {isDesktop ? (
        <Dialog open={open} modal onOpenChange={setOpen}>
          <DialogTrigger className="w-full" disabled={order.is_in_progress}>
            {card}
          </DialogTrigger>
          <DialogContent>
            {order.is_complete ? <PendingCompleteOrder order={order} /> : <StartOrder order={order} client={client} />}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger className="w-full" disabled={order.is_in_progress}>
            {card}
          </DrawerTrigger>
          <DrawerContent>
            {order.is_complete ? <PendingCompleteOrder order={order} /> : <StartOrder order={order} client={client} />}
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}

export default PendingOrder
