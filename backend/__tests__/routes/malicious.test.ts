import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest"
import request from "supertest"
import { Express, NextFunction, Request, Response } from "express"
import setupApp from "../../server.js"
import pool, { setupDatabase } from "../../database.js"

function getMockMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => next()
}

describe("Malicious API to check urls", () => {
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
    await setupDatabase(pool)
  })

  beforeEach(async () => {
    await pool.query("DELETE FROM users")
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
          checkLoginStatusLimiter: getMockMiddleware(),
        },
      }
    })
  })

  afterEach(async () => {
    await pool.query("DELETE FROM users")
    vi.restoreAllMocks()
  })

  describe("POST /api/malicious/check-url", () => {
    test("should detect safe url", async () => {
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({
          url: "https://github.com/",
        })
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({ verdict: "safe" })
      )
    })
  })
})
