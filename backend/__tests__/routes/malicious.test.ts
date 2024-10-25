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
import pool, { populateMaliciousFeeds, setupDatabase } from "../../database.js"
import maliciousModel from "../../model/malicious.js"

function getMockMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => next()
}

describe("Malicious API to check urls", () => {
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
    await setupDatabase(pool)
    await populateMaliciousFeeds()
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
    test("should reject missing url", async () => {
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({})
      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({ error: "Please provide a url" })
      )
    })

    test("should reject invalid url with missing HTTP protocol", async () => {
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({ url: "invalid.com" })
      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({ error: "Please provide a valid url" })
      )
    })

    test("should reject invalid url with missing domain", async () => {
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({ url: "http://invalid" })
      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({ error: "Please provide a valid url" })
      )
    })

    test("should reject invalid url with two urls separated by space", async () => {
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({ url: "http://test.com http://test.co" })
      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({ error: "Please provide a valid url" })
      )
    })

    test("should reject invalid url consisting of protocol and only dots", async () => {
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({ url: "http://.." })
      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({ error: "Please provide a valid url" })
      )
    })

    test("should detect safe url", async () => {
      const spy = vi.spyOn(maliciousModel, "isMaliciousUrl")
      spy.mockImplementationOnce(() => new Promise((resolve) => resolve(false)))

      const expectedSafeUrl = "https://github.com/"
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({
          url: expectedSafeUrl,
        })
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({ verdict: "safe" })
      )
      expect(spy).toHaveBeenCalledOnce()
      expect(spy).toHaveBeenCalledWith(expectedSafeUrl)
    })

    test("should reject malicious url", async () => {
      const spy = vi.spyOn(maliciousModel, "isMaliciousUrl")
      spy.mockImplementationOnce(() => new Promise((resolve) => resolve(true)))

      const expectedMaliciousUrl = "https://test.com"
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({
          url: expectedMaliciousUrl,
        })
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({ verdict: "malicious" })
      )
      expect(spy).toHaveBeenCalledOnce()
      expect(spy).toHaveBeenCalledWith(expectedMaliciousUrl)
    })
  })
})
