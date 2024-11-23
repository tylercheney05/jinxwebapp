import { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { SodaListItem, SodaListItems } from "types/SodaTypes"
import { FlavorListItems } from "/types/FlavorTypes"
import { Checkbox } from "../ui/checkbox"

interface Props {
  form: UseFormReturn<any>
  sodaData: SodaListItems | undefined
  flavorData: FlavorListItems | undefined
}

const CustomOrderFlavorForm = ({ form, sodaData, flavorData }: Props) => {
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
                  {sodaData?.length &&
                    sodaData?.length > 0 &&
                    sodaData.map((soda: SodaListItem) => (
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
      <FormField
        control={form.control}
        name="items"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>Flavors</FormLabel>
            </div>
            {flavorData &&
              flavorData.map((flavor) => (
                <FormField
                  key={flavor.id}
                  control={form.control}
                  name="custom_order_flavors"
                  render={({ field }) => {
                    return (
                      <FormItem key={flavor.id} className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(flavor.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, flavor.id])
                                : field.onChange(field.value?.filter((value: any) => value !== flavor.id))
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{flavor.name}</FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default CustomOrderFlavorForm
