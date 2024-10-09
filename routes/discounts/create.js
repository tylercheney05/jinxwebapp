const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.post("/api/orders/discounts", async (req, res) => {
  const { name, code, percent_or_price, percent, price, is_cup_specific, cup } = req.body
  const { access } = req.cookies

  const body = JSON.stringify({ name, code, percent_or_price, percent, price, is_cup_specific, cup })
  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/orders/discounts/`, {
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
