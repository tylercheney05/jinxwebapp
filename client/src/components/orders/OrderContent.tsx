import { completeOrderPayment } from "features/orders"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { OrderListItem } from "types/OrderTypes"
import { LoadingIcon } from "../Icons"
import DoubleClickButton from "../ui/button/doubleclickbutton"
import { toast } from "react-toastify"
import { orderNamesApi, useGetOrderItemListQuery } from "services/orders"
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { Form } from "../ui/form"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SelectFromApiFormField } from "../forminputs/Select"
import OrderContentItems from "./OrderContentItems"
import { discountsApi } from "services/discounts"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { useState } from "react"
import { cleanFormData } from "utils/FormUtils"

interface Props {
  order: OrderListItem
}

const OrderContent = ({ order }: Props) => {
  const [showDiscount, setShowDiscount] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const formSchema = z
    .object({
      order_name: z.object({
        value: z.number().int(),
        label: z.string(),
      }),
      discount: z.object({
        value: z.number().int(),
        label: z.string(),
      }),
    })
    .refine((data) => data.order_name.value !== 0, {
      path: ["order_name"],
      message: "Please select an order name",
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order_name: {
        value: 0,
        label: "Select an order name",
      },
      discount: {
        value: 0,
        label: "Select a discount",
      },
    },
  })
  const { user } = useSelector((state: RootState) => state.user)
  const { data, isLoading } = useGetOrderItemListQuery(
    {
      order__collected_by: String(user?.id),
      order__is_paid: "false",
      discount: form.watch("discount") ? form.watch("discount").value : 0,
    },
    { refetchOnMountOrArgChange: true }
  )
  const { locationId } = useSelector((state: RootState) => state.location)
  const totalPrice = data?.reduce((acc, item) => acc + item.price, 0) || 0

  const client = new W3CWebSocket(`ws://127.0.0.1:8000/ws/orders/${locationId}/?user_id=${user?.id}`)

  const handleClick = () => {
    dispatch(
      completeOrderPayment(
        cleanFormData({
          id: order.id,
          is_paid: true,
          order_name: form.getValues("order_name"),
          paid_amount: totalPrice,
          discount: form.watch("discount") ? form.watch("discount").value : 0,
        })
      )
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleClick()
  }

  return (
    <Form {...form}>
      <form>
        <div className="xs:w-[200px] sm:w-[500px] p-8 h-[800px] overflow-auto">
          <h1 className="text-xl font-bold mb-8">Order</h1>
          {isLoading ? (
            <LoadingIcon />
          ) : (
            <>
              <div>
                <OrderContentItems data={data} />
                <div className="flex items-center space-x-2">
                  <Switch checked={showDiscount} onCheckedChange={setShowDiscount} />
                  <Label>Apply Discount</Label>
                </div>
                {showDiscount && (
                  <div className="mt-4">
                    <SelectFromApiFormField
                      form={form}
                      name="discount"
                      placeholder="Select a discount"
                      loadOptionsApi={discountsApi.endpoints.getDiscountsDropdown.initiate}
                      fieldsForDropdownLabel={["name"]}
                    />
                  </div>
                )}
                <div className="mt-4">
                  <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
                </div>
              </div>
              <div className="mt-8">
                <SelectFromApiFormField
                  form={form}
                  name="order_name"
                  placeholder="Select an order name"
                  loadOptionsApi={orderNamesApi.endpoints.getOrderNameDropdown.initiate}
                  fieldsForDropdownLabel={["name"]}
                  label="Assign an order name"
                />
              </div>
              <div className="mt-8">
                <DoubleClickButton
                  variant="default"
                  onClick={form.handleSubmit(onSubmit)}
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
