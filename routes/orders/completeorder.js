const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.patch("/api/orders/:id/complete-order-payment", async (req, res) => {
  const { is_paid, order_name, paid_amount, discount } = req.body
  const { access } = req.cookies
  const { id } = req.params

  const body = JSON.stringify({ is_paid, order_name, paid_amount, discount })
  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/orders/${id}/complete-order-payment/`, {
      method: "PATCH",
      headers: {
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
