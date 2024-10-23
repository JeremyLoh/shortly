import "../auth/strategy/local-strategy.js"
import passport from "passport"
import { Request, Response, Router } from "express"
import { checkSchema, matchedData, validationResult } from "express-validator"
import { createUserValidationSchema } from "../validation/schema.js"
import { createUser } from "../model/user.js"
import rateLimiter from "../middleware/rateLimiter.js"

const router = Router()

router.get(
  "/api/auth/status",
  rateLimiter.checkLoginStatusLimiter,
  // @ts-ignore
  (req, res) => {
    // check passportjs user object for cookie expiry (req.user)
    return req.user && req.session.cookie
      ? res.sendStatus(200)
      : res.sendStatus(404)
  }
)

router.post(
  "/api/auth/login",
  rateLimiter.loginAccountLimiter,
  passport.authenticate("local"),
  (req, res) => {
    // login and get cookie if auth is proper (username and password)
    res.status(200).json(req.user)
  }
)

router.post(
  "/api/auth/logout",
  rateLimiter.logoutAccountLimiter,
  // @ts-ignore
  (req: Request, res: Response) => {
    // https://stackoverflow.com/questions/31641884/does-passports-logout-function-remove-the-cookie-if-not-how-does-it-work
    if (!req.user) {
      return res.sendStatus(401)
    }
    req.logout((error) => {
      if (error) {
        res.sendStatus(400)
        return
      }
      req.session.destroy((error) => {
        if (error) {
          res.sendStatus(400)
        } else {
          res.sendStatus(200)
        }
      })
    })
  }
)

router.post(
  "/api/auth/users",
  rateLimiter.createAccountLimiter,
  checkSchema(createUserValidationSchema(), ["body"]),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ error: errors.array().map((e) => e.msg) })
      return
    }
    const { username, password } = matchedData(req)
    try {
      await createUser(username, password)
      res.sendStatus(201)
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }
)

export default router
