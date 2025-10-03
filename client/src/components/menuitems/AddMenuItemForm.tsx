import { useForm } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { SelectFromApiFormField } from "../shared/forminputs/Select"
import { cleanFormData } from "utils/FormUtils"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { ItemFlavorFormField } from "./ItemFormFields"
import { useCreateMenuItemMutation, useGetMenuItemsListQuery } from "services/menuitems"
import { sodasApi } from "services/sodas"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { limitedTimePromosApi } from "services/limitedtimepromos"
import { MenuItem } from "types"
import { cleanFlavorsData } from "utils/MenuItemUtils"
import { ListAndAddObject } from "../shared"
import EditMenuItemForm from "./EditMenuItemForm"
import { ArchivedIcon, CircleCheckIcon } from "../Icons"

const AddMenuItemForm = () => {
  const [isLimitedTime, setIsLimitedTime] = useState<boolean>(false)
  const [manualPrice, setManualPrice] = useState<boolean>(false)
  const [createMenuItem, result] = useCreateMenuItemMutation()
  const [resetSodas, setResetSodas] = useState<boolean>(false)

  const formSchema = z
    .object({
      name: z.string().min(1, { message: "Name is required" }),
      soda: z.object({
        value: z.number().int(),
        label: z.string(),
      }),
      flavors: z.array(
        z.object({
          flavor: z.object({
            value: z.number().int(),
            label: z.string(),
          }),
          quantity: z.string(),
        })
      ),
      limited_time_menu_item: z
        .object({
          limited_time_promo: z.object({
            value: z.number().int(),
            label: z.string(),
          }),
        })
        .nullable()
        .optional(),
      price: z
        .object({
          price: z.string().optional(),
        })
        .nullable()
        .optional(),
    })
    .superRefine((val, ctx) => {
      if (val.flavors.length < 2) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["flavors"],
          message: "Please add at least 1 flavor",
        })
      }
      if (isLimitedTime && !val.limited_time_menu_item?.limited_time_promo) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["limited_time_menu_item"],
          message: "Please select a limited time promo",
        })
      }
      if (manualPrice && !val.price) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["price"],
          message: "Please enter a price",
        })
      }
    })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      soda: {
        value: 0,
        label: "Select a Soda",
      },
      flavors: [
        {
          flavor: {
            value: 0,
            label: "Select a flavor",
          },
          quantity: "",
        },
      ],
    },
  })

  useEffect(() => {
    if (result.isSuccess) {
      form.reset()
      setResetSodas(true)
      setIsLimitedTime(false)
      setManualPrice(false)
      const notify = () => toast.success("Menu Item added successfully")
      notify()
    } else if (result.isError) {
      const notify = () => toast.error(result.data.message)
      notify()
    }
  }, [result])

  useEffect(() => {
    if (!manualPrice) {
      form.setValue("price", null)
    }
  }, [manualPrice])

  useEffect(() => {
    if (!isLimitedTime) {
      form.setValue("limited_time_menu_item", null)
    }
  }, [isLimitedTime])

  const cleanLimitedTimeMenuItemData = (values: any) => {
    if (!values.limited_time_menu_item) {
      return values
    }
    let updatedValues: any = { ...values } // Create a shallow copy to avoid mutating the original object
    updatedValues["limited_time_menu_item"] = {
      limited_time_promo: values.limited_time_menu_item.limited_time_promo.value,
    }
    return updatedValues
  }

  const cleanPriceData = (values: any) => {
    if (!values.price) {
      return values
    }
    let updatedValues: any = { ...values } // Create a shallow copy to avoid mutating the original object
    updatedValues["price"] = {
      price: values.price.price,
    }
    return updatedValues
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    let updatedValues = values
    updatedValues = cleanFlavorsData(updatedValues, "flavors")
    updatedValues = cleanLimitedTimeMenuItemData(updatedValues)
    updatedValues = cleanPriceData(updatedValues)
    createMenuItem(cleanFormData(updatedValues))
  }

  const objTxtFn = (item: MenuItem) => (
    <div key={item.id} className="h-10 pl-2 flex items-center text-sm gap-1 justify-between">
      <div className="flex gap-4 items-center">
        {item.is_archived ? (
          <div title={`${item.name} menu item is archived`}>
            <ArchivedIcon size="18px" />
          </div>
        ) : (
          <div title={`${item.name} menu item is active`}>
            <CircleCheckIcon size="18px" />
          </div>
        )}
        {item.name}
      </div>
    </div>
  )

  return (
    <ListAndAddObject
      form={form}
      title="Existing Menu Items"
      objTxtFn={objTxtFn}
      useGetObjectsListQuery={useGetMenuItemsListQuery}
      canEdit
      editFormTitle="Edit Menu Item"
      EditObjectFormComponent={EditMenuItemForm}
      onSubmit={onSubmit}
      result={result}
    >
      <form className="flex gap-4 flex-col">
        <div className="items-center gap-4 grid grid-cols-2">
          <div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel className="text-sm">Add Menu Item</FormLabel>
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
        </div>
        <div className="items-center gap-4 grid grid-cols-1">
          <FormField
            control={form.control}
            name="flavors"
            render={() => (
              <>
                <FormLabel>Flavors</FormLabel>
                {form.watch("flavors").map((flavor, index) => (
                  <ItemFlavorFormField key={index} form={form} index={index} fieldName="flavors" />
                ))}
                <FormMessage />
              </>
            )}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch checked={isLimitedTime} onCheckedChange={() => setIsLimitedTime(!isLimitedTime)} />
          <Label>Is this a limited-time flavor?</Label>
        </div>
        {isLimitedTime && (
          <div>
            <SelectFromApiFormField
              form={form}
              name="limited_time_menu_item.limited_time_promo"
              placeholder="Select a limited time promo"
              loadOptionsApi={limitedTimePromosApi.endpoints.getLimitedTimePromosDropdown.initiate}
              fieldsForDropdownLabel={["name"]}
            />
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Switch checked={manualPrice} onCheckedChange={() => setManualPrice(!manualPrice)} />
          <Label>Does this menu item have manual pricing?</Label>
        </div>
        {manualPrice && (
          <div className="mt-2">
            <FormField
              control={form.control}
              name="price.price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="ml-4">Price of 16 oz (not including cup price)</FormLabel>
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
        )}
      </form>
    </ListAndAddObject>
  )
}

export default AddMenuItemForm
