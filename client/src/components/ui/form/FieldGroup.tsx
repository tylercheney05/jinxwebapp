import React from "react"
import { FormItem, FormLabel, FormControl, FormMessage } from "../form"
import { LabelType } from "/types/shared"
import { Skeleton } from "../skeleton"

interface Props {
  label: LabelType
  loading?: boolean
  sheet?: boolean // This is a boolean prop that determines if the field group is in a sheet or not
  children: React.ReactNode
}

const FieldGroup = ({ label, loading = false, sheet = false, children }: Props) => {
  return (
    <FormItem className={sheet ? "mb-[5px]" : ""}>
      <div className={sheet ? "grid grid-cols-4 items-center gap-4" : ""}>
        <FormLabel className={sheet ? "text-right" : "mb-3"}>{label}</FormLabel>
        <FormControl>
          <div className={sheet ? "col-span-3" : ""}>
            {loading ? <Skeleton className="h-[34px] w-100%" /> : <>{children}</>}
          </div>
        </FormControl>
      </div>
      <FormMessage />
    </FormItem>
  )
}
FieldGroup.displayName = "FieldGroup"

export { FieldGroup }
