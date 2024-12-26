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
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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
