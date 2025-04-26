import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { EditIcon, PlusIcon } from "../../Icons"
import { useCreateOrderNameMutation, useGetOrderNameListQuery } from "services/orders"
import { OrderNameItem } from "types/OrderTypes"
import { handleFormSubmitResponse } from "utils/FormUtils"
import { useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "components/ui/sheet"
import EditOrderNameForm from "./EditOrderNameForm"
import DeleteOrderNameDialog from "./DeleteOrderNameDialog"

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
    handleFormSubmitResponse(result, form, "Order Name added successfully", "post", refetch)
  }, [result])

  function onSubmit(values: z.infer<typeof formSchema>) {
    createOrderName(values)
  }

  return (
    <Form {...form}>
      {data?.length && data?.length > 0 ? <FormLabel>Existing Order Names</FormLabel> : null}
      {data?.map((orderName: OrderNameItem) => (
        <div key={orderName.id} className="h-10 pl-2 flex items-center text-sm gap-1 justify-between">
          <div>{orderName.name}</div>
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger>
                <EditIcon className="cursor-pointer" size="18px" />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit Order Name</SheetTitle>
                  <SheetDescription>
                    Make changes to the {orderName.name} order name here. Click save when you're done.
                  </SheetDescription>
                </SheetHeader>
                <EditOrderNameForm orderName={orderName} refetch={refetch} />
              </SheetContent>
            </Sheet>
            <DeleteOrderNameDialog orderName={orderName} form={form} refetch={refetch} />
          </div>
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
