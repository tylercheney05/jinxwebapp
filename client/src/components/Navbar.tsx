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

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated } = useSelector((state: RootState) => state.user)
  const pathname = window.location.pathname
  const authLinks = (
    <>
      <NavigationMenuItem>
        <Link to="/dashboard">
          <NavigationMenuLink active={pathname === "/dashboard"} className={navigationMenuTriggerStyle()}>
            Dashboard
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink
          className={cn("cursor-pointer", navigationMenuTriggerStyle())}
          onClick={() => dispatch(logout())}
        >
          Logout
        </NavigationMenuLink>
      </NavigationMenuItem>
    </>
  )

  const guestLinks = (
    <>
      <NavigationMenuItem>
        <Link to="/login">
          <NavigationMenuLink active={pathname === "/login"} className={navigationMenuTriggerStyle()}>
            Login
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link to="/register">
          <NavigationMenuLink active={pathname === "/register"} className={navigationMenuTriggerStyle()}>
            Register
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </>
  )

  return (
    <NavigationMenu>
      <div className="pull-left w-full">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink active={pathname === "/"} className={navigationMenuTriggerStyle()}>
                Jinx Soda
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
