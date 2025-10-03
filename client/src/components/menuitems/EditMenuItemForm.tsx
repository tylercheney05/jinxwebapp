import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "components/ui"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MenuItem } from "types"
import { z } from "zod"
import { SelectFromApiFormField } from "components/shared"
import { sodasApi } from "services"
import { menuItemsApi } from "services/menuitems"
import { cleanFormData, handleFormSubmitResponse } from "utils/FormUtils"
import { useEffect } from "react"
import { Refetch } from "/types/shared"
import { Switch } from "../ui/switch"

interface Props {
  obj: MenuItem
  refetch: Refetch
}

const EditMenuItemForm = ({ obj, refetch }: Props) => {
  const [partialUpdateMenuItem, result] = menuItemsApi.usePartialUpdateMenuItemMutation()

  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    soda: z.object({
      value: z.number().int(),
      label: z.string(),
    }),
    is_archived: z.boolean(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: obj.name,
      soda: {
        value: obj.soda.id,
        label: obj.soda.name,
      },
      is_archived: obj.is_archived,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    partialUpdateMenuItem({ id: obj.id, data: cleanFormData(values) })
  }

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Menu item updated successfully", "patch", refetch)
  }, [result])

  return (
    <Form {...form}>
      <div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel className="text-sm">Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Menu Item Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <SelectFromApiFormField
          form={form}
          name="soda"
          label="Soda"
          placeholder="Select a Soda"
          loadOptionsApi={sodasApi.endpoints.getSodasDropdown.initiate}
          fieldsForDropdownLabel={["name"]}
        />
      </div>
      <FormField
        control={form.control}
        name="is_archived"
        render={({ field }) => (
          <FormItem className="mt-2">
            <div>
              <FormLabel>Is this menu item archived?</FormLabel>
            </div>
            <FormControl>
              <Switch className="mt-0" checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      <div>
        <Button type="submit" className="mt-4" onClick={form.handleSubmit(onSubmit)}>
          Save
        </Button>
      </div>
    </Form>
  )
}

export default EditMenuItemForm
