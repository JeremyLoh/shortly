import "../auth/strategy/local-strategy.js"
import passport from "passport"
import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { createUserValidationSchema } from "../validation/schema.js"
import { createUser } from "../model/user.js"
import {
  createAccountLimiter,
  loginAccountLimiter,
  logoutAccountLimiter,
} from "../middleware/rateLimiter.js"

const router = Router()

router.post(
  "/api/auth/login",
  loginAccountLimiter,
  passport.authenticate("local"),
  (req, res) => {
    // login and get cookie if auth is proper (username and password)
    res.sendStatus(200)
  }
)

router.post(
  "/api/auth/logout",
  logoutAccountLimiter,
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
  createAccountLimiter,
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
