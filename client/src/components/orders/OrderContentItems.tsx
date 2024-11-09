import { OrderItemListItems } from "types/OrderTypes"
import { Label } from "../ui/label"
import { DeleteIcon, ZeroSugarIcon } from "../Icons"
import { SugarIcon } from "../Icons"
import DoubleClickButton from "../ui/button/doubleclickbutton"
import { useDeleteOrderItemMutation } from "services/orders"
import { useEffect } from "react"
import { handleError } from "/utils/FormUtils"
import { toast } from "react-toastify"

interface Props {
  data: OrderItemListItems | undefined
  readOnly?: boolean
  refetch?: any
}

const OrderContentItems = ({ data, readOnly = true, refetch }: Props) => {
  const [deleteOrderItem, result] = useDeleteOrderItemMutation()

  useEffect(() => {
    if (result.isSuccess) {
      if (refetch) {
        refetch()
      }
      const notify = () => toast.success("Order item deleted successfully")
      notify()
    }
  }, [result])

  return (
    <>
      {data?.map((item, index) => (
        <div key={item.id} className="flex flex-col mb-4">
          <Label className="underline mb-2">Item #{index + 1}</Label>
          <div className="flex gap-4 items-center">
            <div>{item.low_sugar ? <ZeroSugarIcon /> : <SugarIcon />}</div>
            <div className="flex-grow">{item.order_item_name}</div>
            {!readOnly && (
              <DoubleClickButton
                variant="outline"
                className="border-0"
                onClick={() => deleteOrderItem({ id: item.id })}
                smallConfirm={true}
              >
                <DeleteIcon />
              </DoubleClickButton>
            )}
          </div>
          <div className="pl-8">
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
