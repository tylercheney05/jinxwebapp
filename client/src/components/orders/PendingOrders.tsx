import { w3cwebsocket as W3CWebSocket } from "websocket"
import { useSelector } from "react-redux"
import { RootState } from "store"
import { useEffect, useState } from "react"
import { OrderListItem } from "/types/OrderTypes"
import PendingOrder from "./PendingOrder"

const PendingOrders = () => {
  const [ordersQueued, setOrdersQueued] = useState([])
  const { locationId } = useSelector((state: RootState) => state.location)
  const { user } = useSelector((state: RootState) => state.user)

  const client = new W3CWebSocket(`ws://127.0.0.1:8000/ws/orders/${locationId}/?user_id=${user?.id}`)

  useEffect(() => {
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data.toString())
      setOrdersQueued(dataFromServer.pending_orders)
    }
  }, [])

  if (ordersQueued.length === 0) {
    return <div className="text-center text-lg">No orders in queue</div>
  }

  return (
    <div>
      <div className="flex flex-col gap-4 items-center">
        {ordersQueued.map((order: OrderListItem) => (
          <PendingOrder order={order} client={client} />
        ))}
      </div>
    </div>
  )
}

export default PendingOrders
