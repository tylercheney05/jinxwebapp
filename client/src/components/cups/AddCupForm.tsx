import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { SIZE_OPTIONS } from "utils/constants/CupConstants"
import { SelectFormField } from "../forminputs/Select"
import { Button } from "../ui/button"
import { EditIcon, PlusIcon } from "../Icons"
import { cleanFormData, handleFormSubmitResponse } from "utils/FormUtils"
import { Cup } from "types"
import { useEffect } from "react"
import { useCreateCupMutation, useGetCupsListQuery } from "services/cups"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import EditCupForm from "./EditCupForm"

const AddCupForm = () => {
  const [createCup, result] = useCreateCupMutation()
  const { data, refetch } = useGetCupsListQuery({}, { refetchOnMountOrArgChange: true })
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

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Cup added successfully", "post", refetch)
  }, [result])

  function onSubmit(values: z.infer<typeof formSchema>) {
    createCup(cleanFormData(values))
  }

  return (
    <Form {...form}>
      {data?.length && data?.length > 0 ? <FormLabel>Existing Cups</FormLabel> : null}
      {data?.map((cup: Cup) => (
        <div key={cup.id} className="h-10 pl-2 flex items-center text-sm gap-1 justify-between">
          <div>
            {cup.size.display} - ${cup.price}
          </div>
          <Sheet>
            <SheetTrigger>
              <EditIcon className="cursor-pointer" size="18px" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit Cup</SheetTitle>
                <SheetDescription>
                  Make changes to the {cup.size.display} cup. Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <EditCupForm cup={cup} refetch={refetch} />
            </SheetContent>
          </Sheet>
        </div>
      ))}
      <form className="items-center gap-4 grid grid-cols-10">
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
        <div className="text-right">
          <Button type="submit" className="mt-10" onClick={form.handleSubmit(onSubmit)}>
            <PlusIcon />
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddCupForm
