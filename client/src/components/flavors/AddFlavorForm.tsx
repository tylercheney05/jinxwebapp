import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { PlusIcon } from "../Icons"
import { useEffect } from "react"
import { SelectFromApiFormField } from "../forminputs/Select"
import { cleanFormData, handleFormSubmitResponse } from "utils/FormUtils"
import { flavorGroupsApi, useCreateFlavorMutation, useGetFlavorsListQuery } from "services/flavors"
import { FlavorListItem } from "/types/FlavorTypes"

const AddFlavorForm = () => {
  const [createFlavor, result] = useCreateFlavorMutation()
  const { data, refetch } = useGetFlavorsListQuery({}, { refetchOnMountOrArgChange: true })
  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    flavor_group: z.object({
      value: z.number().int(),
      label: z.string(),
    }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      flavor_group: {
        value: 0,
        label: "Select a flavor group",
      },
    },
  })

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Flavor added successfully", refetch)
  }, [result])

  function onSubmit(values: z.infer<typeof formSchema>) {
    createFlavor(cleanFormData(values))
  }

  return (
    <Form {...form}>
      {data?.length && data?.length > 0 ? <FormLabel>Existing Flavors</FormLabel> : null}
      {data?.map((flavor: FlavorListItem) => (
        <div key={flavor.id} className="h-10 pl-2 flex items-center text-sm gap-1">
          {flavor.name} - {flavor.flavor_group__name}
        </div>
      ))}
      <form className="items-center gap-4 grid grid-cols-9">
        <div className="col-span-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel className="text-sm">Add New Flavor</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter flavor name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-4">
          <div className="mt-10">
            <SelectFromApiFormField
              form={form}
              name="flavor_group"
              placeholder="Select a flavor group"
              loadOptionsApi={flavorGroupsApi.endpoints.getFlavorGroupsDropdown.initiate}
              fieldsForDropdownLabel={["name"]}
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

export default AddFlavorForm
