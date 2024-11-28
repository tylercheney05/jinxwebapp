import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form"
import { LabelType } from "types/SharedTypes"

interface Props {
  label?: LabelType
  children: React.ReactNode
}

const FieldGroup = ({ label, children }: Props) => {
  return (
    <FormItem className="mt-2">
      {
        // If a label is provided, display it
        label && <FormLabel>{label}</FormLabel>
      }
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  )
}
FieldGroup.displayName = "FieldGroup"

export { FieldGroup }
