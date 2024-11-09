import { Router } from "express"
import {
  query,
  Result,
  ValidationError,
  validationResult,
} from "express-validator"
import { getUrlHistory } from "../model/history.js"
import rateLimiter from "../middleware/rateLimiter.js"

const router = Router()

router.post(
  "/api/account/history",
  rateLimiter.getAccountHistoryUrlLimiter,
  query("page").optional().isInt({ min: 1 }),
  async (req, res) => {
    const result: Result<ValidationError> = validationResult(req)
    if (!result.isEmpty()) {
      res.sendStatus(400)
      return
    }
    const isLoggedInUser = req.user && req.session.cookie
    if (!isLoggedInUser) {
      res.sendStatus(404)
      return
    }
    const page = req.query && req.query.page ? req.query.page : "1"
    try {
      // @ts-ignore
      const { urls, total } = await getUrlHistory(req.user.id, page, "10")
      res.status(200).json({ urls, total })
    } catch (error) {
      res.sendStatus(500)
    }
  }
)

export default router
