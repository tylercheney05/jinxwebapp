const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.patch("/api/orders/:id/complete-order", async (req, res) => {
  const { is_paid } = req.body
  const { access } = req.cookies
  const { id } = req.params

  const body = JSON.stringify({ is_paid })
  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/orders/${id}/complete-order/`, {
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
