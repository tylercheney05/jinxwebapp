export const loadSelectOptions = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  api: any,
  fieldsForDropdownLabel: any,
  inputValue: string = "",
  additionalApiParams: object = {}
) => {
  return api(setLoading, {
    ...additionalApiParams,
    search: inputValue,
  }) // search is always passed, but you can pass additional params as well
    .then((response: any) => {
      return convertToOptions(response.results, fieldsForDropdownLabel)
    })
    .catch((error: any) => {
      return {}
    })
}

export const convertToOptions = (data: Array<object>, fieldsForDropdownLabel: Array<string>) => {
  return data.map((option: any) => ({
    value: option.id,
    label: fieldsForDropdownLabel.map((field) => option[field]).join(" | "),
  }))
}

export const cleanFormData = (values: object) => {
  let data: any = {}
  Object.entries(values).map(([key, value]) => {
    if (
      // For select fields that have a value and label
      // Update to only pass the value
      typeof value === "object" &&
      value !== null &&
      value.hasOwnProperty("value") &&
      value.hasOwnProperty("label") &&
      value.value !== 0
    ) {
      data[key] = value.value
    } else {
      data[key] = value
    }
  })
  return data
}
