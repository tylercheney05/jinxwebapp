const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.patch("/api/orders/:id", async (req, res) => {
  const { access } = req.cookies
  const { id } = req.params

  const body = JSON.stringify(req.body)
  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/orders/${id}/`, {
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
