import { Card, CardHeader, CardTitle } from "../ui/card"
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { useSelector } from "react-redux"
import { RootState } from "store"
import { useEffect, useState } from "react"
import { OrderListItem } from "/types/OrderTypes"

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

  return (
    <div>
      <h1 className="text-xl font-bold mb-8">Orders Queue</h1>
      <div className="flex flex-col gap-4">
        {ordersQueued.map((order: OrderListItem) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>{order.order_name__name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default PendingOrders
