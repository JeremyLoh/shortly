import { NextFunction, Request, Response, Router } from "express"
import { checkSchema, validationResult } from "express-validator"
import rateLimit, { Options } from "express-rate-limit"
import {
  createShortCodeValidationSchema,
  createUrlValidationSchema,
} from "../validation/schema.js"
import { isValidHttpUrl } from "../validation/url.js"
import {
  createNewUrl,
  deleteUrl,
  getOriginalUrl,
  getUrlStats,
  isExistingShortCode,
  updateUrl,
} from "../model/url.js"

const router = Router()
const readLimiter = rateLimit({
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
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 2,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})
const updateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})
const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1,
  standardHeaders: "draft-7",
  legacyHeaders: false,
})

router.post(
  "/api/shorten",
  createLimiter,
  checkSchema(createUrlValidationSchema(), ["body"]),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ error: errors.array().map((e) => e.msg) })
      return
    }
    const { url }: { url: string } = req.body
    if (!isValidHttpUrl(url)) {
      res.status(400).send({ error: "Please provide a valid http / https url" })
      return
    }
    try {
      const entry = await createNewUrl(url)
      res.status(201).send(entry)
    } catch (error: any) {
      res.status(500).send({ error: error.message || "Could not create url" })
    }
  }
)

router.get(
  "/api/shorten/:shortCode",
  readLimiter,
  checkSchema(createShortCodeValidationSchema(), ["params"]),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ error: errors.array().map((e) => e.msg) })
      return
    }
    const { shortCode } = req.params
    try {
      const entry = await getOriginalUrl(shortCode)
      if (entry == null) {
        res.sendStatus(404)
      } else {
        res.status(200).send(entry)
      }
    } catch (error: any) {
      res.status(500).send("Could not retrieve url information")
    }
  }
)

router.put(
  "/api/shorten/:shortCode",
  updateLimiter,
  checkSchema(createShortCodeValidationSchema(), ["params"]),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ error: errors.array().map((e) => e.msg) })
      return
    }
    const { shortCode } = req.params
    const { url }: { url: string } = req.body
    if (!isValidHttpUrl(url)) {
      res.sendStatus(400)
      return
    }
    if (!(await isExistingShortCode(shortCode))) {
      res.sendStatus(404)
      return
    }
    try {
      const entry = await updateUrl(shortCode, url)
      res.status(200).send(entry)
    } catch (error: any) {
      res.status(500).send("Could not update existing url")
    }
  }
)

router.delete(
  "/api/shorten/:shortCode",
  deleteLimiter,
  checkSchema(createShortCodeValidationSchema(), ["params"]),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ error: errors.array().map((e) => e.msg) })
      return
    }
    const { shortCode } = req.params
    if (!(await isExistingShortCode(shortCode))) {
      res.sendStatus(404)
      return
    }
    try {
      const isDeleted = await deleteUrl(shortCode)
      isDeleted ? res.sendStatus(204) : res.sendStatus(404)
    } catch (error: any) {
      res.status(500).send("Could not delete short url")
    }
  }
)

router.get(
  "/api/shorten/:shortCode/stats",
  readLimiter,
  checkSchema(createShortCodeValidationSchema(), ["params"]),
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).send({ error: errors.array().map((e) => e.msg) })
      return
    }
    const { shortCode } = req.params
    if (!(await isExistingShortCode(shortCode))) {
      res.sendStatus(404)
      return
    }
    try {
      const entry = await getUrlStats(shortCode)
      res.status(200).send(entry)
    } catch (error: any) {
      res.status(500).send("Could not get statistics for short url")
    }
  }
)

export default router
