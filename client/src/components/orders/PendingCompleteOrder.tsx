import { useGetOrderItemListQuery } from "services/orders"
import { OrderListItem } from "types/OrderTypes"
import OrderContentItems from "./OrderContentItems"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import { useMediaQuery } from "@material-ui/core"
import { DrawerHeader, DrawerTitle } from "../ui/drawer"

interface Props {
  order: OrderListItem
}

const PendingCompleteOrder = ({ order }: Props) => {
  const { data } = useGetOrderItemListQuery({ order: order.id }, { refetchOnMountOrArgChange: true })
  const isDesktop = useMediaQuery("(min-width: 768px)")

  return (
    <div>
      {isDesktop ? (
        <DialogHeader className="mb-4 text-jinxGreen">
          <DialogTitle>{order.order_name__name} - Completed</DialogTitle>
        </DialogHeader>
      ) : (
        <DrawerHeader className="mb-4 text-jinxGreen">
          <DrawerTitle>{order.order_name__name} - Completed</DrawerTitle>
        </DrawerHeader>
      )}
      <div>
        <OrderContentItems data={data} />
      </div>
    </div>
  )
}

export default PendingCompleteOrder
