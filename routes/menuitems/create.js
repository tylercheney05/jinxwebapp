const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.post("/api/menu-items", async (req, res) => {
  const { name, soda, flavors, limited_time_menu_item, price } = req.body
  const { access } = req.cookies

  const body = JSON.stringify({ name, soda, flavors, limited_time_menu_item, price })
  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/menu-items/`, {
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
