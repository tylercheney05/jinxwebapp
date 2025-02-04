import { Label } from "components/ui/label"
import { OrderItem } from "types/orderItem/orderItem"
import { DeleteIcon, SugarIcon, ZeroSugarIcon } from "components/Icons"
import DoubleClickButton from "components/ui/button/doubleclickbutton"
import { useDeleteOrderItemMutation } from "services/orderitems"

interface Props {
  index: number
  order_item: OrderItem
  name: string
  price: number
  readOnly?: boolean
}

const OrderContentItem = ({ index, order_item, name, price, readOnly = true }: Props) => {
  const [deleteOrderItem, result] = useDeleteOrderItemMutation()

  return (
    <>
      <div key={order_item.id} className="flex flex-col mb-4">
        <Label className="underline mb-2">Item #{index + 1}</Label>
        <div className="flex gap-4 items-center sm:justify-start justify-between">
          <div className="flex gap-4">
            <div>{order_item.low_sugar ? <ZeroSugarIcon /> : <SugarIcon />}</div>
            <div>{name}</div>
          </div>
          {!readOnly && (
            <DoubleClickButton
              variant="ghost"
              className="border-0"
              onClick={() => deleteOrderItem({ id: order_item.id })}
              smallConfirm={true}
            >
              <DeleteIcon />
            </DoubleClickButton>
          )}
        </div>
        <div className="pl-8">
          <div>- {order_item.cup.size.display}</div>
          <div>- ${price.toFixed(2)}</div>
          {order_item.note && <div>- {order_item.note}</div>}
        </div>
      </div>
    </>
  )
}

export default OrderContentItem
