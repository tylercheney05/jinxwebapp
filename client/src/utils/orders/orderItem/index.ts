import { OrderItem } from "types/orderItem/orderItem"

export const getName = (order_item: OrderItem) => {
    if (order_item?.menu_item) {
      return order_item.menu_item.menu_item.name
    } else if (order_item?.menu_item_custom_order) {
      return order_item.menu_item_custom_order.menu_item_custom_order.name
    } else if (order_item?.custom_order) {
      return order_item.custom_order.custom_order.name
    }
    return ""
  }

export const getPrice = (order_item: OrderItem) => {
  if (order_item?.menu_item) {
    return order_item.menu_item.price
  } else if (order_item?.menu_item_custom_order) {
    return order_item.menu_item_custom_order.price
  } else if (order_item?.custom_order) {
    return order_item.custom_order.price
  }
  return 0
}