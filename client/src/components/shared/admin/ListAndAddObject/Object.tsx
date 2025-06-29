import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "components/ui"
import { EditIcon } from "components/Icons"
import { Refetch, TypeEditObjectFormComponent } from "types/shared"

interface Props {
  obj: any
  text: string | number
  canEdit?: boolean
  editFormTitle?: string
  EditObjectFormComponent?: TypeEditObjectFormComponent
  refetch?: Refetch
}

const Object = ({ obj, text, canEdit = false, editFormTitle, EditObjectFormComponent, refetch }: Props) => {
  return (
    <div className="h-10 pl-2 flex items-center text-sm gap-1 justify-between">
      <div>{text}</div>
      {canEdit ? (
        <Sheet>
          <SheetTrigger>
            <EditIcon className="cursor-pointer" size="18px" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{editFormTitle}</SheetTitle>
              <SheetDescription>Make changes to the item. Click save when you're done.</SheetDescription>
            </SheetHeader>
            {EditObjectFormComponent && refetch && <EditObjectFormComponent obj={obj} refetch={refetch} />}
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  )
}

export default Object
