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
      const password = "12345678"
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

    test("should reject login with account with incorrect credentials", async () => {
      const username = "test_username"
      const password = "12345678"
      const incorrectPassword = "incorrectPassword"
      const createAccountResponse = await request(app)
        .post("/api/auth/users")
        .send({ username: username, password: password })
      expect(createAccountResponse.status).toBe(201)

      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ username: username, password: incorrectPassword })
      expect(loginResponse.status).toBe(401)
      expect(loginResponse.body).toEqual({})
      expect(loginResponse.headers["set-cookie"]).toBeUndefined()
    })

    test("should reject login with account with missing password", async () => {
      const username = "test_username"
      const password = "12345678"
      const createAccountResponse = await request(app)
        .post("/api/auth/users")
        .send({ username: username, password: password })
      expect(createAccountResponse.status).toBe(201)

      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ username: username })
      expect(loginResponse.status).toBe(400)
      expect(loginResponse.headers["set-cookie"]).toBeUndefined()
      expect(loginResponse.body).toEqual({})
    })

    test("should reject login with missing username and password", async () => {
      const loginResponse = await request(app).post("/api/auth/login").send({})
      expect(loginResponse.status).toBe(400)
      expect(loginResponse.headers["set-cookie"]).toBeUndefined()
      expect(loginResponse.body).toEqual({})
    })

    test("should reject login with missing account username", async () => {
      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ password: "12345678" })
      expect(loginResponse.status).toBe(400)
      expect(loginResponse.headers["set-cookie"]).toBeUndefined()
      expect(loginResponse.body).toEqual({})
    })
  })

  describe("POST /api/auth/users", () => {
    test("should create new account with username that does not exist", async () => {
      const username = "test_username"
      const password = "12345678"
      const createAccountResponse = await request(app)
        .post("/api/auth/users")
        .send({ username: username, password: password })
      expect(createAccountResponse.status).toBe(201)
    })

    test("should not create account with username that already exists", async () => {
      const username = "test_username"
      const password = "12345678"
      const createAccountResponse = await request(app)
        .post("/api/auth/users")
        .send({ username: username, password: password })
      expect(createAccountResponse.status).toBe(201)

      const createDuplicateAccountResponse = await request(app)
        .post("/api/auth/users")
        .send({ username: username, password: "secondAccountPassword" })
      expect(createDuplicateAccountResponse.status).toBe(400)
      expect(createDuplicateAccountResponse.body).toEqual(
        expect.objectContaining({
          error: "Could not create user",
        })
      )
    })
  })
})
