import { Router } from "express"

const router = Router()

router.post("/api/malicious/check-url", (req, res) => {
  res.status(200).json({ verdict: "safe" })
})

export default router
