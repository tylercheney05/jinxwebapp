import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { PlusIcon } from "../Icons"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { createFlavor, listFlavors } from "features/flavors"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { FlavorListItems } from "/types/FlavorTypes"

const AddFlavorForm = () => {
  const [flavors, setFlavors] = useState<FlavorListItems>([])
  const dispatch = useDispatch<AppDispatch>()
  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    dispatch(listFlavors()).then((data) => setFlavors(data.payload))
  }, [])

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(createFlavor(values)).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        form.reset()
        dispatch(listFlavors()).then((data) => setFlavors(data.payload))
        const notify = () => toast.success("Flavor added successfully")
        notify()
      } else if (data.meta.requestStatus === "rejected") {
        const notify = () => toast.error(data.payload.error.message)
        notify()
      }
    })
  }

  return (
    <Form {...form}>
      {flavors.length > 0 ? <FormLabel>Existing Flavors</FormLabel> : null}
      {flavors.map((flavor) => (
        <div key={flavor.id} className="h-10 pl-2 flex items-center text-sm gap-1">
          {flavor.name}
        </div>
      ))}
      <form className="items-center gap-4 grid grid-cols-5">
        <div className="col-span-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel className="text-sm">Add New Flavor</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Flavor Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

export default AddFlavorForm
