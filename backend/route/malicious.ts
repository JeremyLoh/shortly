import { Router } from "express"
import { isValidHttpUrl } from "../validation/url.js"
import malicious from "../model/malicious.js"

const router = Router()

router.post("/api/malicious/check-url", async (req, res) => {
  const url = req.body.url
  if (url == null) {
    res.status(400).json({ error: "Please provide a url" })
    return
  }
  if (!isValidHttpUrl(url)) {
    res.status(400).json({ error: "Please provide a valid url" })
    return
  }
  if (await malicious.isMaliciousUrl(url)) {
    res.status(200).json({ verdict: "malicious" })
    return
  }
  res.status(200).json({ verdict: "safe" })
})

export default router
