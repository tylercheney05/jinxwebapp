const express = require("express")
const cookie = require("cookie")

const router = express.Router()

router.patch("/api/locations/set-cookie", async (req, res) => {
  const { locationId } = req.body

  try {
    res.setHeader("Set-Cookie", [
      cookie.serialize("locationId", locationId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        path: "/api/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      }),
    ])
    return res.status(200).json({ locationId })
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!" })
  }
})

module.exports = router
