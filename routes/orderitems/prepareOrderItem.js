const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.patch("/api/orders/items/:id/prepare-order-item", async (req, res) => {
  const { is_prepared } = req.body
  const { access } = req.cookies
  const { id } = req.params

  const body = JSON.stringify({ is_prepared })
  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/orders/items/${id}/prepare-order-item/`, {
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
