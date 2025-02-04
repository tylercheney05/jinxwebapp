import { OrderListItem } from "types/OrderTypes"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import useMediaQuery from "@mui/material/useMediaQuery"
import { DrawerHeader, DrawerTitle } from "../ui/drawer"
import OrderContentItem from "./other/orderContentItem"
import { useGetOrderDetailQuery } from "services/orders"
import { getName, getPrice } from "utils/orders/orderItem"

interface Props {
  order: OrderListItem
}

const PendingCompleteOrder = ({ order }: Props) => {
  const { data, isLoading } = useGetOrderDetailQuery(
    {
      id: order.id,
    },
    { refetchOnMountOrArgChange: true }
  )
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
        {data?.order_items?.map((order_item, index) => (
          <OrderContentItem
            index={index}
            order_item={order_item}
            name={getName(order_item)}
            price={getPrice(order_item)}
            readOnly={true}
          />
        ))}
      </div>
    </div>
  )
}

export default PendingCompleteOrder
