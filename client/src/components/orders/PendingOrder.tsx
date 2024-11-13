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
import { MoreVerticalIcon } from "../Icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import DoubleClickButton from "../ui/button/doubleclickbutton"

interface Props {
  order: OrderListItem
  client: w3cwebsocket
}

const PendingOrder = ({ order, client }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleClick = () => {
    client.send(
      JSON.stringify({
        order_in_progress: false,
        order_id: order.id,
      })
    )
  }

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
        {order.is_in_progress && (
          <div className="absolute top-1 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">More</span>
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DoubleClickButton
                  variant="ghost"
                  onClick={handleClick}
                  confirmButtonClassName="w-[214px]"
                  alertClassName="w-[214px]"
                  alertMsg="Please ensure another user is not working on this order before confirming"
                >
                  Remove from in progress
                </DoubleClickButton>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
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
