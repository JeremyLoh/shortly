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
  let usernames: string[] = []

  beforeAll(async () => {
    app = await setupApp()
    await setupDatabase(pool)
  })

  beforeEach(async () => {
    await pool.query("DELETE FROM users WHERE username = ANY($1)", [usernames])
    usernames = []
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
    await pool.query("DELETE FROM users WHERE username = ANY($1)", [usernames])
    vi.restoreAllMocks()
  })

  describe("POST /api/auth/login", () => {
    test("should reject login with account that does not exist", async () => {
      const response = await request(app).post("/api/auth/login").send({})
      expect(response.status).toBe(400)
    })

    test("should accept login with account that exists with correct credentials", async () => {
      const username = "auth.test.ts_test_username00"
      usernames.push(username)

      const password = "12345678"
      const createAccountResponse = await request(app)
        .post("/api/auth/users")
        .send({ username: username, password: password })
      expect(createAccountResponse.status).toBe(201)

      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ username: username, password: password })
      expect(loginResponse.status).toBe(200)
      expect(loginResponse.body).toEqual(
        expect.objectContaining({ id: expect.any(String) })
      )
      expect(loginResponse.headers["set-cookie"]).toEqual(
        expect.arrayContaining([
          expect.stringMatching("connect.sid=.+Expires=.+"),
        ])
      )
    })

    test("should reject login with account with incorrect credentials", async () => {
      const username = "auth.test.ts_test_username01"
      usernames.push(username)

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
      const username = "auth.test.ts_test_username02"
      usernames.push(username)

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

  describe("POST /api/auth/logout", () => {
    // https://github.com/ladjs/supertest/issues/665
    test("should logout user that is currently logged in", async () => {
      const username = "auth.test.ts_test_username04"
      usernames.push(username)

      const password = "12345678"
      const createAccountResponse = await request(app)
        .post("/api/auth/users")
        .send({ username: username, password: password })
      expect(createAccountResponse.status).toBe(201)

      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ username, password })
      expect(loginResponse.status).toBe(200)

      const logoutResponse = await request(app)
        .post("/api/auth/logout")
        .set("Cookie", loginResponse.headers["set-cookie"])
      expect(logoutResponse.status).toBe(200)
      expect(logoutResponse.body).toEqual({})
      expect(logoutResponse.headers["set-cookie"]).toBeUndefined()
    })

    test("should return authorization error for no login cookie", async () => {
      const logoutResponse = await request(app).post("/api/auth/logout")
      expect(logoutResponse.status).toBe(401)
      expect(logoutResponse.body).toEqual({})
    })
  })

  describe("POST /api/auth/users", () => {
    test("should create new account with username that does not exist", async () => {
      const username = "auth.test.ts_test_username90"
      usernames.push(username)

      const password = "12345678"
      const createAccountResponse = await request(app)
        .post("/api/auth/users")
        .send({ username: username, password: password })
      expect(createAccountResponse.status).toBe(201)
    })

    test("should not create account with username that already exists", async () => {
      const username = "auth.test.ts_test_username560"
      usernames.push(username)

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

  describe("GET /api/auth/status", () => {
    test("should receive user auth status of HTTP 200 based on given valid cookie", async () => {
      const username = "auth.test.ts_test_username030"
      usernames.push(username)

      const password = "123456789"
      const createAccountResponse = await request(app)
        .post("/api/auth/users")
        .send({ username: username, password: password })
      expect(createAccountResponse.status).toBe(201)

      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({ username, password })
      expect(loginResponse.status).toBe(200)

      const { header } = loginResponse
      // Setting cookie in request - https://github.com/ladjs/supertest/issues/665
      const checkAuthStatusResponse = await request(app)
        .get("/api/auth/status")
        .set("Cookie", [...header["set-cookie"]])

      expect(checkAuthStatusResponse.status).toBe(200)
    })

    test("should receive user auth status of HTTP 404 based on given invalid cookie", async () => {
      // No cookie sent
      const checkAuthStatusResponse = await request(app).get("/api/auth/status")
      expect(checkAuthStatusResponse.status).toBe(404)
    })
  })
})
