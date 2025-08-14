import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import MenuItemCard from "./MenuItemCard"
import OrderItemForm from "../orders/OrderItemForm"
import { ScrollArea } from "../ui/scroll-area"
import useMediaQuery from "@mui/material/useMediaQuery"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer"
import { MenuItem } from "/types"

interface Props {
  isClickable?: boolean
  menuItem: MenuItem
}

const ListMenuItem = ({ isClickable = false, menuItem }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const dialogComponent = (
    <Dialog open={open} modal onOpenChange={setOpen}>
      <DialogTrigger>
        <MenuItemCard menuItem={menuItem} isClickable={isClickable} />
      </DialogTrigger>
      <DialogContent>
        <ScrollArea className="max-h-[800px]">
          <DialogHeader>
            <DialogTitle className="mb-4">{menuItem.name}</DialogTitle>
          </DialogHeader>
          {menuItem && <OrderItemForm menuItem={menuItem} setOpen={setOpen} />}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )

  const drawerComponent = (
    <Drawer open={open} modal onOpenChange={setOpen}>
      <DrawerTrigger>
        <MenuItemCard menuItem={menuItem} isClickable={isClickable} />
      </DrawerTrigger>
      <DrawerContent className="min-h-[400px]">
        <DrawerHeader>
          <DrawerTitle className="mb-4">{menuItem.name}</DrawerTitle>
        </DrawerHeader>
        {menuItem && <OrderItemForm menuItem={menuItem} setOpen={setOpen} />}
      </DrawerContent>
    </Drawer>
  )

  return (
    <div>
      {isClickable ? (
        <>{isDesktop ? dialogComponent : drawerComponent}</>
      ) : (
        <MenuItemCard menuItem={menuItem} isClickable={isClickable} />
      )}
    </div>
  )
}

export default ListMenuItem
