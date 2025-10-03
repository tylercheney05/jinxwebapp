export const cleanFlavorsData = (values: any, fieldName: string) => {
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
