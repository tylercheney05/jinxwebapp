import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { SelectFromApiFormField } from "../forminputs/Select"
import { useDispatch } from "react-redux"
import { dropdownSodas } from "features/sodas"
import { AppDispatch } from "store"
import { Button } from "../ui/button"
import { PlusIcon } from "../Icons"
import { createMenuItem, listMenuItems } from "features/menuitems"
import { cleanFormData } from "utils/FormUtils"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { MenuItemListItems } from "types/MenuItemTypes"
import { MenuItemFlavorFormField } from "./MenuItemFormFields"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const AddMenuItemForm = () => {
  const [menuitems, setMenuItems] = useState<MenuItemListItems>([])
  const dispatch = useDispatch<AppDispatch>()
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
    },
  })

  useEffect(() => {
    dispatch(listMenuItems()).then((data) => setMenuItems(data.payload))
  }, [])

  const cleanFlavorsData = (values: z.infer<typeof formSchema>) => {
    let updatedValues: any = { ...values } // Create a shallow copy to avoid mutating the original object
    updatedValues["menu_item_flavors"] = values.menu_item_flavors
      .filter((flavor) => flavor.flavor.value !== 0) // Filter out flavors with value 0
      .map((flavor) => {
        return {
          flavor: flavor.flavor.value,
          quantity: flavor.quantity,
        }
      }) // Transform the array to contain just the value
    return updatedValues
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    let updatedValues = values
    updatedValues = cleanFlavorsData(updatedValues)
    dispatch(createMenuItem(cleanFormData(updatedValues))).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        form.reset()
        dispatch(listMenuItems()).then((data) => setMenuItems(data.payload))
        const notify = () => toast.success("Menu Item added successfully")
        notify()
      } else if (data.meta.requestStatus === "rejected") {
        const notify = () => toast.error(data.payload.error.message)
        notify()
      }
    })
  }

  return (
    <Form {...form}>
      {menuitems.length > 0 ? <FormLabel className="text-md">Existing Menu Items</FormLabel> : null}
      <div className="pl-2 mt-2 flex items-center flex-wrap text-sm gap-4">
        {menuitems.map((menuitem) => (
          <Card key={menuitem.id} className="min-h-[180px] w-[240px]">
            <CardHeader className="px-6 pt-4 pb-2">
              <CardTitle className="text-sm">{menuitem.name}</CardTitle>
              <CardDescription>{menuitem.soda__name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                {menuitem.flavors.map((flavor) => (
                  <div>
                    {flavor.quantity} {flavor.flavor__flavor_group__uom__display} of {flavor.flavor__name}
                  </div>
                ))}
              </div>
              <div className="text-jinxBlue flex gap-4 mt-2">
                {Object.entries(menuitem.cup_prices).map(([key, value]) => (
                  <div>
                    <div>{key}</div>
                    <strong>${parseFloat(value).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
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
              loadOptionsApi={dropdownSodas}
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
                  <MenuItemFlavorFormField key={index} form={form} index={index} />
                ))}
                <FormMessage />
              </>
            )}
          />
        </div>
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
