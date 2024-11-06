import setupApp from "../../server.js"
import {
  beforeAll,
  beforeEach,
  afterEach,
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

describe("History API", () => {
  let app: Express
  let username: string = "history.test.ts_test_username0000"

  beforeAll(async () => {
    app = await setupApp()
    await setupDatabase(pool)
  })

  beforeEach(async () => {
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
          checkMaliciousUrlLimiter: getMockMiddleware(),
        },
      }
    })
  })

  afterEach(async () => {
    const rows = (
      await pool.query("SELECT id FROM users WHERE username = $1", [username])
    ).rows
    if (rows[0]) {
      const { id } = rows[0]
      await pool.query(
        "DELETE FROM stats WHERE url_id IN (SELECT id FROM urls WHERE user_id = $1)",
        [id]
      )
      await pool.query("DELETE FROM urls WHERE user_id = $1", [id])
    }
    await pool.query("DELETE FROM users WHERE username = $1", [username])
    vi.restoreAllMocks()
  })

  describe("POST /api/account/history", () => {
    async function createAccount(username: string, password: string) {
      const createAccountResponse = await request(app)
        .post("/api/auth/users")
        .send({ username: username, password: password })
      expect(createAccountResponse.status).toBe(201)
    }
    async function loginAccount(username: string, password: string) {
      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ username: username, password: password })
      expect(loginResponse.status).toBe(200)
      return loginResponse
    }

    test("should reject if no login session is present in request", async () => {
      const response = await request(app)
        .post("/api/account/history")
        .send({ id: "1" })
      expect(response.status).toBe(404)
    })

    test("should return zero user created short url when newly created user is logged in", async () => {
      const password = "12345678"
      await createAccount(username, password)
      const loginResponse = await loginAccount(username, password)
      const response = await request(app)
        .post("/api/account/history")
        .set("cookie", loginResponse.headers["set-cookie"])
        .send({ id: loginResponse.body.id })
      expect(response.status).toBe(200)
      expect(response.body).toEqual(expect.objectContaining({ urls: [] }))
    })

    test("should return one user created short url when user is logged in", async () => {
      const password = "12345678"
      await createAccount(username, password)
      const loginResponse = await loginAccount(username, password)
      const expectedUrl = "http://example.com"
      const createResponse = await request(app)
        .post("/api/shorten")
        .set("cookie", loginResponse.headers["set-cookie"])
        .set("Accept", "application/json")
        .send({ url: expectedUrl })
      const expectedCreateUrl = createResponse.body

      const historyResponse = await request(app)
        .post("/api/account/history")
        .set("cookie", loginResponse.headers["set-cookie"])
        .send({ id: loginResponse.body.id })
      expect(historyResponse.status).toBe(200)
      expect(historyResponse.body).toEqual(
        expect.objectContaining({
          urls: expect.arrayContaining([expectedCreateUrl]),
        })
      )
    })
  })
})
