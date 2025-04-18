const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.get("/api/limited-time-promotions/autocomplete", async (req, res) => {
  const { access } = req.cookies

  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/menu-items/limited-time-promotions/autocomplete/`, {
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
