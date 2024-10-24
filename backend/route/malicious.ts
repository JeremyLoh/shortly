import { Router } from "express"
import { isValidHttpUrl } from "../validation/url.js"

const router = Router()

router.post("/api/malicious/check-url", (req, res) => {
  if (req.body.url == null) {
    res.status(400).json({ error: "Please provide a url" })
    return
  }
  if (!isValidHttpUrl(req.body.url)) {
    res.status(400).json({ error: "Please provide a valid url" })
  }
  res.status(200).json({ verdict: "safe" })
})

export default router
