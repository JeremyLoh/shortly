// Mocks need to be imported before vitest import!
import { getRateLimiterMocks } from "../mocks.js"
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
import { Express } from "express"
import request from "supertest"
import pool, { setupDatabase } from "../../database.js"

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
        default: getRateLimiterMocks(),
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
    async function createUrl(cookie: any, expectedUrl: string) {
      const createResponse = await request(app)
        .post("/api/shorten")
        .set("cookie", cookie)
        .set("Accept", "application/json")
        .send({ url: expectedUrl })
      return createResponse.body
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
      expect(response.body).toEqual(
        expect.objectContaining({ urls: [], total: "0" })
      )
    })

    test("should return one user created short url when user is logged in", async () => {
      const password = "12345678"
      await createAccount(username, password)
      const loginResponse = await loginAccount(username, password)
      const expectedUrl = "http://example.com"
      const expectedCreateUrl = await createUrl(
        loginResponse.headers["set-cookie"],
        expectedUrl
      )
      const historyResponse = await request(app)
        .post("/api/account/history")
        .set("cookie", loginResponse.headers["set-cookie"])
        .send({ id: loginResponse.body.id })
      expect(historyResponse.status).toBe(200)
      expect(historyResponse.body).toEqual(
        expect.objectContaining({
          urls: expect.arrayContaining([expectedCreateUrl]),
          total: "1",
        })
      )
    })

    test("should reject page param that is not a number", async () => {
      const password = "12345678"
      await createAccount(username, password)
      const loginResponse = await loginAccount(username, password)
      const historyResponse = await request(app)
        .post("/api/account/history")
        .set("cookie", loginResponse.headers["set-cookie"])
        .send({ id: loginResponse.body.id })
        .query({ page: "abc" })
      expect(historyResponse.status).toBe(400)
    })

    test("should reject page param that is a negative number", async () => {
      const password = "12345678"
      await createAccount(username, password)
      const loginResponse = await loginAccount(username, password)
      const historyResponse = await request(app)
        .post("/api/account/history")
        .set("cookie", loginResponse.headers["set-cookie"])
        .send({ id: loginResponse.body.id })
        .query({ page: "-1" })
      expect(historyResponse.status).toBe(400)
    })

    test("should return paginated list of created short urls when user is logged in", async () => {
      const password = "12345678"
      await createAccount(username, password)
      const loginResponse = await loginAccount(username, password)
      const createdUrls = []
      for (let i = 0; i < 11; i++) {
        const expectedCreateUrl = await createUrl(
          loginResponse.headers["set-cookie"],
          "http://example" + i + ".com"
        )
        createdUrls.push(expectedCreateUrl)
      }

      // expect 10 urls for first page, 1 url for second page
      const firstPageHistoryResponse = await request(app)
        .post("/api/account/history")
        .set("cookie", loginResponse.headers["set-cookie"])
        .send({ id: loginResponse.body.id })
      expect(firstPageHistoryResponse.status).toBe(200)
      expect(firstPageHistoryResponse.body).toEqual(
        expect.objectContaining({
          urls: expect.arrayContaining(createdUrls.slice(0, 10)),
          total: "11",
        })
      )
      // expect only last url to be present for page 2
      const secondPageHistoryResponse = await request(app)
        .post("/api/account/history")
        .set("cookie", loginResponse.headers["set-cookie"])
        .send({ id: loginResponse.body.id })
        .query({ page: "2" })
      expect(secondPageHistoryResponse.status).toBe(200)
      expect(secondPageHistoryResponse.body).toEqual(
        expect.objectContaining({
          urls: expect.arrayContaining(createdUrls.slice(10, 11)),
          total: "11",
        })
      )
    })
  })
})
