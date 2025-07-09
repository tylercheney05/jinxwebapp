import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Cup } from "types"
import { Input } from "../ui/input"
import { SIZE_OPTIONS } from "utils/constants/CupConstants"
import { SelectFormField } from "../forminputs/Select"
import { Button } from "../ui/button"
import { useUpdateCupMutation } from "services/cups"
import { cleanFormData, handleFormSubmitResponse } from "utils/FormUtils"
import { useEffect } from "react"
import { Refetch } from "types/shared"

interface Props {
  obj: Cup
  refetch: Refetch
}

const EditCupForm = ({ obj, refetch }: Props) => {
  const [updateCup, result] = useUpdateCupMutation()

  const formSchema = z.object({
    size: z.object({
      value: z.string().min(1, { message: "Size is required" }),
      label: z.string(),
    }),
    price: z.string().min(1, { message: "Price is required" }),
    conversion_factor: z.string().min(1, { message: "Conversion factor is required" }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: {
        value: obj.size.value,
        label: obj.size.display,
      },
      price: String(obj.price),
      conversion_factor: String(obj.conversion_factor),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateCup({ id: obj.id, ...cleanFormData(values) })
  }

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Cup updated successfully", "put", refetch)
  }, [result])

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <div>
          <SelectFormField
            form={form}
            name="size"
            placeholder="Select a size"
            options={SIZE_OPTIONS}
            label="Add New Cup"
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Price</FormLabel>
                <div className="flex items-center">
                  <div className="mr-2">$</div>
                  <FormControl>
                    <Input type="number" {...field} placeholder="Enter price" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="conversion_factor"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Conversion Factor</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="Enter conversion factor" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button type="submit" className="mt-2" onClick={form.handleSubmit(onSubmit)}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EditCupForm
