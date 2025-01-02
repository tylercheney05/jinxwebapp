const express = require("express")
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args))

const router = express.Router()

router.delete("/api/orders/:id", async (req, res) => {
  const { access } = req.cookies
  const { id } = req.params

  try {
    const apiRes = await fetch(`${process.env.API_URL}/api/orders/${id}/`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access}`,
      },
    })

    return res.status(apiRes.status).json({ message: "Order deleted successfully" })
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong!" })
  }
})

module.exports = router
