import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { MenuItemListItem } from "/types/MenuItemTypes"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Button } from "../ui/button"
import { cleanFormData } from "utils/FormUtils"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { CupListItem } from "types/CupTypes"
import { createOrderItem } from "features/orders"
import { toast } from "react-toastify"
import { useGetCupsListQuery } from "services/cups"
import { Textarea } from "../ui/textarea"

interface Props {
  menuItem: MenuItemListItem
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderItemForm = ({ menuItem, setOpen }: Props) => {
  const { locationId } = useSelector((state: RootState) => state.location)
  const { data } = useGetCupsListQuery({}, { refetchOnMountOrArgChange: true })
  const dispatch = useDispatch<AppDispatch>()

  const formSchema = z.object({
    menu_item: z.number(),
    order__location: z.number(),
    cup: z.string().min(1, { message: "You need to select a size" }),
    zero_sugar: z.enum(["normal", "zero_sugar"], {
      required_error: "You need to select a soda type",
    }),
    note: z.string().optional(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menu_item: menuItem.id,
      order__location: Number(locationId),
      note: "",
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
    dispatch(createOrderItem(cleanFormData(updatedValues))).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        form.reset()
        const notify = () => toast.success("Order Item added successfully")
        notify()
        setOpen(false)
      } else if (data.meta.requestStatus === "rejected") {
        const notify = () => toast.error(data.payload.error.message)
        notify()
      }
    })
  }

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
        {form.watch("cup") ? (
          <div>
            <strong>Price: </strong>$
            {menuItem.cup_prices.find((obj) => String(obj.id) === form.watch("cup"))?.price.toFixed(2) ??
              "Price not available"}
          </div>
        ) : (
          ""
        )}
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
