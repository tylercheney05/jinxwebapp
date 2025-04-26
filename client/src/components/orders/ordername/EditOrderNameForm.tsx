import { z } from "zod"
import { useUpdateOrderNameMutation } from "services/orders"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OrderNameItem } from "types/OrderTypes"
import { cleanFormData, handleFormSubmitResponse } from "utils/FormUtils"
import { useEffect } from "react"
import { BaseQueryFn, FetchBaseQueryError, QueryActionCreatorResult } from "@reduxjs/toolkit/query"
import { QueryDefinition } from "@reduxjs/toolkit/query"
import { FetchArgs } from "@reduxjs/toolkit/query"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "components/ui/form"
import { Input } from "components/ui/input"
import { Button } from "components/ui/button"

interface Props {
  orderName: OrderNameItem
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      | {
          name?: string
        }
      | undefined,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      any,
      "orderNameApi"
    >
  >
}

const EditOrderNameForm = ({ orderName, refetch }: Props) => {
  const [updateOrderName, result] = useUpdateOrderNameMutation()

  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: orderName.name,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateOrderName({ id: orderName.id, ...cleanFormData(values) })
  }

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Order name updated successfully", "put", refetch)
  }, [result])

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <div>
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
        <div>
          <Button type="submit" className="mt-2" onClick={form.handleSubmit(onSubmit)}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EditOrderNameForm
