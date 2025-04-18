import Layout from "components/Layout"
import LocationNeededRoute from "components/routes/LocationNeededRoute"
import { useSelector } from "react-redux"
import { RootState } from "store"
import { LoadingIcon } from "components/Icons"
import PendingOrders from "components/orders/PendingOrders"
import { useEffect, useState } from "react"
import { OrderListItems } from "/types/OrderTypes"
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { Link } from "react-router-dom"

const MakeOrdersPage = () => {
  const { user, loading } = useSelector((state: RootState) => state.user)
  const [ordersQueued, setOrdersQueued] = useState<OrderListItems>([])
  const { locationId } = useSelector((state: RootState) => state.location)
  const [client, setClient] = useState<W3CWebSocket | null>(null)

  const createWebSocket = () => {
    const newClient = new W3CWebSocket(
      `${process.env.REACT_APP_WEBSOCKET_URL}/ws/orders/${locationId}/?user_id=${user?.id}`
    )

    newClient.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data.toString())
      setOrdersQueued(dataFromServer.pending_orders)
    }

    setClient(newClient)
  }

  useEffect(() => {
    createWebSocket()
  }, [locationId, user?.id])

  const handleClick = () => {
    if (client) {
      client.close()
    }
    if (createWebSocket) {
      createWebSocket()
    }
  }

  return (
    <Layout title="Jinx | Make Orders" content="Make Orders Page">
      <LocationNeededRoute>
        {loading || user == null ? (
          <LoadingIcon />
        ) : !ordersQueued || ordersQueued.length === 0 ? (
          <div>
            {" "}
            <div className="text-center text-lg">No orders in queue</div>
            <div className="text-center text-sm">
              <div>
                If you are expecting to see orders here and they do not show up after 10-15 seconds try each of these
                one by one:
              </div>
              <br />
              <ul>
                <li>
                  1. Ensure you've selected the correct location, if not select the correct location and refresh the
                  page
                </li>
                <li>
                  2. Click{" "}
                  <span className="text-jinxBlue cursor-pointer" onClick={handleClick}>
                    here{" "}
                  </span>
                  to reset the connection
                </li>
                <li>
                  3. Click{" "}
                  <Link to="/make-orders/backup" className="text-jinxBlue">
                    here
                  </Link>{" "}
                  to go the backup page
                </li>
                <li>4. Log out, then log back in</li>
                <li>5. If none of the steps work please contact the administrator for help</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="mt-4 font-bold text-lg">Please make orders from top to bottom</div>
            <PendingOrders ordersQueued={ordersQueued} client={client} />
          </div>
        )}
      </LocationNeededRoute>
    </Layout>
  )
}

export default MakeOrdersPage
