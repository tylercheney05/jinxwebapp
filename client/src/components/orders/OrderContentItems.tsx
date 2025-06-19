import { OrderItemListItems } from "types/OrderTypes"
import { Label } from "../ui/label"
import { DeleteIcon, ZeroSugarIcon } from "../Icons"
import { SugarIcon } from "../Icons"
import DoubleClickButton from "../ui/button/doubleclickbutton"
import { useDeleteOrderItemMutation } from "services/orders"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { WATER_BEVERAGE_NAME } from "utils/constants"

interface Props {
  data: OrderItemListItems | undefined
  readOnly?: boolean
  refetch?: any
  showRecipe?: boolean
}

const OrderContentItems = ({ data, readOnly = true, refetch, showRecipe = false }: Props) => {
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
          <div className="flex gap-4 items-center sm:justify-start justify-between">
            <div className="flex gap-4">
              <div>{item.low_sugar ? <ZeroSugarIcon /> : <SugarIcon />}</div>
              <div>{item.order_item_name}</div>
            </div>
            {!readOnly && (
              <DoubleClickButton
                variant="ghost"
                className="border-0"
                onClick={() => deleteOrderItem({ id: item.id })}
                smallConfirm={true}
              >
                <DeleteIcon />
              </DoubleClickButton>
            )}
          </div>
          <div className="pl-8">
            <>
              <div>- {item.cup__size__display}</div>
              <div>- ${item.price.toFixed(2)}</div>
            </>
            {showRecipe ? (
              <div>
                <div>
                  -{" "}
                  <span className="underline">
                    {item.soda_name}
                    {item.low_sugar && item.soda_name !== WATER_BEVERAGE_NAME ? " Zero" : ""}
                  </span>
                </div>
                {Object.entries(item.order_item_flavors).map((flavor, index) => (
                  <div key={index}>
                    - {flavor[0]}: {flavor[1]}
                  </div>
                ))}
              </div>
            ) : null}
            {item.note && (
              <div>
                - <strong>NOTES: </strong>
                {item.note}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  )
}

export default OrderContentItems
