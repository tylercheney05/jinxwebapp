import { UseFormReturn } from "react-hook-form"
import { SelectFromApiFormField } from "../forminputs/Select"
import { sodasApi } from "services/sodas"
import { FormField, FormLabel, FormMessage } from "../ui/form"
import { ItemFlavorFormField } from "../shared/ItemFormFields"

interface Props {
  form: UseFormReturn<any>
}

const CustomOrderFlavorForm = ({ form }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <SelectFromApiFormField
          form={form}
          name="custom_order__soda"
          label="Soda"
          placeholder="Select a Soda"
          loadOptionsApi={sodasApi.endpoints.getSodasDropdown.initiate}
          fieldsForDropdownLabel={["name"]}
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
