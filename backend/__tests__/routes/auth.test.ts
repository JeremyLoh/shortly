import setupApp from "../../server.js"
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest"
import { NextFunction, Request, Response, Express } from "express"
import request from "supertest"
import pool, { setupDatabase } from "../../database.js"

function getMockMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => next()
}

describe("Auth API", () => {
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
        },
      }
    })
  })

  afterEach(async () => {
    await pool.query("DELETE FROM users")
    vi.restoreAllMocks()
  })

  describe("POST /api/auth/login", () => {
    test("should reject login with account that does not exist", async () => {
      const response = await request(app).post("/api/auth/login").send({})
      expect(response.status).toBe(400)
    })

    test("should accept login with account that exists with correct credentials", async () => {
      const username = "test_username"
      const password = "userpassword"
      const createAccountResponse = await request(app)
        .post("/api/auth/users")
        .send({ username: username, password: password })
      expect(createAccountResponse.status).toBe(201)

      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ username: username, password: password })
      expect(loginResponse.status).toBe(200)
      expect(loginResponse.headers["set-cookie"]).toEqual(
        expect.arrayContaining([
          expect.stringMatching("connect.sid=.+Expires=.+"),
        ])
      )
    })
  })
})
