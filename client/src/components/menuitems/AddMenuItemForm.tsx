import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { SelectFromApiFormField } from "../forminputs/Select"
import { Button } from "../ui/button"
import { cleanFormData } from "utils/FormUtils"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { ItemFlavorFormField, cleanFlavorsData } from "../shared/ItemFormFields"
import { SodaListItem } from "types/SodaTypes"
import ListMenuItems from "./ListMenuItems"
import { useCreateMenuItemMutation } from "services/menuitems"
import { sodasApi, useGetSodasListQuery } from "services/sodas"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { limitedTimePromosApi, useGetLimitedTimePromosListQuery } from "services/limitedtimepromos"
import { LimitedTimePromoListItem } from "/types/LimitedTimePromoTypes"

const AddMenuItemForm = () => {
  const [isLimitedTime, setIsLimitedTime] = useState<boolean>(false)
  const [manualPrice, setManualPrice] = useState<boolean>(false)
  const [createMenuItem, result] = useCreateMenuItemMutation()
  const { data: sodaData } = useGetSodasListQuery({}, { refetchOnMountOrArgChange: true })
  const { data: limitedTimePromosData } = useGetLimitedTimePromosListQuery(
    { is_archived: false },
    { refetchOnMountOrArgChange: true }
  )
  const [resetSodas, setResetSodas] = useState<boolean>(false)
  const formSchema = z
    .object({
      name: z.string().min(1, { message: "Name is required" }),
      soda: z.object({
        value: z.number().int(),
        label: z.string(),
      }),
      menu_item_flavors: z.array(
        z.object({
          flavor: z.object({
            value: z.number().int(),
            label: z.string(),
          }),
          quantity: z.string(),
        })
      ),
      limited_time_promo: z.object({
        value: z.number().int(),
        label: z.string(),
      }),
      price: z
        .object({
          price: z.string().min(1, { message: "Price is required" }),
        })
        .nullable(),
    })
    .superRefine((val, ctx) => {
      if (val.menu_item_flavors.length < 2) {
        return ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["menu_item_flavors"],
          message: "Please add at least 1 flavors",
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
      menu_item_flavors: [
        {
          flavor: {
            value: 0,
            label: "Select a flavor",
          },
          quantity: "",
        },
      ],
      limited_time_promo: {
        value: 0,
        label: "Select a limited time promo",
      },
      price: null,
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
    updatedValues = cleanFlavorsData(updatedValues, "menu_item_flavors")
    updatedValues = cleanPriceData(updatedValues)
    createMenuItem(cleanFormData(updatedValues))
  }

  return (
    <Form {...form}>
      {sodaData?.length && sodaData?.length > 0 ? <FormLabel className="text-md">Existing Menu Items</FormLabel> : null}
      <div>
        {sodaData?.map((soda: SodaListItem) => (
          <div key={soda.id}>
            <div className="grid grid-cols-5 items-center">
              <div className="bg-black h-1 col-span-2 rounded-sm"></div>
              <div className="text-center text-lg">{soda.name}</div>
              <div className="bg-black h-1 col-span-2 rounded-sm"></div>
            </div>
            <div className="my-2">
              <ListMenuItems soda={soda} resetSodas={resetSodas} setResetSodas={setResetSodas} />
            </div>
          </div>
        ))}
        {limitedTimePromosData?.length && limitedTimePromosData?.length > 0
          ? limitedTimePromosData?.map((promo: LimitedTimePromoListItem) => (
              <div key={promo.id}>
                <div className="grid grid-cols-5 items-center">
                  <div className="bg-black h-1 col-span-2 rounded-sm"></div>
                  <div className="text-center text-lg">{promo.name}</div>
                  <div className="bg-black h-1 col-span-2 rounded-sm"></div>
                </div>
                <div className="my-2">
                  <ListMenuItems promo={promo} resetSodas={resetSodas} setResetSodas={setResetSodas} />
                </div>
              </div>
            ))
          : null}
      </div>
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
            name="menu_item_flavors"
            render={() => (
              <>
                <FormLabel>Flavors</FormLabel>
                {form.watch("menu_item_flavors").map((flavor, index) => (
                  <ItemFlavorFormField key={index} form={form} index={index} fieldName="menu_item_flavors" />
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
              name="limited_time_promo"
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
        <div>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Add Menu Item
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddMenuItemForm
