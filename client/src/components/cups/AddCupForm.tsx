import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { SIZE_OPTIONS } from "constants/CupConstants"
import { SelectFormField } from "../forminputs/Select"
import { Button } from "../ui/button"
import { PlusIcon } from "../Icons"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { cleanFormData } from "utils/FormUtils"
import { toast } from "react-toastify"
import { CupListItems } from "types/CupTypes"
import { useEffect, useState } from "react"
import { createCup, listCups } from "features/cups"

const AddCupForm = () => {
  const [cups, setCups] = useState<CupListItems>([])
  const dispatch = useDispatch<AppDispatch>()
  const formSchema = z.object({
    size: z.object({
      value: z.string().min(1, { message: "Size is required" }),
      label: z.string(),
    }),
    price: z.string().min(1, { message: "Price is required" }),
    conversion_factor: z.string().min(1, { message: "Conversion factor is required" }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: {
        value: "",
        label: "Select a size",
      },
      price: "",
      conversion_factor: "",
    },
  })

  useEffect(() => {
    dispatch(listCups()).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        setCups(data.payload)
      }
    })
  }, [])

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(createCup(cleanFormData(values))).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        form.reset()
        dispatch(listCups()).then((data) => setCups(data.payload))
        const notify = () => toast.success("Cup added successfully")
        notify()
      } else if (data.meta.requestStatus === "rejected") {
        try {
          Object.entries(data.payload as Record<string, Array<string>>).map(([key, value]) => {
            form.setError(key as any, {
              type: "custom",
              message: value.join("\n"),
            })
          })
        } catch {
          try {
            const notify = () => toast.error(data.payload.error.message)
            notify()
          } catch {
            const notify = () => toast.error("Something went wrong")
            notify()
          }
        }
      }
    })
  }

  return (
    <Form {...form}>
      {cups.length > 0 ? <FormLabel>Existing Cups</FormLabel> : null}
      {cups.map((cup) => (
        <div key={cup.id} className="h-10 pl-2 flex items-center text-sm gap-1">
          {cup.size__display} - ${cup.price}
        </div>
      ))}
      <form className="items-center gap-4 grid grid-cols-10">
        <div className="col-span-3">
          <SelectFormField
            form={form}
            name="size"
            placeholder="Select a size"
            options={SIZE_OPTIONS}
            label="Add New Cup"
          />
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
        <div className="col-span-3">
          <div className="mt-10">
            <FormField
              control={form.control}
              name="conversion_factor"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormControl>
                    <Input type="number" {...field} placeholder="Enter conversion factor" />
                  </FormControl>
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

export default AddCupForm
