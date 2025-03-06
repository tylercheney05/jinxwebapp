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
import { useSelector } from "react-redux"
import { RootState } from "store"

interface Props {
  order: OrderListItem
  client: w3cwebsocket | null
}

const PendingOrder = ({ order, client }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { user } = useSelector((state: RootState) => state.user)

  const handleRemoveProgressClick = () => {
    if (client) {
      client.send(
        JSON.stringify({
          order_in_progress: false,
          order_id: order.id,
        })
      )
    }
  }

  const handleRemoveCompletedClick = () => {
    if (client) {
      client.send(
        JSON.stringify({
          order_complete: false,
          order_id: order.id,
        })
      )
    }
  }

  const handleRemoveOrderClick = () => {
    if (client) {
      client.send(
        JSON.stringify({
          delete_order: true,
          order_id: order.id,
        })
      )
    }
    setDropdownOpen(false)
  }

  const card = (
    <Card
      key={order.id}
      className={cn(
        "shadow-md rounded-2xl",
        order.is_in_progress ? "opacity-50" : "",
        order.is_complete ? "bg-jinxGreen/10 border-jinxGreen text-jinxGreen" : ""
      )}
    >
      <CardHeader className="relative">
        <CardTitle>{order.order_name__name}</CardTitle>
        {user?.is_admin && (
          <div className="absolute top-1 right-2">
            {client && (
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">More</span>
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <div className="flex flex-col gap-1 justify-start">
                    {user?.is_admin && (
                      <DoubleClickButton
                        variant="ghost"
                        onClick={handleRemoveOrderClick}
                        confirmButtonClassName="w-[214px]"
                        alertClassName="w-[214px]"
                        alertMsg="Please confirm you'd like to delete this order"
                        className="justify-start"
                      >
                        Remove Order
                      </DoubleClickButton>
                    )}
                    {order.is_in_progress && (
                      <DoubleClickButton
                        variant="ghost"
                        onClick={handleRemoveProgressClick}
                        confirmButtonClassName="w-[214px]"
                        alertClassName="w-[214px]"
                        alertMsg="Please ensure another user is not working on this order before confirming"
                        className="justify-start"
                      >
                        Remove from "In Progress"
                      </DoubleClickButton>
                    )}
                    {order.is_complete && (
                      <DoubleClickButton
                        variant="ghost"
                        onClick={handleRemoveCompletedClick}
                        confirmButtonClassName="w-[214px]"
                        alertClassName="w-[214px]"
                        alertMsg="Please confirm you'd like to remove this order from the completed list"
                        className="justify-start"
                      >
                        Remove from "Completed"
                      </DoubleClickButton>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
          <DialogTrigger className="w-full" disabled={order.is_in_progress || dropdownOpen}>
            {card}
          </DialogTrigger>
          <DialogContent>
            {order.is_complete ? <PendingCompleteOrder order={order} /> : <StartOrder order={order} client={client} />}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger className="w-full" disabled={order.is_in_progress || dropdownOpen}>
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
