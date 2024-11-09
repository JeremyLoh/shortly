import rateLimit, { Options } from "express-rate-limit"
import { NextFunction, Request, Response } from "express"

function isLoggedIn(req: Request) {
  // @ts-ignore
  return req.user && req.user.id
}

const readShortUrlLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 10, // Limit each IP to "X" requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    options: Options
  ) => {
    res.status(options.statusCode).send(options.message)
  },
})

const createShortUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  limit: (req, res) => (isLoggedIn(req) ? 10 : 2),
  // @ts-ignore
  keyGenerator: (req, res) => (isLoggedIn(req) ? req.user.id : req.ip),
  standardHeaders: "draft-7",
  legacyHeaders: false,
})

const updateShortUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})

const deleteShortUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})

const loginAccountLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})

const logoutAccountLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})

const createAccountLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day
  limit: 2,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})

const checkLoginStatusLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})

const checkMaliciousUrlLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 1,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})

const getAccountHistoryUrlLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})

export default {
  readShortUrlLimiter,
  createShortUrlLimiter,
  updateShortUrlLimiter,
  deleteShortUrlLimiter,
  loginAccountLimiter,
  logoutAccountLimiter,
  createAccountLimiter,
  checkLoginStatusLimiter,
  checkMaliciousUrlLimiter,
  getAccountHistoryUrlLimiter,
}
