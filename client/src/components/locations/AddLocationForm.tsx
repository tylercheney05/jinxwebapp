import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { SelectFormField } from "../forminputs/Select"
import { US_STATES_OPTIONS } from "constants/LocationConstants"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { useEffect } from "react"
import { cleanFormData, handleFormSubmitResponse } from "utils/FormUtils"
import { useCreateLocationMutation, useGetLocationsListQuery } from "services/locations"
import { LocationListItem } from "types/LocationTypes"

const AddLocationForm = () => {
  const [createLocation, result] = useCreateLocationMutation()
  const { data, refetch } = useGetLocationsListQuery({}, { refetchOnMountOrArgChange: true })
  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    city: z.string().min(1, { message: "City is required" }),
    state: z.object({
      value: z.string().min(1, { message: "State is required" }),
      label: z.string(),
    }),
    zip_code: z.string().min(1, { message: "Zip Code is required" }),
    is_event: z.boolean(),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: {
        value: "",
        label: "Select a location",
      },
      zip_code: "",
      is_event: false,
    },
  })

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Location added successfully", refetch)
  }, [result])

  function onSubmit(values: z.infer<typeof formSchema>) {
    createLocation(cleanFormData(values))
  }

  return (
    <Form {...form}>
      <div className="mb-4">
        {data?.length && data?.length > 0 ? <FormLabel className="text-md">Existing Locations</FormLabel> : null}
        {data?.map((location: LocationListItem) => (
          <div key={location.id} className="h-10 pl-2 flex items-center text-sm gap-1">
            {location.name}
          </div>
        ))}
      </div>
      <FormLabel className="text-md">Add New Location</FormLabel>
      <form>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter location or event name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter city" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <SelectFormField
            form={form}
            name="state"
            placeholder="Select a state"
            options={US_STATES_OPTIONS}
            label="State"
          />
          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter zip code" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="is_event"
          render={({ field }) => (
            <FormItem className="mt-2">
              <div>
                <FormLabel>Is this location an event?</FormLabel>
              </div>
              <FormControl>
                <Switch className="mt-0" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="mt-4">
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Add Location
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddLocationForm
