import setupApp from "../../server.js"
import { afterEach, beforeAll, beforeEach, describe, test, vi } from "vitest"
import { NextFunction, Request, Response, Express } from "express"
import request from "supertest"

function getMockMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => next()
}

describe("Auth API", () => {
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
  })

  beforeEach(() => {
    vi.mock("../../middleware/rateLimiter.js", () => {
      return {
        default: {
          readShortUrlLimiter: getMockMiddleware(),
          createShortUrlLimiter: getMockMiddleware(),
          updateShortUrlLimiter: getMockMiddleware(),
          deleteShortUrlLimiter: getMockMiddleware(),
          loginAccountLimiter: getMockMiddleware(),
          logoutAccountLimiter: getMockMiddleware(),
          createAccountLimiter: getMockMiddleware(),
        },
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("POST /api/auth/login", () => {
    test("should reject login with account that does not exist", async () => {
      const response = await request(app).post("/api/auth/login").send({})
      // console.log(response)
      // TODO
    })
  })
})
