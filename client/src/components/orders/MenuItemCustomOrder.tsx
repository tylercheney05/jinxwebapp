import { useGetMenuItemDetailQuery } from "services/menuitems"
import { UseFormReturn } from "react-hook-form"
import { useEffect } from "react"
import { useDidMountEffect } from "utils/SharedUtils"
import CustomOrderFlavorForm from "./CustomOrderFlavorForm"
import { useGetSodasListQuery } from "services/sodas"
import { useGetFlavorsListQuery } from "services/flavors"
import { MenuItem } from "types"

interface Props {
  menuItem: MenuItem
  form: UseFormReturn<any>
}

const MenuItemCustomOrder = ({ menuItem, form }: Props) => {
  const { data, isSuccess, refetch } = useGetMenuItemDetailQuery(
    { id: menuItem.id },
    { refetchOnMountOrArgChange: true }
  )
  const { data: sodaData, isSuccess: sodaIsSuccess } = useGetSodasListQuery({}, { refetchOnMountOrArgChange: true })
  const { data: flavorData } = useGetFlavorsListQuery(
    {
      ordering: "name",
    },
    { refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    if (isSuccess && sodaIsSuccess) {
      form.setValue("custom_order__soda", String(data.soda))
    }
  }, [isSuccess, sodaIsSuccess, form.watch("cup")])

  useEffect(() => {
    if (isSuccess) {
      const newData: any[] = []
      // Wrap the loop in an async function
      const updateFlavorsAsync = async () => {
        for (const flavor of data.flavors) {
          newData.unshift(flavor.flavor)
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

  return <CustomOrderFlavorForm form={form} sodaData={sodaData} flavorData={flavorData} />
}

export default MenuItemCustomOrder
