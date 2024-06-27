import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { PlusIcon } from "../Icons"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { createSoda, listSodas } from "features/sodas"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { SodaListItems } from "/types/SodaTypes"

const AddSodaForm = () => {
  const [sodas, setSodas] = useState<SodaListItems>([])
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
    dispatch(listSodas()).then((data) => setSodas(data.payload))
  }, [])

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(createSoda(values)).then((data) => {
      if (data.meta.requestStatus === "fulfilled") {
        form.reset()
        dispatch(listSodas()).then((data) => setSodas(data.payload))
        const notify = () => toast.success("Soda added successfully")
        notify()
      } else if (data.meta.requestStatus === "rejected") {
        const notify = () => toast.error(data.payload.error.message)
        notify()
      }
    })
  }

  return (
    <Form {...form}>
      {sodas.length > 0 ? <FormLabel>Existing Sodas</FormLabel> : null}
      {sodas &&
        sodas.map((soda) => (
          <div key={soda.id} className="h-10 pl-2 flex items-center text-sm gap-1">
            {soda.name}
          </div>
        ))}
      <form className="items-center gap-4 grid grid-cols-5">
        <div className="col-span-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Add New Soda</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Soda Brand Name" />
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

export default AddSodaForm
