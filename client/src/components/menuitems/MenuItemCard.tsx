import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { MenuItemListItem } from "/types/MenuItemTypes"
import { cn } from "lib/utils"

interface Props {
  menuItem: MenuItemListItem
  isClickable?: boolean
}

const MenuItemCard = ({ menuItem, isClickable = false }: Props) => {
  return (
    <Card className={cn("min-h-[225px] w-[325px]", isClickable && "hover:bg-accent hover:cursor-pointer")}>
      <CardHeader className="px-6 pt-4 pb-2 text-left">
        <CardTitle className="text-sm">{menuItem.name}</CardTitle>
        <CardDescription>{menuItem.soda__name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-left">
          {menuItem.flavors.map((flavor) => (
            <div key={flavor.flavor__name}>
              {flavor.quantity} {flavor.flavor__flavor_group__uom__display} of {flavor.flavor__name}
            </div>
          ))}
        </div>
        <div className="text-jinxBlue flex gap-4 mt-2">
          {menuItem.cup_prices.map((cup_price) => (
            <div>
              <div>{cup_price.size__display}</div>
              <strong>${cup_price.price.toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default MenuItemCard
