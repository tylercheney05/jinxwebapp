import { useState } from "react"
import { UseFormReturn, ControllerRenderProps } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form"
import { convertToOptions } from "utils/FormUtils"
import Select from "react-select"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"

interface SelectInputProps {
  value?: string
  placeholder: string
  field?: ControllerRenderProps<any, string>
  options: any[]
  hidden?: boolean
  errorMsg?: string
  onFocus?: () => void
  onChange?: (...args: any[]) => void
  isLoading?: boolean
  disabled?: boolean
  isClearable?: boolean
}

interface SelectFormFieldProps {
  form: UseFormReturn<any>
  name: string
  label?: string
  placeholder: string
  options: any[]
  onFocus?: () => void
  isLoading?: boolean
  disabled?: boolean
}

interface SelectFromApiFormFieldProps {
  form: UseFormReturn<any>
  name: string
  label?: string
  placeholder: string
  loadOptionsApi: any
  fieldsForDropdownLabel: Array<string>
}

export const SelectInputStyles = (hidden = false, errorMsg = "") => {
  // Custom attributes to line up with the styling of the other form controls
  return {
    control: (baseStyles: any, state: any) => ({
      backgroundColor: state.isDisabled ? "#EEEEEE" : "transparent",
    }),
    indicatorSeparator: (baseStyles: any, state: any) => ({
      ...baseStyles,
      marginTop: "2px",
      marginBottom: "2px",
    }),
    valueContainer: (baseStyles: any, state: any) => ({
      ...baseStyles,
      padding: "0",
    }),
    singleValue: (baseStyles: any, state: any) => {
      return {
        ...baseStyles,
        color: "#555555",
        opacity: state.data.value ? 1 : 0.5,
      }
    },
  }
}

export const SelectInputClassNames =
  "flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input pl-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"

const SelectInput = ({
  value,
  placeholder,
  field,
  options,
  hidden = false,
  errorMsg = "",
  onFocus,
  isLoading,
  onChange,
  disabled,
  isClearable = true,
  ...props
}: SelectInputProps) => {
  // This input type is used when the options
  // can be defined without an API call
  return (
    <>
      <Select
        value={value}
        placeholder={placeholder}
        options={options}
        onChange={onChange}
        styles={SelectInputStyles(hidden, errorMsg)}
        classNames={{
          control: () => SelectInputClassNames,
        }}
        isClearable={isClearable}
        onFocus={onFocus}
        isLoading={isLoading}
        isDisabled={disabled}
        {...props}
      />
    </>
  )
}
SelectInput.displayName = "SelectInput"

const SelectFormField = ({
  form,
  name,
  label,
  placeholder,
  options,
  onFocus,
  isLoading = false,
  disabled = false,
  ...props
}: SelectFormFieldProps) => {
  // Use this component if <select> uses static <options>
  // All options will populate onFocus

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mt-2">
          {
            // If a label is provided, display it
            label && <FormLabel>{label}</FormLabel>
          }
          <FormControl>
            <SelectInput
              value={field.value}
              placeholder={placeholder}
              options={options}
              field={field}
              onFocus={onFocus}
              onChange={(val) => field.onChange(val)}
              isLoading={isLoading}
              disabled={disabled}
              {...props}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
SelectFormField.displayName = "SelectFormField"

const SelectFromApiFormField = ({
  form,
  name,
  label,
  placeholder,
  loadOptionsApi,
  fieldsForDropdownLabel,
}: SelectFromApiFormFieldProps) => {
  const dispatch = useDispatch<AppDispatch>()

  // Use this component if <select> uses an API to generate <options>
  // All options will populate onFocus
  const [options, setOptions] = useState<Array<object>>([])
  const [loading, setLoading] = useState(false)

  const loadOptions = () => {
    dispatch(loadOptionsApi()).then((response: any) => {
      if (response.meta.requestStatus === "fulfilled") {
        let options = convertToOptions(response.payload.results, fieldsForDropdownLabel)
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
    <SelectFormField
      form={form}
      name={name}
      label={label}
      placeholder={placeholder}
      options={options}
      onFocus={handleOnFocus}
      isLoading={loading}
    />
  )
}
SelectFromApiFormField.displayName = "SelectFromApiFormField"

export { SelectFromApiFormField, SelectFormField, SelectInput }
