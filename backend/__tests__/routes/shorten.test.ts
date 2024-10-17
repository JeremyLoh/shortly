import { describe, test, expect, beforeAll } from "vitest"
import request from "supertest"
import app from "../../server.js"

describe("Shorten Url API", () => {
  beforeAll(() => {
    // https://mrvautin.com/ensure-express-app-started-before-tests/
    // wait for server to emit this event
    return new Promise((done) => app.on("serverStarted", () => done(true)))
  })

  test("POST /api/shorten should create new shorten url", async () => {
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
})
