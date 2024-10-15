import "../auth/strategy/local-strategy.js"
import passport from "passport"
import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { createUserValidationSchema } from "../validation/schema.js"
import { createUser } from "../model/user.js"
import rateLimit from "express-rate-limit"

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})
const logoutLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})
const createUserLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  limit: 2,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})

router.post(
  "/api/auth/login",
  loginLimiter,
  passport.authenticate("local"),
  (req, res) => {
    // login and get cookie if auth is proper (username and password)
    res.sendStatus(200)
  }
)

router.post(
  "/api/auth/logout",
  logoutLimiter,
  // @ts-ignore
  (req: Request, res: Response) => {
    if (!req.user) {
      return res.sendStatus(401)
    }
    req.logout((error) => {
      if (error) {
        res.sendStatus(400)
      } else {
        res.sendStatus(200)
      }
    })
  }
)

router.post(
  "/api/auth/users",
  createUserLimiter,
  checkSchema(createUserValidationSchema(), ["body"]),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ error: errors.array().map((e) => e.msg) })
      return
    }
    const { username, password } = matchedData(req)
    try {
      const newUser = await createUser(username, password)
      res.status(201).send(newUser)
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }
)

export default router
