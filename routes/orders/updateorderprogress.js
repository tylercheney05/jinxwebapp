const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.patch("/api/orders/:id/update-in-progress", async (req, res) => {
  const { is_in_progress, is_complete } = req.body
  const { access } = req.cookies
  const { id } = req.params

  const body = JSON.stringify({ is_in_progress, is_complete })
  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/orders/${id}/update-in-progress/`, {
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
