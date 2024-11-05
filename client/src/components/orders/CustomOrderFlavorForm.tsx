import { Controller, UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { ItemFlavorFormField } from "../shared/ItemFormFields"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { SodaListItem, SodaListItems } from "types/SodaTypes"

interface Props {
  form: UseFormReturn<any>
  data: SodaListItems | undefined
}

const CustomOrderFlavorForm = ({ form, data }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FormField
          control={form.control}
          name="custom_order__soda"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Soda</FormLabel>
              <FormControl>
                <RadioGroup
                  {...field}
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  {data?.length &&
                    data?.length > 0 &&
                    data.map((soda: SodaListItem) => (
                      <FormItem key={soda.id} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={String(soda.id)} />
                        </FormControl>
                        <FormLabel className="font-normal">{soda.name}</FormLabel>
                      </FormItem>
                    ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={form.control}
          name="custom_order_flavors"
          render={() => (
            <>
              <FormLabel>Flavors</FormLabel>
              <div className="flex flex-col gap-4 mt-2">
                {form.watch("custom_order_flavors").map((flavor: object, index: number) => {
                  return <ItemFlavorFormField key={index} form={form} index={index} fieldName="custom_order_flavors" />
                })}
              </div>
              <FormMessage />
            </>
          )}
        />
      </div>
    </div>
  )
}

export default CustomOrderFlavorForm
