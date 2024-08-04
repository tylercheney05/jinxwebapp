import { z } from "zod"
import { Form } from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CupFormField,
  NoteFormField,
  Price,
  ZeroSugarFormField,
  cleanFlavorsData,
  cleanZeroSugar,
} from "../shared/ItemFormFields"
import CustomOrderFlavorForm from "./CustomOrderFlavorForm"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { createOrderItem } from "features/orders"
import { cleanFormData, handleError } from "utils/FormUtils"
import { toast } from "react-toastify"

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CustomOrderForm = ({ setOpen }: Props) => {
  const { locationId } = useSelector((state: RootState) => state.location)
  const dispatch = useDispatch<AppDispatch>()

  const formSchema = z.object({
    order__location: z.number(),
    cup: z.string().min(1, { message: "You need to select a size" }),
    zero_sugar: z.enum(["normal", "zero_sugar"], {
      required_error: "You need to select a soda type",
    }),
    custom_order__soda: z.object({
      value: z.number().int(),
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
    note: z.string().optional(),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order__location: Number(locationId),
      custom_order__soda: {
        value: 0,
        label: "Select a Soda",
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

  return (
    <Form {...form}>
      <form className="flex gap-8 flex-col">
        <CupFormField form={form} />
        <ZeroSugarFormField form={form} />
        <CustomOrderFlavorForm form={form} />
        <NoteFormField form={form} />
        {form.watch("cup") ? <Price form={form} isCustomized={true} /> : ""}
        <div>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Add to order
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default CustomOrderForm
