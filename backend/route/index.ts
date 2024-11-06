import { Router } from "express"
import shortenRouter from "./shorten.js"
import authRouter from "./auth.js"
import maliciousRouter from "./malicious.js"
import historyRouter from "./history.js"

const router = Router()

router.use(authRouter)
router.use(shortenRouter)
router.use(maliciousRouter)
router.use(historyRouter)

export default router
