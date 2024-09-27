import { OrderItemListItem, OrderListItem } from "types/OrderTypes"
import { useGetOrderDetailQuery, usePrepareOrderItemMutation } from "services/orders"
import { Progress } from "../ui/progress"
import { DialogHeader, DialogTitle } from "../ui/dialog"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { DrawerHeader, DrawerTitle } from "../ui/drawer"
import { useMediaQuery } from "@material-ui/core"
import { useEffect } from "react"
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { toast } from "react-toastify"

interface Props {
  order: OrderListItem
  client: W3CWebSocket
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PendingOrderContent = ({ order, client, setOpen }: Props) => {
  const [prepareOrderItem] = usePrepareOrderItemMutation()
  const { data, refetch } = useGetOrderDetailQuery({ id: order.id }, { refetchOnMountOrArgChange: true })
  const isDesktop = useMediaQuery("(min-width: 768px)")

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
    refetch()
  }

  useEffect(() => {
    if (data?.order_items.filter((item: OrderItemListItem) => !item.is_prepared).length === 0) {
      client.send(
        JSON.stringify({
          message: "All items prepared",
        })
      )
      const notify = () => toast.success("Order completed successfully")
      notify()
      setOpen(false)
    }
  }, [data])

  useEffect(() => {
    window.onbeforeunload = function () {
      client.send(
        JSON.stringify({
          order_in_progress: false,
          order_id: order.id,
        })
      )
    }

    return () => {
      window.onbeforeunload = null
    }
  }, [])

  const carousel = (
    <Carousel className="w-full max-w-xs m-auto">
      <CarouselContent>
        {data?.order_items.map((order_item: OrderItemListItem, index: number) => {
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
  )

  const progressBar = (
    <div>
      {data?.order_items?.length > 0 && (
        <Progress
          value={
            (data?.order_items.filter((item: OrderItemListItem) => item.is_prepared).length /
              data?.order_items.length) *
            100
          }
          className="mb-4"
        />
      )}
    </div>
  )

  return (
    <div>
      {isDesktop ? (
        <DialogHeader className="mt-4">
          <DialogTitle className="mb-4 text-center">{order.order_name__name}</DialogTitle>
          {progressBar}
          {carousel}
        </DialogHeader>
      ) : (
        <DrawerHeader className="mt-4">
          <DrawerTitle className="mb-4 text-center">{order.order_name__name}</DrawerTitle>
          {progressBar}
          {carousel}
        </DrawerHeader>
      )}
    </div>
  )
}

export default PendingOrderContent
