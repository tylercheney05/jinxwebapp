import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import MenuItemCard from "./MenuItemCard"
import OrderItemForm from "../orders/OrderItemForm"
import { MenuItemListItem } from "/types/MenuItemTypes"
import { ScrollArea } from "../ui/scroll-area"

interface Props {
  isClickable?: boolean
  menuItem: MenuItemListItem
}

const ListMenuItem = ({ isClickable = false, menuItem }: Props) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div>
      {isClickable ? (
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
      ) : (
        <MenuItemCard menuItem={menuItem} isClickable={isClickable} />
      )}
    </div>
  )
}

export default ListMenuItem
