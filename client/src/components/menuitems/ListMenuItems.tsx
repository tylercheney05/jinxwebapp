import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { MenuItemListItems } from "types/MenuItemTypes"
import { SodaListItem } from "types/SodaTypes"
import ListMenuItem from "./ListMenuItem"
import { menuItemsApi } from "services/menuitems"

interface Props {
  soda: SodaListItem
  resetSodas?: boolean
  setResetSodas?: React.Dispatch<React.SetStateAction<boolean>> | undefined
  isClickable?: boolean
}

const ListMenuItems = ({ soda, resetSodas = false, setResetSodas = undefined, isClickable = false }: Props) => {
  const [menuItems, setMenuItems] = useState<MenuItemListItems>([])
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (soda.id) {
      soda.id &&
        dispatch(
          menuItemsApi.endpoints.getMenuItemsList.initiate({ soda: soda.id.toString() }, { forceRefetch: true })
        ).then((data) => {
          setMenuItems(data.data)
          if (setResetSodas) {
            setResetSodas(false)
          }
        })
    }
  }, [soda.id, resetSodas])

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {soda.id &&
        menuItems?.map((menuItem) => <ListMenuItem key={menuItem.id} isClickable={isClickable} menuItem={menuItem} />)}
    </div>
  )
}

export default ListMenuItems
