import { OrderItemListItems } from "types/OrderTypes"
import { Label } from "../ui/label"
import { ZeroSugarIcon } from "../Icons"
import { SugarIcon } from "../Icons"

interface Props {
  data: OrderItemListItems | undefined
}

const OrderContentItems = ({ data }: Props) => {
  return (
    <>
      {data?.map((item, index) => (
        <div key={item.id} className="flex flex-col mb-4">
          <Label className="underline mb-2">Item #{index + 1}</Label>
          <div className="flex gap-2 items-center">
            {item.low_sugar ? <ZeroSugarIcon size="16px" /> : <SugarIcon size="16px" />}
            {item.order_item_name}
          </div>
          <div className="pl-4">
            <div>- {item.cup__size__display}</div>
            <div>- ${item.price.toFixed(2)}</div>
            {item.note && <div>- {item.note}</div>}
          </div>
        </div>
      ))}
    </>
  )
}

export default OrderContentItems
