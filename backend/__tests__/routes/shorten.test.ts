// Mocks need to be imported before vitest import!
import { getRateLimiterMocks } from "../mocks.js"
import setupApp from "../../server.js"
import {
  vi,
  describe,
  test,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
} from "vitest"
import request from "supertest"
import { Express } from "express"
import pool, { setupDatabase } from "../../database.js"
import maliciousModel from "../../model/malicious.js"

describe("Shorten Url API", () => {
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
    await setupDatabase(pool)
  })

  beforeEach(async () => {
    await pool.query("DELETE FROM stats")
    await pool.query("DELETE FROM urls")
    vi.mock("../../middleware/rateLimiter.js", () => {
      return {
        default: getRateLimiterMocks(),
      }
    })
  })

  afterEach(async () => {
    await pool.query("DELETE FROM stats")
    await pool.query("DELETE FROM urls")
    vi.restoreAllMocks()
  })

  describe("POST /api/shorten", () => {
    test("should create new shorten url", async () => {
      const expectedUrl = "http://example.com"
      const response = await request(app)
        .post("/api/shorten")
        .send({ url: expectedUrl })
        .set("Accept", "application/json")
      expect(response.status).toBe(201)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          shortCode: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: null,
          url: expectedUrl,
        })
      )
      expect(response.body.shortCode).toHaveLength(7)
      expect(new Date(response.body.createdAt).getTime()).not.toBeNaN()
    })

    test("missing url in request body should not create new shorten url", async () => {
      const response = await request(app)
        .post("/api/shorten")
        .send({})
        .set("Accept", "application/json")
      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.arrayContaining([
            "Url length should be between 3 and 2048",
          ]),
        })
      )
    })

    test("invalid url protocol in request body should not create new shorten url", async () => {
      const invalidUrlProtocol = "htp://test.co"
      const response = await request(app)
        .post("/api/shorten")
        .send({ url: invalidUrlProtocol })
        .set("Accept", "application/json")
      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({
          error: "Please provide a valid http / https url",
        })
      )
    })

    test("max valid url length in request body should create new shorten url", async () => {
      const expectedLongUrl =
        "http://" + "a".repeat(2048 - "http://.com".length) + ".com"
      const response = await request(app)
        .post("/api/shorten")
        .send({ url: expectedLongUrl })
        .set("Accept", "application/json")
      expect(response.status).toBe(201)
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          shortCode: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: null,
          url: expectedLongUrl,
        })
      )
      expect(response.body.shortCode).toHaveLength(7)
      expect(new Date(response.body.createdAt).getTime()).not.toBeNaN()
    })

    test("max invalid url length in request body should not create new shorten url", async () => {
      const expectedLongUrl =
        "http://" + "a".repeat(2049 - "http://.com".length) + ".com"
      const response = await request(app)
        .post("/api/shorten")
        .send({ url: expectedLongUrl })
        .set("Accept", "application/json")
      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.arrayContaining([
            "Url length should be between 3 and 2048",
          ]),
        })
      )
    })

    test("malicious url should not be shortened", async () => {
      const spy = vi.spyOn(maliciousModel, "isMaliciousUrl")
      spy.mockImplementationOnce(() => new Promise((resolve) => resolve(true)))

      const maliciousUrl = "https://test.com"
      const response = await request(app)
        .post("/api/shorten")
        .send({ url: maliciousUrl })
        .set("Accept", "application/json")
      expect(response.status).toBe(400)
      expect(response.body).toEqual(
        expect.objectContaining({
          error: "Url is malicious",
        })
      )
      expect(spy).toHaveBeenCalledOnce()
    })
  })

  describe("GET /api/shorten/:shortCode", () => {
    test("should retrieve created short url", async () => {
      const expectedUrl = "https://example.com"
      const createShortUrlResponse = await request(app)
        .post("/api/shorten")
        .send({ url: expectedUrl })
        .set("Accept", "application/json")
      const { id, shortCode, createdAt, updatedAt, url } =
        createShortUrlResponse.body
      expect(shortCode).toHaveLength(7)

      const retrieveResponse = await request(app).get(
        `/api/shorten/${shortCode}`
      )
      expect(retrieveResponse.body).toEqual(
        expect.objectContaining({
          id: id,
          shortCode: shortCode,
          createdAt: createdAt,
          updatedAt: updatedAt,
          url: url,
        })
      )
    })

    test("should not retrieve short url that does not exist", async () => {
      const invalidShortCode = "1234567"
      const response = await request(app).get(
        `/api/shorten/${invalidShortCode}`
      )
      expect(response.status).toBe(404)
    })
  })

  describe("PUT /api/shorten/:shortCode", () => {
    test("should update existing short url", async () => {
      const originalUrl = "https://example.com"
      const updatedUrl = "http://updatedUrl.com"
      const createShortUrlResponse = await request(app)
        .post("/api/shorten")
        .send({ url: originalUrl })
        .set("Accept", "application/json")
      const { id, shortCode, createdAt } = createShortUrlResponse.body
      expect(shortCode).toHaveLength(7)

      const updateResponse = await request(app)
        .put(`/api/shorten/${shortCode}`)
        .send({ url: updatedUrl })
        .set("Accept", "application/json")
      expect(updateResponse.status).toBe(200)
      expect(updateResponse.body).toEqual(
        expect.objectContaining({
          id: id,
          shortCode: shortCode,
          createdAt: createdAt,
          updatedAt: expect.any(String),
          url: updatedUrl,
        })
      )
      expect(new Date(updateResponse.body.updatedAt).getTime()).not.toBeNaN()
    })

    test("should not update existing short url with invalid url protocol", async () => {
      const originalUrl = "https://example.com"
      const invalidUpdateUrl = "ht://invalidUpdateUrl.com"
      const createShortUrlResponse = await request(app)
        .post("/api/shorten")
        .send({ url: originalUrl })
        .set("Accept", "application/json")
      const { shortCode } = createShortUrlResponse.body
      expect(shortCode).toHaveLength(7)

      const updateResponse = await request(app)
        .put(`/api/shorten/${shortCode}`)
        .send({ url: invalidUpdateUrl })
        .set("Accept", "application/json")
      expect(updateResponse.status).toBe(400)
    })

    test("should not update existing short url with malicious url", async () => {
      const spy = vi.spyOn(maliciousModel, "isMaliciousUrl")
      spy
        .mockImplementationOnce(() => new Promise((resolve) => resolve(false)))
        .mockImplementationOnce(() => new Promise((resolve) => resolve(true)))

      const originalUrl = "https://example.com"
      const invalidUpdateMaliciousUrl = "http://invalidUpdateUrl.com"
      const createShortUrlResponse = await request(app)
        .post("/api/shorten")
        .send({ url: originalUrl })
        .set("Accept", "application/json")
      const { shortCode } = createShortUrlResponse.body
      expect(shortCode).toHaveLength(7)

      const updateResponse = await request(app)
        .put(`/api/shorten/${shortCode}`)
        .send({ url: invalidUpdateMaliciousUrl })
        .set("Accept", "application/json")
      expect(updateResponse.status).toBe(400)
      expect(updateResponse.body).toEqual(
        expect.objectContaining({
          error: expect.arrayContaining([
            "Could not update due to malicious url",
          ]),
        })
      )
    })
  })

  describe("DELETE /api/shorten/:shortCode", () => {
    test("should delete existing short url", async () => {
      const originalUrl = "https://example.com"
      const createShortUrlResponse = await request(app)
        .post("/api/shorten")
        .send({ url: originalUrl })
        .set("Accept", "application/json")
      const { shortCode } = createShortUrlResponse.body
      expect(shortCode).toHaveLength(7)

      const deleteResponse = await request(app)
        .delete(`/api/shorten/${shortCode}`)
        .set("Accept", "application/json")
      expect(deleteResponse.status).toBe(204)
      expect(deleteResponse.body).toEqual({})
    })
  })
})
