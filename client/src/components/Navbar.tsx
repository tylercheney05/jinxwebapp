import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "store"
import { logout } from "features/user"
import { cn } from "lib/utils"
import { JinxSodaLogoSingleLine } from "./logos/JinxSodaLogoSingleLine"

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated } = useSelector((state: RootState) => state.user)
  const pathname = window.location.pathname
  const authLinks = (
    <>
      <NavigationMenuItem>
        <Link to="/dashboard">
          <NavigationMenuLink active={pathname === "/dashboard"} className={navigationMenuTriggerStyle()}>
            <div className="font-semibold">Dashboard</div>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink
          className={cn("cursor-pointer", navigationMenuTriggerStyle())}
          onClick={() => dispatch(logout())}
        >
          <div className="font-semibold">Logout</div>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  )

  const guestLinks = (
    <>
      <NavigationMenuItem>
        <Link to="/login">
          <NavigationMenuLink active={pathname === "/login"} className={navigationMenuTriggerStyle()}>
            <div className="font-semibold">Login</div>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link to="/register">
          <NavigationMenuLink active={pathname === "/register"} className={navigationMenuTriggerStyle()}>
            <div className="font-semibold">Register</div>
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </>
  )

  return (
    <NavigationMenu className="text-jinxRed">
      <div className="pull-left w-full">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink active={pathname === "/"} className={navigationMenuTriggerStyle()}>
                <JinxSodaLogoSingleLine />
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>
      <NavigationMenuList>{isAuthenticated ? authLinks : guestLinks}</NavigationMenuList>
    </NavigationMenu>
  )
}

export default Navbar
