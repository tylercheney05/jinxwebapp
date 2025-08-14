import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { PlusIcon } from "../Icons"
import { useEffect } from "react"
import { useCreateSodaMutation, useGetSodasListQuery } from "services/sodas"
import { handleFormSubmitResponse } from "utils/FormUtils"
import { Soda } from "types"

const AddSodaForm = () => {
  const [createSoda, result] = useCreateSodaMutation()
  const { data, refetch } = useGetSodasListQuery({}, { refetchOnMountOrArgChange: true })
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
    handleFormSubmitResponse(result, form, "Soda added successfully", "post", refetch)
  }, [result])

  function onSubmit(values: z.infer<typeof formSchema>) {
    createSoda(values)
  }

  return (
    <Form {...form}>
      {data?.length && data?.length > 0 ? <FormLabel>Existing Sodas</FormLabel> : null}
      {data?.map((soda: Soda) => (
        <div key={soda.id} className="h-10 pl-2 flex items-center text-sm gap-1">
          {soda.name}
        </div>
      ))}
      <form className="items-center gap-4 grid grid-cols-10">
        <div className="col-span-9">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Add New Soda</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter soda brand name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="text-right">
          <Button type="submit" className="mt-10" onClick={form.handleSubmit(onSubmit)}>
            <PlusIcon />
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddSodaForm
