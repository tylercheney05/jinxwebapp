import { UseFormReturn, useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { MenuItemListItem } from "/types/MenuItemTypes"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Button } from "../ui/button"
import { cleanFormData, handleError } from "utils/FormUtils"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { CupListItem } from "types/CupTypes"
import { createOrderItem } from "features/orders"
import { toast } from "react-toastify"
import { useGetCupsListQuery } from "services/cups"
import { Textarea } from "../ui/textarea"
import { useEffect, useState } from "react"
import { Switch } from "../ui/switch"
import CustomOrderFlavorForm from "./CustomOrderFlavorForm"
import { Card, CardContent } from "../ui/card"
import { cleanFlavorsData } from "../shared/ItemFormFields"
import { useDidMountEffect } from "utils/SharedUtils"
import { useGetFlavorsListQuery } from "services/flavors"

interface Props {
  menuItem: MenuItemListItem
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface PriceProps {
  menuItem: MenuItemListItem
  form: UseFormReturn<any>
  isCustomized: boolean
}

const OrderItemForm = ({ menuItem, setOpen }: Props) => {
  const { locationId } = useSelector((state: RootState) => state.location)
  const { data } = useGetCupsListQuery({}, { refetchOnMountOrArgChange: true })
  const dispatch = useDispatch<AppDispatch>()
  const [isCustomized, setIsCustomized] = useState(false)

  const formSchema = z.object({
    menu_item: z.number(),
    order__location: z.number(),
    cup: z.string().min(1, { message: "You need to select a size" }),
    zero_sugar: z.enum(["normal", "zero_sugar"], {
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

  const cleanZeroSugar = (values: z.infer<typeof formSchema>) => {
    let updatedValues: any = { ...values } // Create a shallow copy to avoid mutating the original object
    if (values.zero_sugar === "normal") {
      updatedValues["zero_sugar"] = false
    } else {
      updatedValues["zero_sugar"] = true
    }
    return updatedValues
  }

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
        <FormField
          control={form.control}
          name="cup"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Size</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {data?.length &&
                    data?.length > 0 &&
                    data.map((cup: CupListItem) => (
                      <FormItem key={cup.id} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={String(cup.id)} />
                        </FormControl>
                        <FormLabel className="font-normal">{cup.size__display}</FormLabel>
                      </FormItem>
                    ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zero_sugar"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Normal or zero sugar?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="normal" />
                    </FormControl>
                    <FormLabel className="font-normal">Normal</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="zero_sugar" />
                    </FormControl>
                    <FormLabel className="font-normal">Zero Sugar</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-4">
              <FormLabel>Customize?</FormLabel>
              <Switch
                checked={isCustomized}
                onCheckedChange={(checked: boolean) => setIsCustomized(checked)}
                disabled={!form.watch("cup")}
              />
              {isCustomized ? <CustomOrderFlavorForm menuItem={menuItem} form={form} /> : ""}
            </div>
          </CardContent>
        </Card>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea placeholder="Add a note about this order item" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

const Price = ({ menuItem, form, isCustomized }: PriceProps) => {
  const { data: flavorsData } = useGetFlavorsListQuery({}, { refetchOnMountOrArgChange: true })
  const { data: cupsData } = useGetCupsListQuery({}, { refetchOnMountOrArgChange: true })
  const [flavors, setFlavors] = useState<any>({})
  const [cups, setCups] = useState<any>({})

  useEffect(() => {
    if (flavorsData?.length > 0) {
      setFlavors(
        flavorsData.reduce((acc: any, { id, flavor_group__price }: any) => {
          acc[id] = flavor_group__price
          return acc
        }, {})
      )
    }
  }, [flavorsData])

  useEffect(() => {
    if (cupsData && cupsData?.length > 0) {
      setCups(
        cupsData.reduce((acc: any, { id, price }: any) => {
          acc[id] = price
          return acc
        }, {})
      )
    }
  }, [cupsData])

  const totalPrice = () => {
    if (!isCustomized) {
      return menuItem.cup_prices.find((obj) => String(obj.id) === form.watch("cup"))?.price.toFixed(2)
    } else {
      let custom_flavors = form
        .watch("custom_order_flavors")
        .filter((flavor: any) => flavor.flavor.value !== 0)
        .map((flavor: any) => {
          return { [flavor.flavor.value]: flavor.quantity }
        })

      let flavorsSumPrice = custom_flavors.reduce((acc: any, obj: any) => {
        let flavorId = Object.keys(obj)[0]
        const value = Object.values(obj).reduce((sum: number, val) => sum + Number(val) * flavors[flavorId], 0)
        return acc + value
      }, 0)
      let cupPrice = cups[Number(form.watch("cup"))]

      return (Number(flavorsSumPrice) + Number(cupPrice)).toFixed(2)
    }
  }

  return (
    <div>
      <strong>Price: </strong>${totalPrice() ?? "Price not available"}
    </div>
  )
}
