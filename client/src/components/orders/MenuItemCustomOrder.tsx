import { useGetMenuItemDetailQuery } from "services/menuitems"
import { MenuItemListItem } from "types/MenuItemTypes"
import { UseFormReturn } from "react-hook-form"
import { useEffect } from "react"
import { useDidMountEffect } from "utils/SharedUtils"
import CustomOrderFlavorForm from "./CustomOrderFlavorForm"

interface Props {
  menuItem: MenuItemListItem
  form: UseFormReturn<any>
}

const MenuItemCustomOrder = ({ menuItem, form }: Props) => {
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

  return <CustomOrderFlavorForm form={form} />
}

export default MenuItemCustomOrder
