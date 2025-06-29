import { Form } from "components/ui"
import { UseFormReturn } from "react-hook-form"
import Header from "./Header"
import Objects from "./Objects"
import AddObjectForm from "./AddObjectForm"
import { useEffect } from "react"
import { handleFormSubmitResponse } from "utils/FormUtils"
import { TypeEditObjectFormComponent } from "types/shared"

interface Props {
  form: UseFormReturn<any>
  title: string
  objTxtFn: (item: any) => string
  useGetObjectsListQuery: any
  useCreateObjectMutation: any
  canEdit?: boolean
  editFormTitle?: string
  EditObjectFormComponent?: TypeEditObjectFormComponent
  children: React.ReactNode
}

const ListAndAddObject = ({
  form,
  title,
  objTxtFn,
  useGetObjectsListQuery,
  useCreateObjectMutation,
  canEdit = false,
  editFormTitle,
  EditObjectFormComponent,
  children,
}: Props) => {
  const { data, refetch } = useGetObjectsListQuery({}, { refetchOnMountOrArgChange: true })
  const [createObj, result] = useCreateObjectMutation()

  useEffect(() => {
    handleFormSubmitResponse(result, form, "Cup added successfully", "post", refetch)
  }, [result])

  return (
    <Form {...form}>
      <Header data={data} title={title} />
      <Objects
        data={data}
        objTxtFn={objTxtFn}
        canEdit={canEdit}
        editFormTitle={editFormTitle}
        EditObjectFormComponent={EditObjectFormComponent}
        refetch={refetch}
      />
      <AddObjectForm form={form} onSubmit={createObj}>
        {children}
      </AddObjectForm>
    </Form>
  )
}

export default ListAndAddObject
