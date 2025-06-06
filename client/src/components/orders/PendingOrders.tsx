import { OrderListItem, OrderListItems } from "/types/OrderTypes"
import PendingOrder from "./PendingOrder"
import { w3cwebsocket as W3CWebSocket } from "websocket"

interface Props {
  ordersQueued: OrderListItems | undefined
  client: W3CWebSocket | null
  showRecipe?: boolean
}

const PendingOrders = ({ ordersQueued, client, showRecipe = false }: Props) => {
  return (
    <div className="mt-4">
      <div className="flex flex-col gap-4 items-center">
        {ordersQueued &&
          ordersQueued.map((order: OrderListItem) => (
            <PendingOrder order={order} client={client} showRecipe={showRecipe} />
          ))}
      </div>
    </div>
  )
}

export default PendingOrders
