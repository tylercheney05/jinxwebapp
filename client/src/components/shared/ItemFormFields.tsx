import { useEffect, useState } from "react"
import { convertToOptions } from "utils/FormUtils"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { SelectInput } from "../forminputs/Select"
import { Input } from "../ui/input"
import { FormField } from "../ui/form"
import { UseFormReturn } from "react-hook-form"
import { flavorsApi } from "services/flavors"
import { z } from "zod"

interface FlavorFormFieldProps {
  field: any
  index: number
}

interface ItemFlavorFormFieldProps {
  form: UseFormReturn<any>
  index: number
  fieldName: string
}

const ItemFlavorFormField = ({ form, index, fieldName }: ItemFlavorFormFieldProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [uom, setUom] = useState<string>("")

  useEffect(() => {
    form.watch((value, { name, type }) => {
      if (
        name === fieldName &&
        form.watch(fieldName).length > 0 &&
        form.watch(fieldName)[index] &&
        form.watch(fieldName)[index].flavor &&
        form.watch(fieldName)[index].flavor.value
      ) {
        dispatch(flavorsApi.endpoints.getFlavorDetail.initiate({ id: form.watch(fieldName)[index].flavor.value })).then(
          (data: any) => {
            if (data.status === "fulfilled") {
              setUom(`${data.data.flavor_group__uom__display}(s)`)
            }
          }
        )
      }
    })
  }, [form.watch])

  return (
    <FormField
      key={index}
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <div className={`grid ${uom ? "grid-cols-5" : "grid-cols-4"} gap-4`}>
          <div className="col-span-2">
            <FlavorFormField field={field} index={index} />
          </div>
          <div className="col-span-2">
            <QuantityFormField field={field} index={index} />
          </div>
          <div className="text-sm flex items-center">{uom}</div>
        </div>
      )}
    />
  )
}
ItemFlavorFormField.displayName = "ItemFlavorFormField"

const FlavorFormField = ({ field, index }: FlavorFormFieldProps) => {
  const dispatch = useDispatch<AppDispatch>()

  // Use this component if <select> uses an API to generate <options>
  // All options will populate onFocus
  const [options, setOptions] = useState<Array<object>>([])
  const [loading, setLoading] = useState(false)

  const loadOptions = () => {
    // @ts-ignore
    dispatch(flavorsApi.endpoints.getFlavorsDropdown.initiate()).then((response: any) => {
      if (response.status === "fulfilled") {
        let options = convertToOptions(response.data.results, ["name"])
        setOptions(options)
      } else {
        setOptions([])
      }
    })
    setLoading(false)
  }

  const handleOnFocus = () => {
    setLoading(true)
    loadOptions()
  }

  return (
    <SelectInput
      placeholder="Select a flavor"
      options={options}
      onFocus={handleOnFocus}
      value={field.value[index].flavor}
      onChange={(val) => {
        if (val !== null) {
          const updatedValues = [
            ...field.value,
            {
              flavor: {
                value: 0,
                label: "Select a flavor",
              },
              quantity: "",
            },
          ]
          updatedValues[index] = {
            flavor: {
              value: val.value,
              label: val.label,
            },
          }
          return field.onChange(updatedValues)
        } else {
          const updatedValues = field.value
          updatedValues.splice(index, 1)
          return field.onChange(updatedValues)
        }
      }}
      isLoading={loading}
      isClearable={index > 0}
    />
  )
}
FlavorFormField.displayName = "FlavorFormField"

const QuantityFormField = ({ field, index }: FlavorFormFieldProps) => {
  return (
    <Input
      type="number"
      placeholder="Enter quantity"
      value={field.value[index].quantity}
      onChange={(val) => {
        const updatedValues = [...field.value]
        updatedValues[index] = {
          ...updatedValues[index],
          quantity: val.target.value,
        }
        return field.onChange(updatedValues)
      }}
    />
  )
}
QuantityFormField.displayName = "QuantityFormField"

const cleanFlavorsData = (values: any, fieldName: string) => {
  let updatedValues: any = { ...values } // Create a shallow copy to avoid mutating the original object
  updatedValues[fieldName] = values[fieldName]
    .filter((flavor: any) => flavor.flavor.value !== 0) // Filter out flavors with value 0
    .map((flavor: any) => {
      return {
        flavor: flavor.flavor.value,
        quantity: flavor.quantity,
      }
    }) // Transform the array to contain just the value
  return updatedValues
}

export { FlavorFormField, QuantityFormField, ItemFlavorFormField, cleanFlavorsData }
