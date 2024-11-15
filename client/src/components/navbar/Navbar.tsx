import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuContent,
} from "components/ui/navigation-menu"
import { Link, useLocation, useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "store"
import { logout } from "features/user"
import { cn } from "lib/utils"
import { JinxSodaLogoSingleLine } from "../logos/JinxSodaLogoSingleLine"
import { NavigationMenuTrigger } from "@radix-ui/react-navigation-menu"
import { MenuIcon } from "../Icons"
import StaffNavigationMenuItems from "./navigationmenuitems/StaffNavigationMenuItems"
import useMediaQuery from "@mui/material/useMediaQuery"

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user)
  const location = useLocation()
  const pathname = location.pathname
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const authLinks = (
    <>
      {user && user.is_staff ? <StaffNavigationMenuItems /> : null}
      <NavigationMenuItem className="w-[35px]">
        <NavigationMenuTrigger className="flex items-center">
          <MenuIcon className="text-jinxBlue" />
        </NavigationMenuTrigger>
        <NavigationMenuContent asChild>
          <ul className="w-[100px]">
            {!isDesktop && (
              <>
                <li className="text-center w-full">
                  <Link to="/take-order">
                    <NavigationMenuLink active={pathname === "/take-order"} className={navigationMenuTriggerStyle()}>
                      <div className="text-jinxBlue">Take Order</div>
                    </NavigationMenuLink>
                  </Link>
                </li>
                <li className="text-center w-full">
                  <Link to="/make-orders">
                    <NavigationMenuLink active={pathname === "/make-orders"} className={navigationMenuTriggerStyle()}>
                      <div className="text-jinxBlue">Make Orders</div>
                    </NavigationMenuLink>
                  </Link>
                </li>
              </>
            )}
            {user && user.is_admin ? (
              <li className="text-center w-full">
                <Link to="/admin">
                  <NavigationMenuLink active={pathname === "/admin"} className={navigationMenuTriggerStyle()}>
                    <div className="text-jinxBlue">Admin</div>
                  </NavigationMenuLink>
                </Link>
              </li>
            ) : null}
            <li className="text-center w-full">
              <NavigationMenuLink
                className={cn("cursor-pointer", navigationMenuTriggerStyle())}
                onClick={() => dispatch(logout())}
              >
                <div className="text-jinxBlue">Logout</div>
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </>
  )

  const guestLinks = (
    <>
      <NavigationMenuItem>
        <Link to="/login">
          <NavigationMenuLink active={pathname === "/login"} className={navigationMenuTriggerStyle()}>
            <div className="font-semibold text-jinxBlue">Login</div>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      {/* <NavigationMenuItem>
        <Link to="/register">
          <NavigationMenuLink active={pathname === "/register"} className={navigationMenuTriggerStyle()}>
            <div className="font-semibold text-jinxBlue">Register</div>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem> */}
    </>
  )

  return (
    <div className="flex justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <JinxSodaLogoSingleLine />
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu>
        <NavigationMenuList>{isAuthenticated ? authLinks : guestLinks}</NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default Navbar
