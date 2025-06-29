import React from "react"
import { Menu } from "types"
import Object from "./Object"
import { Refetch, TypeEditObjectFormComponent } from "types/shared"

interface Props {
  data: Menu[] | undefined
  objTxtFn: (item: Menu) => string
  canEdit?: boolean
  editFormTitle?: string
  EditObjectFormComponent?: TypeEditObjectFormComponent
  refetch?: Refetch
}

const Objects = ({ data, objTxtFn, canEdit = false, editFormTitle, EditObjectFormComponent, refetch }: Props) => {
  return (
    <>
      {data?.map((obj) => (
        <React.Fragment key={obj.id}>
          <Object
            obj={obj}
            text={objTxtFn(obj)}
            canEdit={canEdit}
            editFormTitle={editFormTitle}
            EditObjectFormComponent={EditObjectFormComponent}
            refetch={refetch}
          />
        </React.Fragment>
      ))}
    </>
  )
}

export default Objects
