import { useEffect, useState } from "react"
import { convertToOptions } from "utils/FormUtils"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { SelectInput } from "../forminputs/Select"
import { Input } from "../ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { UseFormReturn } from "react-hook-form"
import { flavorsApi, useGetFlavorsListQuery } from "services/flavors"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { cupsApi, useGetCupsListQuery } from "services/cups"
import { Textarea } from "../ui/textarea"
import { Separator } from "../ui/separator"
import { MenuItemSummary } from "/types/menuItem"
import { CupSummary } from "/types/cup"

interface FlavorFormFieldProps {
  field: any
  index: number
  form: UseFormReturn<any>
}

interface QuantityFormFieldProps {
  field: any
  index: number
}

interface ItemFlavorFormFieldProps {
  form: UseFormReturn<any>
  index: number
  fieldName: string
}

interface FormProps {
  form: UseFormReturn<any>
}

interface PriceProps {
  menuItem?: MenuItemSummary
  form: UseFormReturn<any>
  isCustomized: boolean
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
          (data) => {
            if (data.status === "fulfilled") {
              setUom(`${data.data.flavor_group.uom.display}(s)`)
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
        <div className="flex flex-wrap gap-2">
          <div>
            <FlavorFormField field={field} index={index} form={form} />
          </div>
          <div>
            <QuantityFormField field={field} index={index} />
          </div>
          <div className="text-sm flex items-center">{uom}</div>
          <Separator className="mt-2" />
        </div>
      )}
    />
  )
}
ItemFlavorFormField.displayName = "ItemFlavorFormField"

const FlavorFormField = ({ field, index, form }: FlavorFormFieldProps) => {
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
          if (form.watch("cup")) {
            dispatch(cupsApi.endpoints.getCupDetail.initiate({ id: form.watch("cup") })).then((data: any) => {
              if (data.status === "fulfilled") {
                updatedValues[index].quantity = Math.round(data.data.conversion_factor).toString()
                return field.onChange(updatedValues)
              }
            })
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

const QuantityFormField = ({ field, index }: QuantityFormFieldProps) => {
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

const CupFormField = ({ form }: FormProps) => {
  const { data } = useGetCupsListQuery({}, { refetchOnMountOrArgChange: true })

  return (
    <FormField
      control={form.control}
      name="cup"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Size</FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
              {data?.length &&
                data?.length > 0 &&
                data.map((cup: CupSummary) => (
                  <FormItem key={cup.id} className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={String(cup.id)} />
                    </FormControl>
                    <FormLabel className="font-normal">{cup.size.display}</FormLabel>
                  </FormItem>
                ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
CupFormField.displayName = "CupFormField"

const ZeroSugarFormField = ({ form }: FormProps) => {
  return (
    <FormField
      control={form.control}
      name="low_sugar"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Normal or zero sugar?</FormLabel>
          <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="normal" />
                </FormControl>
                <FormLabel className="font-normal">Normal</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="low_sugar" />
                </FormControl>
                <FormLabel className="font-normal">Zero Sugar</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
ZeroSugarFormField.displayName = "ZeroSugarFormField"

const Price = ({ menuItem, form, isCustomized }: PriceProps) => {
  const { data: flavorsData } = useGetFlavorsListQuery({}, { refetchOnMountOrArgChange: true })
  const { data: cupsData } = useGetCupsListQuery({}, { refetchOnMountOrArgChange: true })
  const [flavors, setFlavors] = useState<any>({})
  const [cups, setCups] = useState<any>({})

  useEffect(() => {
    if (flavorsData && flavorsData?.length > 0) {
      setFlavors(
        flavorsData.reduce((acc: any, { id, flavor_group__price }: any) => {
          acc[id] = flavor_group__price
          return acc
        }, {})
      )
    }
  }, [flavorsData])

  useEffect(() => {
    if (cupsData && cupsData?.length > 0) {
      setCups(
        cupsData.reduce((acc: any, { id, price }: any) => {
          acc[id] = price
          return acc
        }, {})
      )
    }
  }, [cupsData])

  const totalPrice = () => {
    if (!isCustomized) {
      if (!menuItem) {
        return ""
      }
      return menuItem.cup_prices.find((obj: any) => String(obj.id) === form.watch("cup"))?.price.toFixed(2)
    } else {
      let custom_flavors = form
        .watch("custom_order_flavors")
        .filter((flavor: any) => flavor.flavor.value !== 0)
        .map((flavor: any) => {
          return { [flavor.flavor.value]: flavor.quantity }
        })

      let flavorsSumPrice = custom_flavors.reduce((acc: any, obj: any) => {
        let flavorId = Object.keys(obj)[0]
        const value = Object.values(obj).reduce((sum: number, val) => sum + Number(val) * flavors[flavorId], 0)
        return acc + value
      }, 0)
      let cupPrice = cups[Number(form.watch("cup"))]

      return (Number(flavorsSumPrice) + Number(cupPrice)).toFixed(2)
    }
  }

  return (
    <div>
      <strong>Price: </strong>${totalPrice() ?? "Price not available"}
    </div>
  )
}
Price.displayName = "Price"

const NoteFormField = ({ form }: FormProps) => {
  return (
    <FormField
      control={form.control}
      name="note"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Note</FormLabel>
          <FormControl>
            <Textarea placeholder="Add a note about this order item" className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
NoteFormField.displayName = "NoteFormField"

const cleanZeroSugar = (values: any) => {
  let updatedValues: any = { ...values } // Create a shallow copy to avoid mutating the original object
  if (values.low_sugar === "normal") {
    updatedValues["low_sugar"] = false
  } else {
    updatedValues["low_sugar"] = true
  }
  return updatedValues
}

export {
  FlavorFormField,
  QuantityFormField,
  ItemFlavorFormField,
  cleanFlavorsData,
  CupFormField,
  ZeroSugarFormField,
  Price,
  NoteFormField,
  cleanZeroSugar,
}
