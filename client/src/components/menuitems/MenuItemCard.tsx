import useMediaQuery from "@mui/material/useMediaQuery"
import { Card, CardContent, CardHeader, CardTitle } from "components/ui"
import { cn } from "lib/utils"
import { MenuItem, MenuItemFlavor } from "types"

interface Props {
  menuItem: MenuItem
  isClickable?: boolean
}

const MenuItemCard = ({ menuItem, isClickable = false }: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const flavorsString = menuItem.flavors
    .map((flavor: MenuItemFlavor) => flavor.flavor.name)
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
              <div key={flavor.flavor.name}>
                {flavor.quantity} {flavor.flavor.flavor_group.uom.display} of {flavor.flavor.name}
              </div>
            ))}
          </div>
        )}
        {!isDesktop && <div className="text-muted-foreground text-left flex">{flavorsString}</div>}
        {isDesktop && (
          <div className="text-jinxBlue flex gap-4 mt-2">
            {menuItem.cup_prices.map((cup_price) => (
              <div>
                <div>{cup_price.size.display}</div>
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
