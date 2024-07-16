import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuContent,
} from "components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "store"
import { logout } from "features/user"
import { cn } from "lib/utils"
import { JinxSodaLogoSingleLine } from "../logos/JinxSodaLogoSingleLine"
import { NavigationMenuTrigger } from "@radix-ui/react-navigation-menu"
import { MenuIcon } from "../Icons"
import StaffNavigationMenuItems from "./navigationmenuitems/StaffNavigationMenuItems"

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, user } = useSelector((state: RootState) => state.user)
  const pathname = window.location.pathname
  const authLinks = (
    <>
      {user && user.is_staff ? <StaffNavigationMenuItems /> : null}
      <NavigationMenuItem className="w-[35px]">
        <NavigationMenuTrigger className="flex items-center">
          <MenuIcon className="text-jinxRed" />
        </NavigationMenuTrigger>
        <NavigationMenuContent asChild>
          <ul className="w-[100px]">
            {user && user.is_admin ? (
              <li className="text-center w-full">
                <Link to="/admin">
                  <NavigationMenuLink active={pathname === "/admin"} className={navigationMenuTriggerStyle()}>
                    <div className="text-jinxRed">Admin</div>
                  </NavigationMenuLink>
                </Link>
              </li>
            ) : null}
            <li className="text-center w-full">
              <NavigationMenuLink
                className={cn("cursor-pointer", navigationMenuTriggerStyle())}
                onClick={() => dispatch(logout())}
              >
                <div className="text-jinxRed">Logout</div>
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
            <div className="font-semibold text-jinxRed">Login</div>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link to="/register">
          <NavigationMenuLink active={pathname === "/register"} className={navigationMenuTriggerStyle()}>
            <div className="font-semibold text-jinxRed">Register</div>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </>
  )

  return (
    <div className="flex justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink active={pathname === "/"} className={navigationMenuTriggerStyle()}>
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
