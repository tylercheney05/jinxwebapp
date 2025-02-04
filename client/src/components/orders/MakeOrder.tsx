import { useGetOrderDetailQuery, useUpdateOrderProgressMutation } from "services/orders"
import { useNavigate, useParams } from "react-router-dom"
import { Progress } from "../ui/progress"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { w3cwebsocket as W3CWebSocket } from "websocket"
import { useSelector } from "react-redux"
import { RootState } from "store"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { OrderItem } from "../../types/orderItem/orderItem"
import MakeOrderCard from "./cards/makeOrder"
import { getName } from "utils/orders/orderItem"

const MakeOrder = () => {
  const [updateOrderProgress, { isSuccess }] = useUpdateOrderProgressMutation()
  const { id } = useParams<{ id: string }>()
  const { data, refetch } = useGetOrderDetailQuery({ id: id }, { refetchOnMountOrArgChange: true })
  const { locationId } = useSelector((state: RootState) => state.location)
  const { user } = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()
  const isMounted = useRef(true)
  const [complete, setComplete] = useState(false)
  const [index, setIndex] = useState(1)

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

  const handleClickOnLastItem = () => {
    updateOrderProgress({ id: id, is_in_progress: false, is_complete: true })
    setComplete(true)
    refetch()
  }

  const getSodaName = (order_item: OrderItem) => {
    if (order_item?.menu_item) {
      return order_item.menu_item.menu_item.soda.name
    } else if (order_item?.menu_item_custom_order) {
      return order_item.menu_item_custom_order.menu_item_custom_order.soda.name
    } else if (order_item?.custom_order) {
      return order_item.custom_order.custom_order.soda.name
    }
    return ""
  }

  const getFlavors = (order_item: OrderItem) => {
    if (order_item?.menu_item) {
      return order_item.menu_item.menu_item.flavors
    } else if (order_item?.menu_item_custom_order) {
      return order_item.menu_item_custom_order.menu_item_custom_order.menu_item_custom_order_custom_order_flavors
    } else if (order_item?.custom_order) {
      return order_item.custom_order.custom_order.custom_order_custom_order_flavors
    }
    return []
  }

  return (
    <div>
      <div className="pt-4">
        {data?.order_items && data.order_items.length > 0 && (
          <Progress value={(index / data.order_items.length) * 100} className="mb-4" />
        )}
        <h1 className="text-center my-8 text-3xl">{data?.order_name.name}</h1>
      </div>
      <Carousel className="w-full max-w-xs sm:max-w-md  m-auto">
        <CarouselContent>
          {data?.order_items.map((order_item: OrderItem, index: number) => {
            return (
              <CarouselItem key={index}>
                <div className="p-1">
                  <MakeOrderCard
                    order_item={order_item}
                    name={getName(order_item)}
                    sodaName={getSodaName(order_item)}
                    flavors={getFlavors(order_item)}
                  />
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious onClickWithIndex={(index) => setIndex(index)} />
        <CarouselNext
          onClickWithIndex={(index) => setIndex(index + 2)}
          allowClickOnLastItem={(index) => handleClickOnLastItem()}
        />
      </Carousel>
    </div>
  )
}

export default MakeOrder
