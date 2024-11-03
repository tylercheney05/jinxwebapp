import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { MenuItemListItem } from "/types/MenuItemTypes"
import { Button } from "../ui/button"
import { cleanFormData, handleError } from "utils/FormUtils"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { createOrderItem } from "features/orders"
import { toast } from "react-toastify"
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import { Switch } from "../ui/switch"
import MenuItemCustomOrder from "./MenuItemCustomOrder"
import { Card, CardContent } from "../ui/card"
import {
  CupFormField,
  NoteFormField,
  Price,
  ZeroSugarFormField,
  cleanFlavorsData,
  cleanZeroSugar,
} from "../shared/ItemFormFields"
import { useDidMountEffect } from "utils/SharedUtils"

interface Props {
  menuItem: MenuItemListItem
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderItemForm = ({ menuItem, setOpen }: Props) => {
  const { locationId } = useSelector((state: RootState) => state.location)
  const dispatch = useDispatch<AppDispatch>()
  const [isCustomized, setIsCustomized] = useState(false)

  const formSchema = z.object({
    menu_item: z.number(),
    order__location: z.number(),
    cup: z.string().min(1, { message: "You need to select a size" }),
    low_sugar: z.enum(["normal", "low_sugar"], {
      required_error: "You need to select a soda type",
    }),
    note: z.string().optional(),
    custom_order__soda: z.object({
      value: z.number().int().optional(),
      label: z.string(),
    }),
    custom_order_flavors: z.array(
      z.object({
        flavor: z.object({
          value: z.number().int(),
          label: z.string(),
        }),
        quantity: z.string(),
      })
    ),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menu_item: menuItem.id,
      order__location: Number(locationId),
      note: "",
      custom_order__soda: {
        value: 0,
        label: "Select a soda",
      },
      custom_order_flavors: [
        {
          flavor: {
            value: 0,
            label: "Select a flavor",
          },
          quantity: "",
        },
      ],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    let updatedValues = values
    updatedValues = cleanZeroSugar(updatedValues)
    updatedValues = cleanFlavorsData(updatedValues, "custom_order_flavors")
    dispatch(createOrderItem(cleanFormData(updatedValues))).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        form.reset()
        const notify = () => toast.success("Order Item added successfully")
        notify()
        setOpen(false)
      } else if (data.meta.requestStatus === "rejected") {
        handleError(data, form)
      }
    })
  }

  useDidMountEffect(() => {
    if (!isCustomized) {
      form.setValue("custom_order_flavors", [
        {
          flavor: {
            value: 0,
            label: "Select a flavor",
          },
          quantity: "",
        },
      ])
      // Assuming 'custom_order__soda' has a similar default value you want to reset to
      form.setValue("custom_order__soda", { value: 0, label: "Select a soda" })
    }
  }, [isCustomized])

  return (
    <Form {...form}>
      <form className="flex gap-8 flex-col">
        <CupFormField form={form} />
        <ZeroSugarFormField form={form} />
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-4">
              <FormLabel>Customize?</FormLabel>
              <Switch
                checked={isCustomized}
                onCheckedChange={(checked: boolean) => setIsCustomized(checked)}
                disabled={!form.watch("cup")}
              />
              {isCustomized ? <MenuItemCustomOrder menuItem={menuItem} form={form} /> : ""}
            </div>
          </CardContent>
        </Card>
        <NoteFormField form={form} />
        {form.watch("cup") ? <Price menuItem={menuItem} form={form} isCustomized={isCustomized} /> : ""}
        <div>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Add to order
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default OrderItemForm
