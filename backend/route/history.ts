import { Router } from "express"
import { getUrlHistory } from "../model/history.js"
import {
  query,
  Result,
  ValidationError,
  validationResult,
} from "express-validator"

const router = Router()

router.post(
  "/api/account/history",
  query("page").optional().isInt({ min: 1 }),
  async (req, res) => {
    const result: Result<ValidationError> = validationResult(req)
    if (!result.isEmpty()) {
      res.sendStatus(400)
      return
    }
    if (req.user && req.session.cookie) {
      try {
        const page = req.query && req.query.page ? req.query.page : "1"
        // @ts-ignore
        const rows = await getUrlHistory(req.user.id, page, "10")
        res.status(200).json({ urls: rows })
      } catch (error) {
        res.sendStatus(400)
      }
    } else {
      res.sendStatus(404)
    }
  }
)

export default router
