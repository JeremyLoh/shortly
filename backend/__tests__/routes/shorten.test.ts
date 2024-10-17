import app from "../../server.js"
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
import { NextFunction, Request, Response } from "express"

function getMockMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => next()
}

describe("Shorten Url API", () => {
  beforeAll(() => {
    // https://mrvautin.com/ensure-express-app-started-before-tests/
    // wait for server to emit this event
    return new Promise((done) => app.on("serverStarted", () => done(true)))
  })

  beforeEach(() => {
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

  afterEach(() => {
    vi.restoreAllMocks()
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
