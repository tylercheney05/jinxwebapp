import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { PlusIcon } from "../Icons"
import { useEffect } from "react"
import { handleFormSubmitResponse } from "utils/FormUtils"
import { useCreateLimitedTimePromoMutation, useGetLimitedTimePromosListQuery } from "services/limitedtimepromos"
import { LimitedTimePromoListItem } from "types/LimitedTimePromoTypes"

const AddLimitedTimePromoForm = () => {
  const [createLimitedTimePromo, result] = useCreateLimitedTimePromoMutation()
  const { data, refetch } = useGetLimitedTimePromosListQuery({}, { refetchOnMountOrArgChange: true })
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
    handleFormSubmitResponse(result, form, "Limited time promo added successfully", refetch)
  }, [result])

  function onSubmit(values: z.infer<typeof formSchema>) {
    createLimitedTimePromo(values)
  }

  return (
    <Form {...form}>
      {data?.length && data?.length > 0 ? <FormLabel>Existing Limited Time Promos</FormLabel> : null}
      {data?.map((limitedTimePromo: LimitedTimePromoListItem) => (
        <div key={limitedTimePromo.id} className="h-10 pl-2 flex items-center text-sm gap-1">
          {limitedTimePromo.name}
        </div>
      ))}
      <form className="items-center gap-4 grid grid-cols-10">
        <div className="col-span-9">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Add New Limited Time Promo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter limited time promo name" />
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

export default AddLimitedTimePromoForm
