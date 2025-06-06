import { completeOrderPayment } from "features/orders"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { OrderDetailItem, OrderListItem, OrderNameItem } from "types/OrderTypes"
import { LoadingIcon } from "../Icons"
import DoubleClickButton from "../ui/button/doubleclickbutton"
import { toast } from "react-toastify"
import { useDeleteOrderMutation, useGetOrderItemListQuery, useGetOrderNameListQuery } from "services/orders"
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
import { useEffect, useState } from "react"
import { cleanFormData } from "utils/FormUtils"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { useNavigate } from "react-router-dom"
import { useDidMountEffect } from "utils/SharedUtils"
import { Separator } from "../ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"

interface Props {
  order: OrderListItem | OrderDetailItem
}

const CheckoutOrderForm = ({ order }: Props) => {
  const [value, setValue] = useState<string>("1")
  const [deleteOrder, result] = useDeleteOrderMutation()
  const { data: orderNamesData } = useGetOrderNameListQuery({}, { refetchOnMountOrArgChange: true })
  const [showDiscount, setShowDiscount] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const formSchema = z.object({
    order_name: z.string().min(1, { message: "Order name is required" }),
    discount: z.object({
      value: z.number().int(),
      label: z.string(),
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order_name: "",
      discount: {
        value: 0,
        label: "Select a discount",
      },
    },
  })
  const { user } = useSelector((state: RootState) => state.user)
  const { data, isLoading, refetch } = useGetOrderItemListQuery(
    {
      order__collected_by: String(user?.id),
      order__is_paid: "false",
      discount: form.watch("discount") ? form.watch("discount").value : 0,
    },
    { refetchOnMountOrArgChange: true }
  )
  const { locationId } = useSelector((state: RootState) => state.location)
  const totalPrice = data?.reduce((acc, item) => acc + item.price, 0) || 0
  const navigate = useNavigate()

  const client = new W3CWebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/ws/orders/${locationId}/?user_id=${user?.id}`)

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
        navigate("/take-order")
      }
    })
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleClick()
  }

  useDidMountEffect(() => {
    if (!showDiscount) {
      form.setValue("discount", { value: 0, label: "Select a discount" })
    }
  }, [showDiscount])

  useEffect(() => {
    if (result.isSuccess) {
      navigate("/take-order")
      const notify = () => toast.success("Order deleted successfully")
      notify()
    }
  }, [result])

  useEffect(() => {
    if (form.watch("order_name")) {
      setValue("")
    }
  }, [form.watch("order_name")])

  const selectedOrderName = orderNamesData
    ? orderNamesData?.filter((orderName: OrderNameItem) => orderName.id === Number(form.watch("order_name")))[0]?.name
    : ""

  return (
    <Form {...form}>
      <form>
        <div className="p-8">
          <h1 className="text-xl font-bold mb-8">Order</h1>
          {isLoading ? (
            <LoadingIcon />
          ) : (
            <>
              <div>
                <OrderContentItems data={data} refetch={refetch} readOnly={false} />
                <div className="flex items-center space-x-2">
                  <Switch checked={showDiscount} onCheckedChange={setShowDiscount} />
                  <Label>Apply Discount</Label>
                </div>
                {showDiscount && (
                  <div className="mt-4 max-w-64">
                    <SelectFromApiFormField
                      form={form}
                      name="discount"
                      placeholder="Select a discount"
                      loadOptionsApi={discountsApi.endpoints.getDiscountsDropdown.initiate}
                      fieldsForDropdownLabel={["name"]}
                    />
                  </div>
                )}
                <div className="mt-8 text-xl">
                  <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
                </div>
              </div>
              <div className="mt-8">
                <Accordion type="single" collapsible value={value} onValueChange={setValue}>
                  <FormField
                    control={form.control}
                    name="order_name"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <AccordionItem value="1">
                          <AccordionTrigger>
                            <div className="text-left">
                              <FormLabel>Order Name</FormLabel>
                              <div className="text-sm">{selectedOrderName && `(Selected: ${selectedOrderName})`}</div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <FormControl>
                              <RadioGroup
                                {...field}
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-col space-y-1"
                              >
                                {orderNamesData?.length &&
                                  orderNamesData?.length > 0 &&
                                  orderNamesData.map((orderName: OrderNameItem) => (
                                    <>
                                      <FormItem
                                        key={orderName.id}
                                        className="flex items-center space-x-3 space-y-0 sm:justify-start justify-between"
                                      >
                                        <FormControl>
                                          <RadioGroupItem value={String(orderName.id)} />
                                        </FormControl>
                                        <FormLabel className="font-normal">{orderName.name}</FormLabel>
                                      </FormItem>
                                      <Separator className="mt-2" />
                                    </>
                                  ))}
                              </RadioGroup>
                            </FormControl>
                          </AccordionContent>
                        </AccordionItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Accordion>
              </div>
              <div className="mt-8">
                <DoubleClickButton
                  variant="default"
                  onClick={form.handleSubmit(onSubmit)}
                  alertMsg="Please ensure the order is paid for and then click button again to confirm."
                  className="sm:w-[175px] w-full"
                >
                  Complete Order
                </DoubleClickButton>
              </div>
              <div className="mt-4">
                <DoubleClickButton
                  variant="destructive"
                  onClick={() => deleteOrder({ id: order.id })}
                  alertMsg="Are you sure you want to cancel this order? Click again to confirm."
                  className="sm:w-[175px] w-full"
                >
                  Cancel Order
                </DoubleClickButton>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}

export default CheckoutOrderForm
