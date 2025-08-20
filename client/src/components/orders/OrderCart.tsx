import { useGetOrderItemListQuery } from "services/orders"
import { AppDispatch, RootState } from "store"
import { useDispatch, useSelector } from "react-redux"
import OrderContentItems from "./OrderContentItems"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
import DoubleClickButton from "../ui/button/doubleclickbutton"
import { deleteOrder } from "features/orders"
import { toast } from "react-toastify"
import useMediaQuery from "@mui/material/useMediaQuery"

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderCart = ({ setOpen }: Props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.user)
  const { data } = useGetOrderItemListQuery(
    {
      order__collected_by: String(user?.id),
      order__is_paid: "false",
    },
    { refetchOnMountOrArgChange: true }
  )
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const totalPrice = data?.reduce((acc, item) => acc + item.price, 0) || 0

  const handleClick = () => {
    if (data && data.length > 0) {
      const orderId = data[0].order__id
      setOpen(false)
      setTimeout(() => {
        navigate(`/checkout-order/${orderId}`)
      }, 250)
    }
  }

  const handleClearCart = () => {
    if (data && data.length > 0 && user?.id) {
      dispatch(deleteOrder({ id: data[0].order__id, collected_by: user.id })).then((data) => {
        if (data.meta.requestStatus === "fulfilled") {
          const notify = () => toast.success("Cart cleared successfully")
          notify()
        } else if (data.meta.requestStatus === "rejected") {
          const notify = () => toast.error("Error clearing cart")
          notify()
        }
      })
    }
  }

  return (
    <div className={`xs:w-[200px] sm:w-[500px] p-8 max-h-[${isDesktop ? 600 : 800}px] overflow-auto`}>
      {data && data?.length > 0 && (
        <div className="mb-8 flex gap-4">
          <Button variant="default" onClick={handleClick}>
            Go to cart
          </Button>
          <DoubleClickButton variant="destructive" onClick={handleClearCart} smallConfirm>
            Clear cart
          </DoubleClickButton>
        </div>
      )}
      <OrderContentItems data={data} />
      <div className="mt-4">
        <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
      </div>
    </div>
  )
}

export default OrderCart
