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

// import cup routes
const createCupRoute = require("./routes/cups/create")
const listCupsRoute = require("./routes/cups/list")
const dropdownCupsRoute = require("./routes/cups/dropdown")

// import order item routes
const createOrderItemRoute = require("./routes/orderitems/create")
const listOrderItemsRoute = require("./routes/orderitems/list")

// import order routes
const listOrdersRoute = require("./routes/orders/list")
const completeOrderRoute = require("./routes/orders/completeorder")

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

// Cup Routes
app.use(createCupRoute)
app.use(listCupsRoute)
app.use(dropdownCupsRoute)

// Order Item Routes
app.use(createOrderItemRoute)
app.use(listOrderItemsRoute)

// Order Routes
app.use(listOrdersRoute)
app.use(completeOrderRoute)

app.use(express.static("client/build"))
app.get("*", (req, res) => {
  return res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
