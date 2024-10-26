import { Router } from "express"
import shortenRouter from "./shorten.js"
import authRouter from "./auth.js"
import maliciousRouter from "./malicious.js"

const router = Router()

router.use(authRouter)
router.use(shortenRouter)
router.use(maliciousRouter)

export default router
