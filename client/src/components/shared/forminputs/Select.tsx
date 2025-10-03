import { useState } from "react"
import { UseFormReturn, ControllerRenderProps } from "react-hook-form"
import { FormField } from "../../ui/form"
import { convertToOptions } from "utils/FormUtils"
import Select from "react-select"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store"
import { LabelType } from "/types/shared"
import debounce from "debounce-promise"
import { FieldGroup } from "./FieldGroup"
import AsyncSelect from "react-select/async"

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
  disabled?: boolean
}

interface AsyncSelectInputProps {
  value: string | number
  placeholder: string
  loadOptions: any
  hidden?: boolean
  errorMsg?: string
  field: ControllerRenderProps<any, string>
  disabled?: boolean
}

interface AsyncSelectGroupProps {
  form: UseFormReturn<any>
  name: string
  label: LabelType
  placeholder: string
  loadOptionsApi: any
  minInputVal?: number
  additionalApiParams?: object
  disabled?: boolean
  loading?: boolean
  fieldsForDropdownLabel?: Array<string>
  sheet?: boolean
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
        <FieldGroup label={label}>
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
        </FieldGroup>
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
  disabled = false,
}: SelectFromApiFormFieldProps) => {
  const dispatch = useDispatch<AppDispatch>()

  // Use this component if <select> uses an API to generate <options>
  // All options will populate onFocus
  const [options, setOptions] = useState<Array<object>>([])
  const [loading, setLoading] = useState(false)

  const loadOptions = () => {
    dispatch(loadOptionsApi()).then((response: any) => {
      if (response.status === "fulfilled") {
        let options = convertToOptions(response.data.results, fieldsForDropdownLabel)
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
      disabled={disabled}
    />
  )
}
SelectFromApiFormField.displayName = "SelectFromApiFormField"

const AsyncSelectInput = ({
  value,
  placeholder,
  loadOptions,
  field,
  disabled = false,
  ...props
}: AsyncSelectInputProps) => {
  // This input type is used when the
  // options are defined from an API call
  const handleOnChange = (val: any) => {
    if (val) {
      field.onChange(val)
    } else {
      field.onChange({ value: "", label: placeholder })
    }
  }

  return (
    <>
      <AsyncSelect
        value={value}
        placeholder={placeholder}
        onChange={(val) => {
          handleOnChange(val)
        }}
        loadOptions={loadOptions}
        styles={SelectInputStyles()}
        classNames={{
          control: () => SelectInputClassNames,
        }}
        isClearable={true}
        isDisabled={disabled}
        {...props}
      />
    </>
  )
}
AsyncSelectInput.displayName = "AsyncSelectInput"

const AsyncSelectFormField = ({
  form,
  name,
  label,
  placeholder,
  loadOptionsApi,
  minInputVal,
  additionalApiParams = {}, // If additional params for API are passed then define them here
  disabled = false,
  loading = false,
  fieldsForDropdownLabel = ["name"],
  sheet = false,
  ...props
}: AsyncSelectGroupProps) => {
  // Use this if you'd like the <select> <options> to only be
  // generated when typing into the search bar
  const dispatch = useDispatch<AppDispatch>()

  // Adding the debounce will ensure that the API isn't called
  // until the user stops typing
  const loadOptions = debounce(async (inputValue: any, callback: any) => {
    // If min input value is set then the user must type at least
    // the min input value or the API will not be called
    if (minInputVal && inputValue.length < minInputVal) {
      return callback([])
    } else {
      return dispatch(
        loadOptionsApi({
          ...additionalApiParams,
          search: inputValue,
        })
      ).then((response: any) => {
        console.log("response", response)
        if (response.status === "fulfilled") {
          let options = convertToOptions(response.data.results, fieldsForDropdownLabel)
          return options
        } else {
          return []
        }
      })
    }
  }, 1000)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FieldGroup label={label}>
          <AsyncSelectInput
            value={field.value}
            placeholder={placeholder}
            loadOptions={loadOptions}
            field={field}
            disabled={disabled}
            {...props}
          />
        </FieldGroup>
      )}
    />
  )
}
AsyncSelectFormField.displayName = "AsyncSelectFormField"

export { SelectFromApiFormField, SelectFormField, SelectInput, AsyncSelectFormField }
