import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { LocationIcon, NoLocationIcon, SodaIcon } from "components/Icons"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "store"
import { listUserOrders } from "features/orders"
import { NavigationMenuContent, NavigationMenuTrigger } from "@radix-ui/react-navigation-menu"
import LocationContent from "components/locations/LocationContent"
import useMediaQuery from "@mui/material/useMediaQuery"
import { Drawer, DrawerContent, DrawerTrigger } from "components/ui/drawer"
import { ScrollArea } from "components/ui/scroll-area"
import OrderCart from "components/orders/OrderCart"

const StaffNavigationMenuItems = () => {
  const pathname = window.location.pathname
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.user)
  const { orders } = useSelector((state: RootState) => state.orders)
  const { locationId } = useSelector((state: RootState) => state.location)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [open, setOpen] = useState(false)

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
                {locationId ? <OrderCart setOpen={setOpen} /> : <LocationContent />}
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem className="flex pb-[5px] pr-[15px]">
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger>
                  <SodaIcon size="20px" className="text-jinxBlue" />
                </DrawerTrigger>
                <DrawerContent>
                  <ScrollArea className="max-h-[500px] overflow-auto">
                    {locationId ? <OrderCart setOpen={setOpen} /> : <LocationContent />}
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
