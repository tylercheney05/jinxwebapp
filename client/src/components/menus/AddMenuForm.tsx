import { z } from "zod"
import { ListAndAddObject } from "components/shared"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Menu } from "types"
import {
  Button,
  Calendar,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components/ui"
import { cn } from "lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useCreateMenuMutation, useGetMenusListQuery } from "services/menu"

const AddMenuForm = () => {
  const formSchema = z.object({
    version: z.string().min(1, { message: "Version is required" }),
    date: z.date(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  return (
    <ListAndAddObject
      form={form}
      title="Existing Menus"
      objTxtFn={(item: Menu) => `Menu Version ${item.id}`}
      useGetObjectsListQuery={useGetMenusListQuery}
      useCreateObjectMutation={useCreateMenuMutation}
    >
      <div className="col-span-4">
        <FormField
          control={form.control}
          name="version"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel>Add Menu</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="Enter version" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-4">
        <div className="mt-10">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col mt-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Date menu version began</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </ListAndAddObject>
  )
}

export default AddMenuForm
