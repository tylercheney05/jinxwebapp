import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useGetOrderDetailQuery, usePrepareOrderItemMutation } from "services/orders"
import { OrderItemDetailItem } from "types/OrderTypes"
import { useNavigate, useParams } from "react-router-dom"
import { Progress } from "../ui/progress"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { useSelector } from "react-redux"
import { RootState } from "store"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"

const MakeOrder = () => {
  const [prepareOrderItem, { isSuccess }] = usePrepareOrderItemMutation()
  const { id } = useParams<{ id: string }>()
  const { data, refetch } = useGetOrderDetailQuery({ id: id }, { refetchOnMountOrArgChange: true })
  const { locationId } = useSelector((state: RootState) => state.location)
  const { user } = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()
  const isMounted = useRef(true)
  const [complete, setComplete] = useState(false)

  const client = new W3CWebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/ws/orders/${locationId}/?user_id=${user?.id}`)

  useEffect(() => {
    isMounted.current = true

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (client.readyState === W3CWebSocket.OPEN) {
        client.send(
          JSON.stringify({
            order_in_progress: false,
            order_id: id,
          })
        )
        client.close()
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      if (isMounted.current && client.readyState === W3CWebSocket.OPEN) {
        client.send(
          JSON.stringify({
            order_in_progress: false,
            order_id: id,
          })
        )
        client.close()
      }
      isMounted.current = false
    }
  }, [id])

  useEffect(() => {
    if (isSuccess && complete) {
      const notify = () => toast.success("Order completed successfully")
      notify()

      navigate("/make-orders")
    }
  }, [isSuccess])

  const handleNext = (index: any) => {
    prepareOrderItem({ id: data?.order_items[index].id, is_prepared: true })
    refetch()
  }

  const handlePrev = (index: any) => {
    prepareOrderItem({ id: data?.order_items[index - 1].id, is_prepared: false })
    refetch()
  }

  const handleClickOnLastItem = (index: any) => {
    prepareOrderItem({ id: data?.order_items[index].id, is_prepared: true })
    setComplete(true)
    refetch()
  }

  return (
    <div>
      <div>
        {data?.order_items && data.order_items.length > 0 && (
          <Progress
            value={
              (data.order_items.filter((item: OrderItemDetailItem) => item.is_prepared).length /
                data.order_items.length) *
              100
            }
            className="mb-4"
          />
        )}
      </div>
      <Carousel className="w-full max-w-xs m-auto">
        <CarouselContent>
          {data?.order_items.map((order_item: OrderItemDetailItem, index: number) => {
            return (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{order_item.order_item_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <strong>Cup: </strong>
                        {order_item.cup__size__display}
                      </div>
                      <div>
                        <strong>Soda: </strong>
                        {order_item.soda_name} {order_item.low_sugar && "Zero Sugar"}
                      </div>
                      <div className="my-4">
                        {Object.entries(order_item.order_item_flavors).map(([key, value]) => (
                          <div key={key}>
                            {value} of
                            <strong> {key}</strong>
                          </div>
                        ))}
                      </div>
                      {order_item.note && (
                        <>
                          <strong>Notes:</strong>
                          <div>{order_item.note}</div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious onClickWithIndex={(index) => handlePrev(index)} />
        <CarouselNext
          onClickWithIndex={(index) => handleNext(index)}
          allowClickOnLastItem={(index) => handleClickOnLastItem(index)}
        />
      </Carousel>
    </div>
  )
}

export default MakeOrder
