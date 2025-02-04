import { Flavor } from "/types/flavor"
import { OrderItem } from "../../../../../../types/orderItem/orderItem"

interface Props {
  order_item: OrderItem
  quantity: number
  flavor: Flavor
}

const FlavorContent = ({ order_item, quantity, flavor }: Props) => {
  return (
    <div>
      {quantity} {flavor.flavor_group.uom.display}(s) of
      <strong>
        {" "}
        {order_item.low_sugar && flavor.sugar_free_available && "SUGAR-FREE "}
        {flavor.name}
      </strong>
    </div>
  )
}

export default FlavorContent
