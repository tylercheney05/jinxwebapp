const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.post("/api/locations", async (req, res) => {
  const { name, address, city, state, zip_code, is_event } = req.body
  const { access } = req.cookies

  const body = JSON.stringify({ name, address, city, state, zip_code, is_event })
  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/locations/`, {
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
