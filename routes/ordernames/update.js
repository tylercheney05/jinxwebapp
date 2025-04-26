const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.put("/api/order-names/:id", async (req, res) => {
  const { name } = req.body
  const { access } = req.cookies
  const { id } = req.params

  const body = JSON.stringify({ name })
  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/orders/order-names/${id}/`, {
      method: "PUT",
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
