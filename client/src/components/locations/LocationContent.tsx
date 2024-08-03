import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { Form } from "../ui/form"
import { SelectFromApiFormField } from "../forminputs/Select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { locationsApi, useGetLocationDetailQuery } from "services/locations"
import { Button } from "../ui/button"
import { cleanFormData } from "utils/FormUtils"
import { setLocationCookie } from "features/location"

const LocationContent = () => {
  const { locationId } = useSelector((state: RootState) => state.location)
  const { data } = useGetLocationDetailQuery({ id: locationId }, { refetchOnMountOrArgChange: true })
  const dispatch = useDispatch<AppDispatch>()
  const formSchema = z.object({
    locationId: z.object({
      value: z.number(),
      label: z.string(),
    }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locationId: {
        value: 0,
        label: "Select a location",
      },
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    dispatch(setLocationCookie(cleanFormData(values)))
  }

  return (
    <div className="xs:w-[500px] sm:w-[500px] p-8 min-h-[300px]">
      <div className="text-xl mb-8">
        Current Location:{" "}
        <div>
          <strong>{!locationId ? "No location selected" : data?.name && data.name}</strong>
        </div>
      </div>
      <Form {...form}>
        <form>
          <SelectFromApiFormField
            form={form}
            name="locationId"
            label="Update Location"
            placeholder="Select a location"
            loadOptionsApi={locationsApi.endpoints.getLocationsDropdown.initiate}
            fieldsForDropdownLabel={["name"]}
          />
          <div>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)} className="mt-4">
              Set Location
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default LocationContent
