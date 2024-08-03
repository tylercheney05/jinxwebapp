import { useGetMenuItemDetailQuery } from "services/menuitems"
import { MenuItemListItem } from "types/MenuItemTypes"
import { Form, FormField, FormLabel, FormMessage } from "../ui/form"
import { UseFormReturn } from "react-hook-form"
import { SelectFromApiFormField } from "../forminputs/Select"
import { sodasApi } from "services/sodas"
import { useEffect, useState } from "react"
import { ItemFlavorFormField } from "../shared/ItemFormFields"
import { useDidMountEffect } from "utils/SharedUtils"

interface Props {
  menuItem: MenuItemListItem
  form: UseFormReturn<any>
}

const CustomOrderFlavorForm = ({ menuItem, form }: Props) => {
  const { data, isSuccess, refetch } = useGetMenuItemDetailQuery(
    { id: menuItem.id },
    { refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    if (isSuccess) {
      form.setValue("custom_order__soda", {
        value: data.soda,
        label: data.soda__name,
      })
      const newData = [
        {
          flavor: {
            value: 0,
            label: "Select a flavor",
          },
          quantity: "",
        },
      ]
      // Wrap the loop in an async function
      const updateFlavorsAsync = async () => {
        for (const flavor of data.flavors) {
          newData.unshift({
            flavor: {
              value: flavor.flavor,
              label: flavor.flavor__name,
            },
            quantity: String(flavor.cup_quantities[form.watch("cup")]),
          })
          form.setValue("custom_order_flavors", newData)
          await new Promise((resolve) => setTimeout(resolve, 250)) // Wait for half a second after setting the value
        }
      }

      // Call the async function
      updateFlavorsAsync().catch(console.error) // Handle any potential errors
    }
  }, [isSuccess, form.watch("cup")])

  useDidMountEffect(() => {
    refetch()
  }, [form.watch("cup")])

  return (
    <Form {...form}>
      <form>
        <div className="flex flex-col gap-4">
          <div>
            <SelectFromApiFormField
              form={form}
              name="custom_order__soda"
              label="Soda"
              placeholder="Select a Soda"
              loadOptionsApi={sodasApi.endpoints.getSodasDropdown.initiate}
              fieldsForDropdownLabel={["name"]}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="custom_order_flavors"
              render={() => (
                <>
                  <FormLabel>Flavors</FormLabel>
                  <div className="flex flex-col gap-4 mt-2">
                    {form.watch("custom_order_flavors").map((flavor: object, index: number) => {
                      return (
                        <ItemFlavorFormField key={index} form={form} index={index} fieldName="custom_order_flavors" />
                      )
                    })}
                  </div>
                  <FormMessage />
                </>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}

export default CustomOrderFlavorForm
