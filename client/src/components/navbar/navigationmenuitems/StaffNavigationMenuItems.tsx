import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { LocationIcon, NoLocationIcon, SodaIcon } from "components/Icons"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { listOrders } from "features/orders"
import { NavigationMenuContent, NavigationMenuTrigger } from "@radix-ui/react-navigation-menu"
import OrderContent from "components/orders/OrderContent"
import LocationContent from "components/locations/LocationContent"

const StaffNavigationMenuItems = () => {
  const pathname = window.location.pathname
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.user)
  const { orders } = useSelector((state: RootState) => state.orders)
  const { locationId } = useSelector((state: RootState) => state.location)

  useEffect(() => {
    dispatch(listOrders({ completed_by: String(user?.id), is_paid: "false" }))
  }, [])

  return (
    <>
      <NavigationMenuItem>
        <Link to="/take-order">
          <NavigationMenuLink active={pathname === "/take-order"} className={navigationMenuTriggerStyle()}>
            <div className="font-semibold text-jinxBlue">Take Order</div>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      {orders.length > 0 && (
        <NavigationMenuItem className="flex pb-[5px] pr-[15px]">
          <NavigationMenuTrigger>
            <SodaIcon size="20px" className="text-jinxBlue" />
          </NavigationMenuTrigger>
          <NavigationMenuContent asChild>
            <OrderContent order={orders[0]} />
          </NavigationMenuContent>
        </NavigationMenuItem>
      )}
      <NavigationMenuItem className="flex pb-[5px] pr-[15px]">
        <NavigationMenuTrigger>
          {!locationId ? (
            <NoLocationIcon size="20px" className="text-jinxBlue" />
          ) : (
            <LocationIcon size="20px" className="text-jinxBlue" />
          )}
        </NavigationMenuTrigger>
        <NavigationMenuContent asChild>
          <LocationContent />
        </NavigationMenuContent>
      </NavigationMenuItem>
    </>
  )
}

export default StaffNavigationMenuItems
