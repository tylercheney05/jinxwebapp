import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { limitedTimePromoFormSchema } from "utils/constants/LimitedTimePromoConstants"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { useEffect } from "react"
import { LimitedTimePromoListItem } from "/types/LimitedTimePromoTypes"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { useUpdateLimitedTimePromoMutation } from "services/limitedtimepromos"
import { cleanFormData, handleFormSubmitResponse } from "utils/FormUtils"
import { BaseQueryFn, FetchBaseQueryError, QueryActionCreatorResult } from "@reduxjs/toolkit/query"
import { QueryDefinition } from "@reduxjs/toolkit/query"
import { FetchArgs } from "@reduxjs/toolkit/query"

interface Props {
  limitedTimePromo: LimitedTimePromoListItem
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      | {
          is_archived?: boolean
        }
      | undefined,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      any,
      "limitedTimePromosApi"
    >
  >
}

const EditLimitedTimePromoForm = ({ limitedTimePromo, refetch }: Props) => {
  const [updateLimitedTimePromo, result] = useUpdateLimitedTimePromoMutation()
  const formSchema = z.object({
    name: limitedTimePromoFormSchema.name,
    is_archived: limitedTimePromoFormSchema.is_archived,
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: limitedTimePromo.name,
      is_archived: limitedTimePromo.is_archived,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateLimitedTimePromo({ id: limitedTimePromo.id, ...cleanFormData(values) })
  }

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Promotion updated successfully", "put", refetch)
  }, [result])

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter limited time promo name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_archived"
          render={({ field }) => (
            <FormItem className="mt-2">
              <div>
                <FormLabel>Is this promo archived?</FormLabel>
              </div>
              <FormControl>
                <Switch className="mt-0" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <div>
          <Button type="submit" className="mt-2" onClick={form.handleSubmit(onSubmit)}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EditLimitedTimePromoForm
