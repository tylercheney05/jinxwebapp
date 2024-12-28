import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { DiscountListItem } from "types/DiscountTypes"
import { useCreateDiscountMutation, useGetDiscountsListQuery } from "services/discounts"
import { cleanFormData, handleFormSubmitResponse } from "utils/FormUtils"
import { useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Switch } from "../ui/switch"
import { SelectFromApiFormField } from "../forminputs/Select"
import { cupsApi } from "services/cups"

const AddDiscountForm = () => {
  const [createDiscount, result] = useCreateDiscountMutation()
  const { data, refetch } = useGetDiscountsListQuery({}, { refetchOnMountOrArgChange: true })
  const formSchema = z
    .object({
      name: z.string().min(1, { message: "Name is required" }),
      code: z.string().min(1, { message: "Code is required" }),
      percent_or_price: z.enum(["percent", "price"], { message: "Discount type must be either 'percent' or 'price'" }),
      percent: z.number().optional(),
      price: z.number().optional(),
      is_cup_specific: z.boolean(),
      cup: z.object({
        value: z.number(),
        label: z.string(),
      }),
    })
    .refine(
      (data) => {
        if (data.percent_or_price === "percent") {
          return data.percent !== undefined
        } else if (data.percent_or_price === "price") {
          return data.price !== undefined
        }
        return true
      },
      {
        message: "Either percent or price must be provided based on the discount type",
        path: ["percent_or_price"], // This will show the error message at the percent_or_price field
      }
    )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      percent_or_price: "percent",
      is_cup_specific: false,
      cup: {
        value: 0,
        label: "Select a cup",
      },
    },
  })

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Discount added successfully", "post", refetch)
  }, [result])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.percent_or_price === "percent") {
      values.percent = values.percent && values.percent / 100
    }
    createDiscount(cleanFormData(values))
  }

  useEffect(() => {
    form.getValues("percent_or_price") === "percent"
      ? form.setValue("price", undefined)
      : form.setValue("percent", undefined)
  }, [form.watch("percent_or_price")])

  return (
    <Form {...form}>
      {data?.length && data?.length > 0 ? <FormLabel>Existing Discounts</FormLabel> : null}
      {data?.map((discount: DiscountListItem) => (
        <div key={discount.id} className="h-10 pl-2 flex items-center text-sm gap-1">
          {discount.name}
        </div>
      ))}
      <form>
        <div className="items-center gap-4 grid grid-cols-12">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Add New Discount</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter discount name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-4">
            <div className="mt-10">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormControl>
                      <Input {...field} placeholder="Enter discount code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="col-span-4">
            <div className="mt-10">
              <FormField
                control={form.control}
                name="percent_or_price"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="percent" />
                          </FormControl>
                          <FormLabel className="font-normal">Percent</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="price" />
                          </FormControl>
                          <FormLabel className="font-normal">Price</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        {form.watch("percent_or_price") === "percent" ? (
          <div className="items-center gap-4 grid grid-cols-12">
            <div className="col-span-4">
              <FormField
                control={form.control}
                name="percent"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormControl>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          placeholder="Enter discount percent"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="whitespace-nowrap mt-2">% off</div>
          </div>
        ) : (
          <div className="items-center gap-4 grid grid-cols-12">
            <div className="col-span-4 flex items-center gap-2">
              <div className="mt-2">$</div>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormControl>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          placeholder="Enter discount price"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        <FormField
          control={form.control}
          name="is_cup_specific"
          render={({ field }) => (
            <FormItem className="mt-2">
              <div>
                <FormLabel>Is this discount cup specific?</FormLabel>
              </div>
              <FormControl>
                <Switch className="mt-0" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        {form.watch("is_cup_specific") && (
          <div className="mb-2">
            <SelectFromApiFormField
              form={form}
              name="cup"
              placeholder="Select a cup"
              loadOptionsApi={cupsApi.endpoints.getCupDropdown.initiate}
              fieldsForDropdownLabel={["size__display"]}
              label="Select a cup"
            />
          </div>
        )}
        <div>
          <Button type="submit" className="mt-2" onClick={form.handleSubmit(onSubmit)}>
            Add Discount
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddDiscountForm
