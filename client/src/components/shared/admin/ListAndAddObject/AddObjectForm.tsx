import { Button } from "components/ui"
import { PlusIcon } from "components/Icons"
import { UseFormReturn } from "react-hook-form"

interface Props {
  form: UseFormReturn<any>
  onSubmit: (values: any) => void
  children: React.ReactNode
}

const AddObjectForm = ({ form, onSubmit, children }: Props) => {
  return (
    <div>
      {children}
      <div className="text-left">
        <Button type="submit" className="mt-3 mb-4" onClick={form.handleSubmit(onSubmit)}>
          <PlusIcon />
        </Button>
      </div>
    </div>
  )
}

export default AddObjectForm
