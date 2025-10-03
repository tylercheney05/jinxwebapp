import { useForm } from "react-hook-form"
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { SIZE_OPTIONS } from "utils/constants/CupConstants"
import { SelectFormField } from "../shared/forminputs/Select"
import { Cup } from "types"
import { useCreateCupMutation, useGetCupsListQuery } from "services/cups"
import EditCupForm from "./EditCupForm"
import { ListAndAddObject } from "components/shared"

const AddCupForm = () => {
  const [createCup, result] = useCreateCupMutation()

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
        value: "",
        label: "Select a size",
      },
      price: "",
      conversion_factor: "",
    },
  })

  return (
    <ListAndAddObject
      form={form}
      title="Existing Cups"
      objTxtFn={(item: Cup) => `${item.size.display} - $${item.price}`}
      useGetObjectsListQuery={useGetCupsListQuery}
      canEdit
      editFormTitle="Edit Cup"
      EditObjectFormComponent={EditCupForm}
      onSubmit={createCup}
      result={result}
    >
      <form className="items-center gap-4 grid grid-cols-9">
        <div className="col-span-3">
          <SelectFormField
            form={form}
            name="size"
            placeholder="Select a size"
            options={SIZE_OPTIONS}
            label="Add New Cup"
          />
        </div>
        <div className="col-span-3">
          <div className="mt-10">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="mt-2">
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
        </div>
        <div className="col-span-3">
          <div className="mt-10">
            <FormField
              control={form.control}
              name="conversion_factor"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormControl>
                    <Input type="number" {...field} placeholder="Enter conversion factor" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </ListAndAddObject>
  )
}

export default AddCupForm
