const express = require("express")
const cookieParser = require("cookie-parser")
const path = require("path")

require("dotenv").config()

// import auth routes
const registerRoute = require("./routes/auth/register")
const loginRoute = require("./routes/auth/login")
const logoutRoute = require("./routes/auth/logout")
const meRoute = require("./routes/auth/me")
const verifyRoute = require("./routes/auth/verify")
const refreshRoute = require("./routes/auth/refresh")

// import soda routes
const createSodaRoute = require("./routes/sodas/create")
const listSodasRoute = require("./routes/sodas/list")
const dropdownSodasRoute = require("./routes/sodas/dropdown")

// import flavor groups routes
const createFlavorGroupRoute = require("./routes/flavorgroups/create")
const listFlavorGroupsRoute = require("./routes/flavorgroups/list")
const dropdownFlavorGroupsRoute = require("./routes/flavorgroups/dropdown")
const updateFlavorGroupRoute = require("./routes/flavorgroups/update")

// import flavor routes
const createFlavorRoute = require("./routes/flavors/create")
const listFlavorsRoute = require("./routes/flavors/list")
const dropdownFlavorsRoute = require("./routes/flavors/dropdown")
const detailFlavorRoute = require("./routes/flavors/detail")

// import menu item routes
const createMenuItemRoute = require("./routes/menuitems/create")
const listMenuItemsRoute = require("./routes/menuitems/list")
const detailMenuItemRoute = require("./routes/menuitems/detail")

// import cup routes
const createCupRoute = require("./routes/cups/create")
const listCupsRoute = require("./routes/cups/list")
const dropdownCupsRoute = require("./routes/cups/dropdown")
const detailCupRoute = require("./routes/cups/detail")
const updateCupRoute = require("./routes/cups/update")

// import order item routes
const createOrderItemRoute = require("./routes/orderitems/create")
const listOrderItemsRoute = require("./routes/orderitems/list")
const deleteOrderItemRoute = require("./routes/orderitems/delete")
const getPriceOrderItemRoute = require("./routes/orderitems/getprice")

// import order routes
const listUserOrdersRoute = require("./routes/orders/userorderslist")
const completeOrderPaymentRoute = require("./routes/orders/completeorder")
const listOrdersQueueRoute = require("./routes/orders/ordersqueuelist")
const detailOrderRoute = require("./routes/orders/detail")
const updateOrderProgressRoute = require("./routes/orders/updateorderprogress")
const deleteOrderRoute = require("./routes/orders/delete")
const pendingOrdersRoute = require("./routes/orders/pendingorders")
const partialUpdateOrderRoute = require("./routes/orders/partialupdate")

// import locations routes
const createLocationRoute = require("./routes/locations/create")
const listLocationsRoute = require("./routes/locations/list")
const dropdownLocationsRoute = require("./routes/locations/dropdown")
const setCookieLocationRoute = require("./routes/locations/setCookie")
const getCookieLocationRoute = require("./routes/locations/getcookie")
const detailLocationRoute = require("./routes/locations/detail")

// import order name routes
const createOrderNameRoute = require("./routes/ordernames/create")
const listOrderNamesRoute = require("./routes/ordernames/list")
const dropdownOrderNamesRoute = require("./routes/ordernames/dropdown")
const updateOrderNameRoute = require("./routes/ordernames/update")
const deleteOrderNameRoute = require("./routes/ordernames/delete")

// import limited time offer routes
const createLimitedTimePromoRoute = require("./routes/limitedtimepromos/create")
const listLimitedTimePromosRoute = require("./routes/limitedtimepromos/list")
const dropdownLimitedTimePromosRoute = require("./routes/limitedtimepromos/dropdown")
const updateLimitedTimePromoRoute = require("./routes/limitedtimepromos/update")

// import discount routes
const listDiscountsRoute = require("./routes/discounts/list")
const createDiscountRoute = require("./routes/discounts/create")
const dropdownDiscountRoute = require("./routes/discounts/dropdown")

const app = express()

app.use(express.json())
app.use(cookieParser())

// Auth Routes
app.use(registerRoute)
app.use(loginRoute)
app.use(logoutRoute)
app.use(meRoute)
app.use(verifyRoute)
app.use(refreshRoute)

// Soda Routes
app.use(createSodaRoute)
app.use(listSodasRoute)
app.use(dropdownSodasRoute)

// Flavor Group Routes
app.use(createFlavorGroupRoute)
app.use(listFlavorGroupsRoute)
app.use(dropdownFlavorGroupsRoute)
app.use(updateFlavorGroupRoute)

// Flavor Routes
app.use(createFlavorRoute)
app.use(listFlavorsRoute)
app.use(dropdownFlavorsRoute)
app.use(detailFlavorRoute)

// Menu Item Routes
app.use(createMenuItemRoute)
app.use(listMenuItemsRoute)
app.use(detailMenuItemRoute)

// Cup Routes
app.use(createCupRoute)
app.use(listCupsRoute)
app.use(dropdownCupsRoute)
app.use(detailCupRoute)
app.use(updateCupRoute)

// Order Item Routes
app.use(createOrderItemRoute)
app.use(listOrderItemsRoute)
app.use(deleteOrderItemRoute)
app.use(getPriceOrderItemRoute)

// Order Routes
app.use(listUserOrdersRoute)
app.use(completeOrderPaymentRoute)
app.use(detailOrderRoute)
app.use(updateOrderProgressRoute)
app.use(listOrdersQueueRoute)
app.use(deleteOrderRoute)
app.use(pendingOrdersRoute)
app.use(partialUpdateOrderRoute)

// Locations Routes
app.use(createLocationRoute)
app.use(listLocationsRoute)
app.use(dropdownLocationsRoute)
app.use(setCookieLocationRoute)
app.use(getCookieLocationRoute)
app.use(detailLocationRoute)

// Order Name Routes
app.use(createOrderNameRoute)
app.use(listOrderNamesRoute)
app.use(dropdownOrderNamesRoute)
app.use(updateOrderNameRoute)
app.use(deleteOrderNameRoute)

// Limited Time Offer Routes
app.use(createLimitedTimePromoRoute)
app.use(listLimitedTimePromosRoute)
app.use(dropdownLimitedTimePromosRoute)
app.use(updateLimitedTimePromoRoute)

// Discount Routes
app.use(listDiscountsRoute)
app.use(createDiscountRoute)
app.use(dropdownDiscountRoute)

app.use(express.static("client/build"))
app.get("*", (req, res) => {
  return res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
