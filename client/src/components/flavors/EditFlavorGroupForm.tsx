import { z } from "zod"
import { FlavorGroupListItem } from "types/FlavorTypes"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useUpdateFlavorGroupMutation } from "services/flavors"
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query"
import { Input } from "../ui/input"
import { SelectFormField } from "../forminputs/Select"
import { Button } from "../ui/button"
import { cleanFormData, handleFormSubmitResponse } from "utils/FormUtils"
import { UOM_OPTIONS } from "utils/constants/FlavorConstants"
import { useEffect } from "react"

interface Props {
  flavorGroup: FlavorGroupListItem
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      | {
          name?: string
          uom?: string
          price?: number
        }
      | undefined,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      any,
      "cupsApi"
    >
  >
}

const EditFlavorGroupForm = ({ flavorGroup, refetch }: Props) => {
  const [updateFlavorGroup, result] = useUpdateFlavorGroupMutation()

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
      name: flavorGroup.name,
      uom: {
        value: flavorGroup.uom,
        label: flavorGroup.uom__display,
      },
      price: String(flavorGroup.price),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("flavorGroup", flavorGroup)
    updateFlavorGroup({ id: flavorGroup.id, ...cleanFormData(values) })
  }

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Flavor group updated successfully", "put", refetch)
  }, [result])

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <div>
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
        <div>
          <SelectFormField form={form} name="uom" placeholder="Select a unit of measure" options={UOM_OPTIONS} />
        </div>
        <div>
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
        <div>
          <Button type="submit" className="mt-2" onClick={form.handleSubmit(onSubmit)}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EditFlavorGroupForm
