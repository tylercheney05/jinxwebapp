const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.post("/api/order-items", async (req, res) => {
  const { menu_item, cup, low_sugar, order__location, note, custom_order__soda, custom_order_flavors } = req.body
  const { access } = req.cookies

  const body = JSON.stringify({
    menu_item,
    cup,
    low_sugar,
    order__location,
    note,
    custom_order__soda,
    custom_order_flavors,
  })
  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/orders/items/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body,
    })

    const data = await apiRes.json()
    return res.status(apiRes.status).json(data)
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!" })
  }
})

module.exports = router
