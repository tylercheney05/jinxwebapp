const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.get("/api/locations/get-cookie", async (req, res) => {
  const { locationId } = req.cookies

  try {
    if (locationId) {
      return res.json({ locationId })
    }
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!" })
  }
})

module.exports = router
