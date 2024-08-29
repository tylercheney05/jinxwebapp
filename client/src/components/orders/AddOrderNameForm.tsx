import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { PlusIcon } from "../Icons"
import { useCreateOrderNameMutation, useGetOrderNameListQuery } from "services/orders"
import { OrderNameItem } from "types/OrderTypes"
import { handleFormSubmitResponse } from "utils/FormUtils"
import { useEffect } from "react"

const AddOrderNameForm = () => {
  const [createOrderName, result] = useCreateOrderNameMutation()
  const { data, refetch } = useGetOrderNameListQuery({}, { refetchOnMountOrArgChange: true })
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
    handleFormSubmitResponse(result, form, "Order Name added successfully", refetch)
  }, [result])

  function onSubmit(values: z.infer<typeof formSchema>) {
    createOrderName(values)
  }

  return (
    <Form {...form}>
      {data?.length && data?.length > 0 ? <FormLabel>Existing Order Names</FormLabel> : null}
      {data?.map((orderName: OrderNameItem) => (
        <div key={orderName.id} className="h-10 pl-2 flex items-center text-sm gap-1">
          {orderName.name}
        </div>
      ))}
      <form className="items-center gap-4 grid grid-cols-10">
        <div className="col-span-9">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Add Order Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter order name" />
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

export default AddOrderNameForm
