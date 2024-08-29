import { completeOrderPayment } from "features/orders"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { OrderListItem } from "types/OrderTypes"
import { Label } from "../ui/label"
import { LoadingIcon, SugarIcon, ZeroSugarIcon } from "../Icons"
import DoubleClickButton from "../ui/button/doubleclickbutton"
import { toast } from "react-toastify"
import { orderItemsApi, useGetOrderItemListQuery } from "services/orders"
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { Form } from "../ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SelectFromApiFormField } from "../forminputs/Select"

interface Props {
  order: OrderListItem
}

const OrderContent = ({ order }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  const formSchema = z.object({
    order_name: z.object({
      value: z.number().int(),
      label: z.string(),
    }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order_name: {
        value: 0,
        label: "Select an order name",
      },
    },
  })
  const { user } = useSelector((state: RootState) => state.user)
  const { data, isLoading } = useGetOrderItemListQuery(
    { order__collected_by: String(user?.id), order__is_paid: "false" },
    { refetchOnMountOrArgChange: true }
  )
  const { locationId } = useSelector((state: RootState) => state.location)
  const totalPrice = data?.reduce((acc, item) => acc + item.price, 0) || 0

  const client = new W3CWebSocket(`ws://127.0.0.1:8000/ws/orders/${locationId}/`)

  const handleClick = () => {
    dispatch(
      completeOrderPayment({ id: order.id, is_paid: true, order_name: form.getValues("order_name").value })
    ).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        const notify = () => toast.success("Order completed successfully")
        notify()
        client.send(
          JSON.stringify({
            message: "Order completed",
          })
        )
      }
    })
  }

  return (
    <Form {...form}>
      <form>
        <div className="xs:w-[200px] sm:w-[500px] p-8 max-h-[800px] overflow-auto">
          <h1 className="text-xl font-bold mb-8">Order</h1>
          {isLoading ? (
            <LoadingIcon />
          ) : (
            <>
              <div>
                {data?.map((item, index) => (
                  <div key={item.id} className="flex flex-col mb-4">
                    <Label className="underline mb-2">Item #{index + 1}</Label>
                    <div className="flex gap-2 items-center">
                      {item.zero_sugar ? <ZeroSugarIcon size="16px" /> : <SugarIcon size="16px" />}
                      {item.menu_item__name ? item.menu_item__name : item.custom_order_name}
                    </div>
                    <div className="pl-4">
                      <div>- {item.cup__size__display}</div>
                      <div>- ${item.price.toFixed(2)}</div>
                      {item.note && <div>- {item.note}</div>}
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
                </div>
              </div>
              <div className="mt-8">
                <SelectFromApiFormField
                  form={form}
                  name="order_name"
                  placeholder="Select an order name"
                  loadOptionsApi={orderItemsApi.endpoints.getOrderNameDropdown.initiate}
                  fieldsForDropdownLabel={["name"]}
                  label="Assign an order name"
                />
              </div>
              <div className="mt-8">
                <DoubleClickButton
                  variant="default"
                  onClick={handleClick}
                  alertMsg="Please ensure the order is paid for and then click button again to confirm."
                >
                  Complete Order
                </DoubleClickButton>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}

export default OrderContent
