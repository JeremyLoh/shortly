// Mocks need to be imported before vitest import!
import { getRateLimiterMocks } from "../mocks.js"
import {
  afterEach,
  assert,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest"
import request from "supertest"
import { Express } from "express"
import setupApp from "../../server.js"
import pool, { populateMaliciousFeeds, setupDatabase } from "../../database.js"
import maliciousModel from "../../model/malicious.js"

describe("Malicious API to check urls", () => {
  let app: Express
  let maliciousUrls: string[]

  beforeAll(async () => {
    app = await setupApp()
    await setupDatabase(pool)
    await populateMaliciousFeeds()
  })

  beforeEach(async () => {
    maliciousUrls = []
    vi.mock("../../middleware/rateLimiter.js", () => {
      return {
        default: getRateLimiterMocks(),
      }
    })
    maliciousUrls.forEach(async (url) => await removeMockMaliciousUrl(url))
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    maliciousUrls.forEach(async (url) => await removeMockMaliciousUrl(url))
  })

  async function addMockMaliciousUrl(url: string) {
    const client = await pool.connect()
    try {
      await client.query(`INSERT INTO malicious_urls (url) VALUES ($1)`, [url])
    } catch (error) {
      console.error(error)
    } finally {
      client.release()
    }
  }

  async function removeMockMaliciousUrl(url: string) {
    const client = await pool.connect()
    try {
      await client.query(`DELETE FROM malicious_urls WHERE url = $1`, [url])
    } catch (error) {
      assert.fail("Could not delete mock malicious url " + url)
    } finally {
      client.release()
    }
  }

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

      const expectedSafeUrl = "https://github.com"
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
    })

    test("should reject malicious url with uppercase", async () => {
      const uppercaseMaliciousUrl = "HTTPS://TEST.COM"
      const expectedMaliciousUrl = "https://test.com/"
      maliciousUrls.push(expectedMaliciousUrl)
      await addMockMaliciousUrl(expectedMaliciousUrl)
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({
          url: uppercaseMaliciousUrl,
        })
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({ verdict: "malicious" })
      )
    })

    test("should reject malicious url with exact match", async () => {
      const expectedMaliciousUrl = "https://test.com/"
      maliciousUrls.push(expectedMaliciousUrl)
      await addMockMaliciousUrl(expectedMaliciousUrl)
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({
          url: expectedMaliciousUrl,
        })
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({ verdict: "malicious" })
      )
    })

    test("should reject malicious url with nested route path", async () => {
      const expectedMaliciousUrl = "https://test.com"
      maliciousUrls.push(expectedMaliciousUrl)
      await addMockMaliciousUrl(expectedMaliciousUrl)
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({
          url: expectedMaliciousUrl + "/nested/route",
        })
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({ verdict: "malicious" })
      )
    })

    test("should reject malicious url with path parameters", async () => {
      const expectedMaliciousUrl = "https://test.com/product"
      maliciousUrls.push(expectedMaliciousUrl)
      await addMockMaliciousUrl(expectedMaliciousUrl)
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({
          url: expectedMaliciousUrl + "?category=car",
        })
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({ verdict: "malicious" })
      )
    })

    test("should reject malicious url with explicit port", async () => {
      const expectedMaliciousUrl = "https://test.com/product"
      maliciousUrls.push(expectedMaliciousUrl)
      await addMockMaliciousUrl(expectedMaliciousUrl)
      const response = await request(app)
        .post("/api/malicious/check-url")
        .send({
          url: "https://test.com:803",
        })
      expect(response.status).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({ verdict: "malicious" })
      )
    })
  })
})
