import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import ListMenuItem from "./ListMenuItem"
import { menuItemsApi } from "services/menuitems"
import { LimitedTimePromoListItem } from "types/LimitedTimePromoTypes"
import { MenuItemListItem } from "/types/menuItem"
import { Soda } from "/types/soda"

interface Props {
  soda?: Soda
  promo?: LimitedTimePromoListItem
  resetSodas?: boolean
  setResetSodas?: React.Dispatch<React.SetStateAction<boolean>> | undefined
  isClickable?: boolean
}

const ListMenuItems = ({ soda, promo, resetSodas = false, setResetSodas = undefined, isClickable = false }: Props) => {
  const [menuItems, setMenuItems] = useState<MenuItemListItem[]>([])
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (soda && soda.id) {
      soda.id &&
        dispatch(
          menuItemsApi.endpoints.getMenuItemsList.initiate(
            { soda: soda.id.toString(), limited_time_promotions__isnull: true },
            { forceRefetch: true }
          )
        ).then((data) => {
          setMenuItems(data.data)
          if (setResetSodas) {
            setResetSodas(false)
          }
        })
    }
  }, [soda?.id, resetSodas])

  useEffect(() => {
    if (promo && promo.id) {
      promo.id &&
        dispatch(
          menuItemsApi.endpoints.getMenuItemsList.initiate(
            {
              limited_time_promotions__limited_time_promo: promo.id.toString(),
              limited_time_promotions__limited_time_promo__is_archived: false,
            },
            { forceRefetch: true }
          )
        ).then((data) => {
          setMenuItems(data.data)
          if (setResetSodas) {
            setResetSodas(false)
          }
        })
    }
  }, [promo?.id, resetSodas])

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {soda &&
        soda.id &&
        menuItems?.map((menuItem: MenuItemListItem) => (
          <ListMenuItem key={menuItem.id} isClickable={isClickable} menuItem={menuItem} />
        ))}
      {promo &&
        promo.id &&
        menuItems?.map((menuItem) => <ListMenuItem key={menuItem.id} isClickable={isClickable} menuItem={menuItem} />)}
    </div>
  )
}

export default ListMenuItems
