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

// import order item routes
const createOrderItemRoute = require("./routes/orderitems/create")
const listOrderItemsRoute = require("./routes/orderitems/list")
const prepareOrderItemRoute = require("./routes/orderitems/prepareOrderItem")

// import order routes
const listUserOrdersRoute = require("./routes/orders/userorderslist")
const completeOrderPaymentRoute = require("./routes/orders/completeorder")
const listOrdersQueueRoute = require("./routes/orders/ordersqueuelist")
const detailOrderRoute = require("./routes/orders/detail")

// import locations routes
const createLocationRoute = require("./routes/locations/create")
const listLocationsRoute = require("./routes/locations/list")
const dropdownLocationsRoute = require("./routes/locations/dropdown")
const setCookieLocationRoute = require("./routes/locations/setCookie")
const getCookieLocationRoute = require("./routes/locations/getCookie")
const detailLocationRoute = require("./routes/locations/detail")

// import order name routes
const createOrderNameRoute = require("./routes/ordernames/create")
const listOrderNamesRoute = require("./routes/ordernames/list")
const dropdownOrderNamesRoute = require("./routes/ordernames/dropdown")

// import limited time offer routes
const createLimitedTimePromoRoute = require("./routes/limitedtimepromos/create")
const listLimitedTimePromosRoute = require("./routes/limitedtimepromos/list")

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

// Order Item Routes
app.use(createOrderItemRoute)
app.use(listOrderItemsRoute)
app.use(listOrdersQueueRoute)
app.use(prepareOrderItemRoute)

// Order Routes
app.use(listUserOrdersRoute)
app.use(completeOrderPaymentRoute)
app.use(detailOrderRoute)

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

// Limited Time Offer Routes
app.use(createLimitedTimePromoRoute)
app.use(listLimitedTimePromosRoute)

app.use(express.static("client/build"))
app.get("*", (req, res) => {
  return res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
