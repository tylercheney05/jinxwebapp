import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { PlusIcon } from "../Icons"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { createFlavorGroup, listFlavorGroups } from "features/flavors"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { FlavorGroupListItems } from "/types/FlavorTypes"
import { SelectFormField } from "../forminputs/Select"
import { UOM_OPTIONS } from "constants/FlavorConstants"
import { cleanFormData } from "utils/FormUtils"

const AddFlavorGroupForm = () => {
  const [flavorGroups, setFlavorGroups] = useState<FlavorGroupListItems>([])
  const dispatch = useDispatch<AppDispatch>()
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
    dispatch(listFlavorGroups()).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        setFlavorGroups(data.payload)
      }
    })
  }, [])

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(createFlavorGroup(cleanFormData(values))).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        form.reset()
        dispatch(listFlavorGroups()).then((data) => setFlavorGroups(data.payload))
        const notify = () => toast.success("Flavor group added successfully")
        notify()
      } else if (data.meta.requestStatus === "rejected") {
        const notify = () => toast.error(data.payload.error.message)
        notify()
      }
    })
  }

  return (
    <Form {...form}>
      {flavorGroups.length > 0 ? <FormLabel>Existing Flavor Groups</FormLabel> : null}
      {flavorGroups.map((flavorGroup) => (
        <div key={flavorGroup.id} className="h-10 pl-2 flex items-center text-sm gap-1">
          {flavorGroup.name} - ${flavorGroup.price} per {flavorGroup.uom__display}
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
