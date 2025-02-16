import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card"
import { OrderItem } from "../../../../types/orderItem/orderItem"
import { MenuItemFlavor } from "/types/menuItem/menuItemFlavor"
import FlavorContent from "./MenuItem/FlavorContent"
import { CustomOrderFlavorMenuItemCustomOrder } from "/types/customOrderFlavor/customOrderFlavorMenuItemCustomOrder"
import { CustomOrderFlavorCustomOrder } from "/types/customOrderFlavor/customOrderFlavorCustomOrder"

interface Props {
  order_item: OrderItem
  name: string
  sodaName: string
  flavors: MenuItemFlavor[] | CustomOrderFlavorMenuItemCustomOrder[] | CustomOrderFlavorCustomOrder[]
}

const MakeOrderCard = ({ order_item, name, sodaName, flavors }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{name}</CardTitle>
      </CardHeader>
      <CardContent className="text-base sm:text-lg">
        <div>
          <strong>Cup: </strong>
          {order_item.cup.size.display}
        </div>
        <div>
          <strong>Soda: </strong>
          {sodaName}
          {order_item.low_sugar && " Zero Sugar"}
        </div>
        <div className="my-4">
          {flavors.map((flavor: any) => {
            const getQuantity = () => {
              if (order_item?.menu_item) {
                return flavor.quantity
              } else if (order_item?.menu_item_custom_order || order_item?.custom_order) {
                return flavor.custom_order_flavor.quantity
              }
              return 0
            }

            const getFlavor = () => {
              if (order_item?.menu_item) {
                return flavor.flavor
              } else if (order_item?.menu_item_custom_order || order_item?.custom_order) {
                return flavor.custom_order_flavor.flavor
              }
            }

            return <FlavorContent order_item={order_item} quantity={getQuantity()} flavor={getFlavor()} />
          })}
        </div>
        {order_item.note && (
          <>
            <strong>Notes:</strong>
            <div>{order_item.note}</div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default MakeOrderCard
