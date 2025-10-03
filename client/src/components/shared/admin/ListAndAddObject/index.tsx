import { Form } from "components/ui"
import { UseFormReturn } from "react-hook-form"
import Header from "./Header"
import Objects from "./Objects"
import AddObjectForm from "./AddObjectForm"
import { useEffect } from "react"
import { handleFormSubmitResponse } from "utils/FormUtils"
import { Result, TypeEditObjectFormComponent } from "types/shared"

interface Props {
  form: UseFormReturn<any>
  title: string
  objTxtFn: ((item: any) => string) | ((item: any) => JSX.Element)
  useGetObjectsListQuery: any
  canEdit?: boolean
  editFormTitle?: string
  EditObjectFormComponent?: TypeEditObjectFormComponent
  onSubmit: (values: any) => void
  result: Result
  children: React.ReactNode
}

const ListAndAddObject = ({
  form,
  title,
  objTxtFn,
  useGetObjectsListQuery,
  canEdit = false,
  editFormTitle,
  EditObjectFormComponent,
  onSubmit,
  result,
  children,
}: Props) => {
  const { data, refetch } = useGetObjectsListQuery({}, { refetchOnMountOrArgChange: true })

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Success", "post", refetch)
  }, [result])

  return (
    <Form {...form}>
      <AddObjectForm form={form} onSubmit={onSubmit}>
        {children}
      </AddObjectForm>
      <Header data={data} title={title} />
      <Objects
        data={data}
        objTxtFn={objTxtFn}
        canEdit={canEdit}
        editFormTitle={editFormTitle}
        EditObjectFormComponent={EditObjectFormComponent}
        refetch={refetch}
      />
    </Form>
  )
}

export default ListAndAddObject
