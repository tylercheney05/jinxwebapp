import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { listMenuItems } from "features/menuitems"
import { MenuItemListItem, MenuItemListItems } from "types/MenuItemTypes"
import { SodaListItem } from "types/SodaTypes"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import MenuItemCard from "./MenuItemCard"
import OrderItemForm from "../orders/OrderItemForm"

interface Props {
  soda: SodaListItem
  resetSodas?: boolean
  setResetSodas?: React.Dispatch<React.SetStateAction<boolean>> | undefined
  isClickable?: boolean
}

const ListMenuItems = ({ soda, resetSodas = false, setResetSodas = undefined, isClickable = false }: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const [menuItems, setMenuItems] = useState<MenuItemListItems>([])
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemListItem | null>(null)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (soda.id) {
      soda.id &&
        dispatch(listMenuItems({ soda: soda.id.toString() })).then((data) => {
          setMenuItems(data.payload)
          if (setResetSodas) {
            setResetSodas(false)
          }
        })
    }
  }, [soda.id, resetSodas])

  const handleOnOpenChange = (isOpen: boolean, menuItem: MenuItemListItem) => {
    setOpen(isOpen)
    setSelectedMenuItem(menuItem)
  }

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {soda.id &&
        menuItems.map((menuItem) => (
          <div key={menuItem.id}>
            {isClickable ? (
              <Dialog open={open} modal onOpenChange={(isOpen) => handleOnOpenChange(isOpen, menuItem)}>
                <DialogTrigger>
                  <MenuItemCard menuItem={menuItem} isClickable={isClickable} />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{menuItem.name}</DialogTitle>
                  </DialogHeader>
                  {selectedMenuItem && <OrderItemForm menuItem={selectedMenuItem} setOpen={setOpen} />}
                </DialogContent>
              </Dialog>
            ) : (
              <MenuItemCard menuItem={menuItem} isClickable={isClickable} />
            )}
          </div>
        ))}
    </div>
  )
}

export default ListMenuItems
