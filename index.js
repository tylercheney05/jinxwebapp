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

// import soda routes
const createSodaRoute = require("./routes/sodas/create")
const listSodasRoute = require("./routes/sodas/list")

// import flavor routes
const createFlavorRoute = require("./routes/flavors/create")
const listFlavorsRoute = require("./routes/flavors/list")

const app = express()

app.use(express.json())
app.use(cookieParser())

// Auth Routes
app.use(registerRoute)
app.use(loginRoute)
app.use(logoutRoute)
app.use(meRoute)
app.use(verifyRoute)

// Soda Routes
app.use(createSodaRoute)
app.use(listSodasRoute)

// Flavor Routes
app.use(createFlavorRoute)
app.use(listFlavorsRoute)

app.use(express.static("client/build"))
app.get("*", (req, res) => {
  return res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
