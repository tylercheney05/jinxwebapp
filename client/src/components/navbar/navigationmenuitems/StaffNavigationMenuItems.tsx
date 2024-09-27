import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { LocationIcon, NoLocationIcon, SodaIcon } from "components/Icons"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { listUserOrders } from "features/orders"
import { NavigationMenuContent, NavigationMenuTrigger } from "@radix-ui/react-navigation-menu"
import OrderContent from "components/orders/OrderContent"
import LocationContent from "components/locations/LocationContent"
import { useMediaQuery } from "@material-ui/core"
import { Drawer, DrawerContent, DrawerTrigger } from "components/ui/drawer"
import { ScrollArea } from "components/ui/scroll-area"

const StaffNavigationMenuItems = () => {
  const pathname = window.location.pathname
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.user)
  const { orders } = useSelector((state: RootState) => state.orders)
  const { locationId } = useSelector((state: RootState) => state.location)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    dispatch(listUserOrders({ collected_by: String(user?.id), is_paid: "false" }))
  }, [])

  return (
    <>
      {isDesktop && (
        <>
          <NavigationMenuItem>
            <Link to="/take-order">
              <NavigationMenuLink active={pathname === "/take-order"} className={navigationMenuTriggerStyle()}>
                <div className="font-semibold text-jinxBlue">Take Order</div>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/make-orders">
              <NavigationMenuLink active={pathname === "/make-orders"} className={navigationMenuTriggerStyle()}>
                <div className="font-semibold text-jinxBlue">Make Orders</div>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </>
      )}
      {orders.length > 0 && (
        <>
          {isDesktop ? (
            <NavigationMenuItem className="flex pb-[5px] pr-[15px]">
              <NavigationMenuTrigger>
                <SodaIcon size="20px" className="text-jinxBlue" />
              </NavigationMenuTrigger>
              <NavigationMenuContent asChild>
                {locationId ? <OrderContent order={orders[0]} /> : <LocationContent />}
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem className="flex pb-[5px] pr-[15px]">
              <Drawer>
                <DrawerTrigger>
                  <SodaIcon size="20px" className="text-jinxBlue" />
                </DrawerTrigger>
                <DrawerContent>
                  <ScrollArea className="max-h-[500px] overflow-auto">
                    {locationId ? <OrderContent order={orders[0]} /> : <LocationContent />}
                  </ScrollArea>
                </DrawerContent>
              </Drawer>
            </NavigationMenuItem>
          )}
        </>
      )}
      {isDesktop ? (
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
      ) : (
        <NavigationMenuItem className="flex pb-[5px] pr-[15px]">
          <Drawer>
            <DrawerTrigger>
              {!locationId ? (
                <NoLocationIcon size="20px" className="text-jinxBlue" />
              ) : (
                <LocationIcon size="20px" className="text-jinxBlue" />
              )}
            </DrawerTrigger>
            <DrawerContent>
              <ScrollArea className="max-h-[500px] overflow-auto">
                <LocationContent />
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        </NavigationMenuItem>
      )}
    </>
  )
}

export default StaffNavigationMenuItems
