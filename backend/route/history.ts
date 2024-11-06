import { Router } from "express"
import { getUrlHistory } from "../model/history.js"

const router = Router()

router.post("/api/account/history", async (req, res) => {
  if (req.user && req.session.cookie) {
    // TODO check for request query parameter ?page to paginate entries!
    // @ts-ignore
    const rows = await getUrlHistory(req.user.id)
    res.status(200).json({ urls: rows })
  } else {
    res.sendStatus(404)
  }
})

export default router
