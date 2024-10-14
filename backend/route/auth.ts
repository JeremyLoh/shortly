import { Request, Response, Router } from "express"
import passport from "passport"
import "../auth/strategy/local-strategy.js"

const router = Router()

router.post("/api/auth", passport.authenticate("local"), (req, res) => {
  // TODO login if auth is proper (username and password)
  res.sendStatus(200)
})

// @ts-ignore
router.post("/api/auth/logout", (req: Request, res: Response) => {
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
})

export default router
