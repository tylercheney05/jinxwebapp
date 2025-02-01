import useMediaQuery from "@mui/material/useMediaQuery"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { MenuItemListItem } from "/types/menuItem"
import { cn } from "lib/utils"

interface Props {
  menuItem: MenuItemListItem
  isClickable?: boolean
}

const MenuItemCard = ({ menuItem, isClickable = false }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const flavorsString = menuItem.flavors
    .map((flavor) => flavor.flavor__name)
    .reduce((acc, flavor, index, array) => {
      if (index === 0) {
        return flavor
      } else if (index === array.length - 1) {
        return `${acc}, and ${flavor}`
      } else {
        return `${acc}, ${flavor}`
      }
    }, "")

  return (
    <Card
      className={cn(
        "h-[115px] sm:min-h-[225px] w-[325px] shadow-lg",
        isClickable && "hover:bg-accent hover:cursor-pointer"
      )}
    >
      <CardHeader className="px-6 pt-4 pb-2 text-left">
        <CardTitle className="text-sm">{menuItem.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {isDesktop && (
          <div className="text-muted-foreground text-left">
            {menuItem.flavors.map((flavor) => (
              <div key={flavor.flavor__name}>
                {flavor.quantity} {flavor.flavor__flavor_group__uom__display} of {flavor.flavor__name}
              </div>
            ))}
          </div>
        )}
        {!isDesktop && <div className="text-muted-foreground text-left flex">{flavorsString}</div>}
        {isDesktop && (
          <div className="text-jinxBlue flex gap-4 mt-2">
            {menuItem.cup_prices.map((cup_price) => (
              <div>
                <div>{cup_price.size__display}</div>
                <strong>${cup_price.price.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MenuItemCard
