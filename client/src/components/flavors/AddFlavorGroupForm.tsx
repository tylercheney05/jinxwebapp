import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { EditIcon, PlusIcon } from "../Icons"
import { useEffect } from "react"
import { SelectFormField } from "../shared/forminputs/Select"
import { UOM_OPTIONS } from "utils/constants/FlavorConstants"
import { cleanFormData, handleFormSubmitResponse } from "utils/FormUtils"
import { useCreateFlavorGroupMutation, useGetFlavorGroupsListQuery } from "services/flavors"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import EditFlavorGroupForm from "./EditFlavorGroupForm"

const AddFlavorGroupForm = () => {
  const [createFlavorGroup, result] = useCreateFlavorGroupMutation()
  const { data, refetch } = useGetFlavorGroupsListQuery({}, { refetchOnMountOrArgChange: true })
  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    uom: z.object({
      value: z.string().min(1, { message: "Unit of measure is required" }),
      label: z.string(),
    }),
    price: z.string().min(1, { message: "Price is required" }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      uom: {
        value: "",
        label: "Select a unit of measure",
      },
      price: "",
    },
  })

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Flavor group added successfully", "post", refetch)
  }, [result])

  function onSubmit(values: z.infer<typeof formSchema>) {
    createFlavorGroup(cleanFormData(values))
  }

  return (
    <Form {...form}>
      {data?.length && data?.length > 0 ? <FormLabel>Existing Flavor Groups</FormLabel> : null}
      {data?.map((flavorGroup) => (
        <div key={flavorGroup.id} className="h-10 pl-2 flex items-center text-sm gap-1 justify-between">
          <div>
            {flavorGroup.name} - ${flavorGroup.price} per {flavorGroup.uom.display}
          </div>
          <Sheet>
            <SheetTrigger>
              <EditIcon className="cursor-pointer" size="18px" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit Flavor Group</SheetTitle>
                <SheetDescription>
                  Make changes to the {flavorGroup.name} flavor group. Click save when you're done.
                </SheetDescription>
              </SheetHeader>
              <EditFlavorGroupForm flavorGroup={flavorGroup} refetch={refetch} />
            </SheetContent>
          </Sheet>
        </div>
      ))}
      <form className="items-center gap-4 grid grid-cols-10">
        <div className="col-span-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel className="text-sm">Add New Flavor Group</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter flavor group name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-3">
          <div className="mt-10">
            <SelectFormField form={form} name="uom" placeholder="Select a unit of measure" options={UOM_OPTIONS} />
          </div>
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
        <div className="text-right">
          <Button type="submit" className="mt-10" onClick={form.handleSubmit(onSubmit)}>
            <PlusIcon />
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddFlavorGroupForm
