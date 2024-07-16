const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.get("/api/orders", async (req, res) => {
  const { access } = req.cookies
  const queryParams = new URLSearchParams(req.query).toString()

  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/orders?${queryParams}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access}`,
      },
    })

    const data = await apiRes.json()
    return res.status(apiRes.status).json(data)
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!" })
  }
})

module.exports = router
