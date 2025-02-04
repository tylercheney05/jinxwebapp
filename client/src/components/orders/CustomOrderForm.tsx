import { z } from "zod"
import { Form } from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CupFormField, NoteFormField, ZeroSugarFormField, cleanZeroSugar } from "../shared/ItemFormFields"
import CustomOrderFlavorForm from "./CustomOrderFlavorForm"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { createOrderItem } from "features/orders"
import { cleanFormData, handleError } from "utils/FormUtils"
import { toast } from "react-toastify"
import { useGetSodasListQuery } from "services/sodas"
import { useGetFlavorsListQuery } from "services/flavors"
import { ScrollArea } from "../ui/scroll-area"
import { useGetPriceQuery } from "services/orderitems"

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CustomOrderForm = ({ setOpen }: Props) => {
  const { locationId } = useSelector((state: RootState) => state.location)
  const dispatch = useDispatch<AppDispatch>()
  const { data: sodaData } = useGetSodasListQuery({}, { refetchOnMountOrArgChange: true })
  const { data: flavorData } = useGetFlavorsListQuery(
    {
      ordering: "name",
    },
    { refetchOnMountOrArgChange: true }
  )

  const formSchema = z.object({
    order__location: z.number(),
    cup: z.string().min(1, { message: "You need to select a size" }),
    low_sugar: z.enum(["normal", "low_sugar"], {
      required_error: "You need to select a soda type",
    }),
    custom_order__soda: z.string(),
    custom_order_flavors: z.array(z.number()),
    note: z.string().optional(),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order__location: Number(locationId),
      custom_order__soda: "",
      custom_order_flavors: [],
    },
  })

  const { data, isSuccess } = useGetPriceQuery(
    {
      cup: form.watch("cup"),
      custom_order__soda: form.watch("custom_order__soda"),
      custom_order_flavors: JSON.stringify(form.watch("custom_order_flavors")),
    },
    {
      skip: !form.watch("cup"),
      refetchOnMountOrArgChange: true,
    }
  )

  function onSubmit(values: z.infer<typeof formSchema>) {
    let updatedValues = values
    updatedValues = cleanZeroSugar(updatedValues)
    dispatch(createOrderItem(cleanFormData(updatedValues))).then((data: any) => {
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

  return (
    <Form {...form}>
      <form>
        <ScrollArea className="max-h-[500px] overflow-auto">
          <div className="flex gap-8 flex-col">
            <CupFormField form={form} />
            <ZeroSugarFormField form={form} />
            <CustomOrderFlavorForm form={form} sodaData={sodaData} flavorData={flavorData} />
            {isSuccess && (
              <div className="text-sm">
                <strong>Price: </strong>${data.price.toFixed(2)}
              </div>
            )}
            <NoteFormField form={form} />
            <div>
              <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                Add to order
              </Button>
            </div>
            <div className="h-[300px]"></div>
          </div>
        </ScrollArea>
      </form>
    </Form>
  )
}

export default CustomOrderForm
