import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { SelectFromApiFormField } from "../forminputs/Select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { locationsApi } from "services/locations"
import { Form } from "../ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { cleanFormData } from "utils/FormUtils"
import { setLocationCookie } from "features/location"

interface Props {
  children: React.ReactNode
}

const LocationNeededRoute = ({ children }: Props) => {
  const { locationId } = useSelector((state: RootState) => state.location)
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
    <>
      {!locationId ? (
        <div className="flex justify-center">
          <Card className="w-[500px] mt-10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Location Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form>
                  <SelectFromApiFormField
                    form={form}
                    name="locationId"
                    label="Location"
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
            </CardContent>
          </Card>
        </div>
      ) : (
        children
      )}
    </>
  )
}

export default LocationNeededRoute
