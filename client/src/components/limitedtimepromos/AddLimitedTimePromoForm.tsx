import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { CircleCheckIcon, PlusIcon, ArchivedIcon } from "../Icons"
import { useEffect } from "react"
import { handleFormSubmitResponse } from "utils/FormUtils"
import { useCreateLimitedTimePromoMutation, useGetLimitedTimePromosListQuery } from "services/limitedtimepromos"
import { LimitedTimePromoListItem } from "types/LimitedTimePromoTypes"
import { EditIcon } from "lucide-react"
import { Separator } from "../ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { limitedTimePromoFormSchema } from "utils/constants/LimitedTimePromoConstants"
import EditLimitedTimePromoForm from "./EditLimitedTimePromoForm"

const AddLimitedTimePromoForm = () => {
  const [createLimitedTimePromo, result] = useCreateLimitedTimePromoMutation()
  const { data, refetch, error } = useGetLimitedTimePromosListQuery({}, { refetchOnMountOrArgChange: true })
  const formSchema = z.object({
    name: limitedTimePromoFormSchema.name,
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Limited time promo added successfully", "post", refetch)
  }, [result])

  function onSubmit(values: z.infer<typeof formSchema>) {
    createLimitedTimePromo(values)
  }

  return (
    <Form {...form}>
      {data?.length && data?.length > 0 ? <FormLabel>Existing Limited Time Promos</FormLabel> : null}
      {data?.map((limitedTimePromo: LimitedTimePromoListItem) => (
        <>
          <div key={limitedTimePromo.id} className="h-10 pl-2 flex items-center text-sm gap-1 justify-between">
            <div className="flex gap-4 items-center">
              {limitedTimePromo.is_archived ? (
                <div title={`${limitedTimePromo.name} promo is archived`}>
                  <ArchivedIcon size="18px" />
                </div>
              ) : (
                <div title={`${limitedTimePromo.name} promo is active`}>
                  <CircleCheckIcon size="18px" />
                </div>
              )}
              {limitedTimePromo.name}
            </div>
            <Sheet>
              <SheetTrigger>
                <EditIcon className="cursor-pointer" size="18px" />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit Limited Time Promo</SheetTitle>
                  <SheetDescription>
                    Make changes to the {limitedTimePromo.name} promo. Click save when you're done.
                  </SheetDescription>
                </SheetHeader>
                <EditLimitedTimePromoForm limitedTimePromo={limitedTimePromo} refetch={refetch} />
              </SheetContent>
            </Sheet>
          </div>
          <Separator className="mt-2" />
        </>
      ))}
      <form className="items-center gap-4 grid grid-cols-10">
        <div className="col-span-9">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mt-2">
                <FormLabel>Add New Limited Time Promo</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter limited time promo name" />
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

export default AddLimitedTimePromoForm
