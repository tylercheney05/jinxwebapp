import { Dialog, DialogTrigger, DialogContent } from "components/ui/dialog"
import { useEffect, useState } from "react"
import { DeleteIcon } from "components/Icons"
import { Button } from "components/ui/button"
import { OrderNameItem } from "/types/OrderTypes"
import { useDeleteOrderNameMutation } from "services/orders"
import { handleFormSubmitResponse } from "utils/FormUtils"
import { UseFormReturn } from "react-hook-form"
import { BaseQueryFn, FetchArgs, QueryActionCreatorResult, QueryDefinition } from "@reduxjs/toolkit/query"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

interface Props {
  orderName: OrderNameItem
  form: UseFormReturn<any>
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      | {
          name?: string
        }
      | undefined,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
      never,
      any,
      "orderNameApi"
    >
  >
}

const DeleteOrderNameDialog = ({ orderName, form, refetch }: Props) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [deleteOrderName, resultDelete] = useDeleteOrderNameMutation()

  useEffect(() => {
    handleFormSubmitResponse(resultDelete, form, "Order Name deleted successfully", "delete", refetch)
  }, [resultDelete])

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>
        <DeleteIcon className="cursor-pointer" size="18px" />
      </DialogTrigger>
      <DialogContent>
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. This will permanently delete the name <strong>{orderName.name}</strong> from
            the system.
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="destructive" onClick={() => deleteOrderName({ id: orderName.id })} className="mr-2">
            Delete
          </Button>
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteOrderNameDialog
