import { useForm } from "react-hook-form"
import { Form, FormLabel } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { MenuItemListItem } from "types/MenuItemTypes"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import {
  cleanFlavorsData,
  cleanZeroSugar,
  CupFormField,
  NoteFormField,
  Price,
  ZeroSugarFormField,
} from "../shared/ItemFormFields"
import useMediaQuery from "@mui/material/useMediaQuery"
import { Switch } from "../ui/switch"
import MenuItemCustomOrder from "./MenuItemCustomOrder"
import { useState } from "react"
import { Button } from "../ui/button"
import { createOrderItem } from "features/orders"
import { cleanFormData, handleError } from "utils/FormUtils"
import { toast } from "react-toastify"
import { useDidMountEffect } from "utils/SharedUtils"
import { ScrollArea } from "../ui/scroll-area"
import { Card, CardContent } from "../ui/card"

interface Props {
  menuItem: MenuItemListItem
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderItemForm = ({ menuItem, setOpen }: Props) => {
  const { locationId } = useSelector((state: RootState) => state.location)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [isCustomized, setIsCustomized] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const formSchema = z.object({
    menu_item: z.number(),
    order__location: z.number(),
    cup: z.string().min(1, { message: "You need to select a size" }),
    low_sugar: z.enum(["normal", "low_sugar"], {
      required_error: "You need to select a soda type",
    }),
    note: z.string().optional(),
    custom_order__soda: z.string(),
    custom_order_flavors: z.array(z.number()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one flavor",
    }),
    // custom_order_flavors: z.array(
    //   z.object({
    //     flavor: z.object({
    //       value: z.number().int(),
    //       label: z.string(),
    //     }),
    //     quantity: z.string(),
    //   })
    // ),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menu_item: menuItem.id,
      order__location: Number(locationId),
      note: "",
      custom_order__soda: "",
      custom_order_flavors: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    let updatedValues = values
    updatedValues = cleanZeroSugar(updatedValues)
    // updatedValues = cleanFlavorsData(updatedValues, "custom_order_flavors")
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
      form.setValue("custom_order_flavors", [])
      // Assuming 'custom_order__soda' has a similar default value you want to reset to
      form.setValue("custom_order__soda", "")
    }
  }, [isCustomized])

  console.log("flavors", form.watch("custom_order_flavors"))
  console.log("form", form.formState.errors)

  return (
    <Form {...form}>
      <form>
        <ScrollArea className="max-h-[600px] overflow-auto">
          <div className="flex flex-col gap-4">
            <CupFormField form={form} />
            <ZeroSugarFormField form={form} />
            <div className="p-8">
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
            </div>
            <NoteFormField form={form} />
            <div className="flex gap-4 flex-col">
              {/* {form.watch("cup") ? <Price menuItem={menuItem} form={form} isCustomized={isCustomized} /> : ""} */}
              <div>
                <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                  Add to order
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </form>
    </Form>
  )
}

export default OrderItemForm
