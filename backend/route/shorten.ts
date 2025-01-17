import { Request, Response, Router } from "express"
import { checkSchema, validationResult } from "express-validator"
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
import rateLimiter from "../middleware/rateLimiter.js"
import malicious from "../model/malicious.js"

const router = Router()

router.post(
  "/api/shorten",
  rateLimiter.createShortUrlLimiter,
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
    if (await malicious.isMaliciousUrl(url)) {
      res.status(400).send({ error: "Url is malicious" })
      return
    }
    try {
      // @ts-ignore
      const entry = await createNewUrl(url, req.user?.id)
      res.status(201).send(entry)
    } catch (error: any) {
      res.status(500).send({ error: error.message || "Could not create url" })
    }
  }
)

router.get(
  "/api/shorten/:shortCode",
  rateLimiter.readShortUrlLimiter,
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
  rateLimiter.updateShortUrlLimiter,
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
    if (await malicious.isMaliciousUrl(url)) {
      res.status(400).json({ error: ["Could not update due to malicious url"] })
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
  rateLimiter.deleteShortUrlLimiter,
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
  rateLimiter.readShortUrlLimiter,
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
