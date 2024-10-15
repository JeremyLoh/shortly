import { Router } from "express"
import shortenRouter from "./shorten.js"
import authRouter from "./auth.js"

const router = Router()

router.use(authRouter)
router.use(shortenRouter)

export default router
