import { Router } from "express"
import shortenRouter from "./shorten.js"

const router = Router()

router.use(shortenRouter)

export default router
