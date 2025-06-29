import { Button } from "components/ui"
import { PlusIcon } from "components/Icons"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"

interface Props {
  form: UseFormReturn<any>
  onSubmit: (values: any) => void
  children: React.ReactNode
}

const AddObjectForm = ({ form, onSubmit, children }: Props) => {
  return (
    <form className="items-center gap-4 grid grid-cols-10">
      {children}
      <div className="text-right">
        <Button type="submit" className="mt-10" onClick={form.handleSubmit(onSubmit)}>
          <PlusIcon />
        </Button>
      </div>
    </form>
  )
}

export default AddObjectForm
