import { BrowserContext, expect, Page } from "@playwright/test"

async function mockLoginRateLimitExceededEndpoint(
  page: Page,
  timeoutInSeconds: number
) {
  await page.route("*/**/api/auth/users", async (route) => {
    const request = route.request()
    expect(request.method()).toBe("POST")
    await route.fulfill({
      status: 429,
      headers: { "retry-after": `${timeoutInSeconds}` },
      json: "Too many requests, please try again later.",
    })
  })
}

async function mockCreateAccountSuccessEndpoint(page: Page) {
  await page.route("*/**/api/auth/users", async (route) => {
    const request = route.request()
    expect(request.method()).toBe("POST")
    await route.fulfill({
      status: 201,
      json: "Created",
    })
  })
}

async function mockLoginSuccessAuthResponse(
  page: Page,
  browserContext: BrowserContext
) {
  await page.route("*/**/api/auth/login", async (route) => {
    const request = route.request()
    expect(request.method()).toBe("POST")
    const mockUserResponseJson = {
      id: "12",
    }
    const mockCookieHeader =
      "connect.sid=s%2testCookie123456789abcdefyaac22033.97sirrrarrdseewreerrjtt3tteeeaabbbggiedefabc; Path=/; Expires=Mon, 21 Oct 2024 06:40:22 GMT; HttpOnly"
    await route.fulfill({
      status: 200,
      json: mockUserResponseJson,
      headers: { "set-cookie": mockCookieHeader },
    })
    await browserContext.addCookies([
      {
        name: "connect.sid",
        value:
          "s%2testCookie123456789abcdefyaac22033.97sirrrarrdseewreerrjtt3tteeeaabbbggiedefabc",
        domain: "localhost",
        path: "/",
      },
    ])
  })
}

async function mockLogoutSuccessResponse(page: Page) {
  await page.route("*/**/api/auth/logout", async (route) => {
    const request = route.request()
    expect(request.method()).toBe("POST")
    const mockCookieHeader =
      "connect.sid=s%2testCookie123456789abcdefyaac22033.97sirrrarrdseewreerrjtt3tteeeaabbbggiedefabc; Path=/; Expires=Mon, 21 Oct 2024 06:40:22 GMT; HttpOnly"
    await route.fulfill({
      status: 200,
      headers: { "set-cookie": mockCookieHeader },
    })
  })
}

async function mockHistoryEmptyResponse(page: Page) {
  await page.route("*/**/api/account/history", async (route) => {
    const request = route.request()
    expect(request.method()).toBe("POST")
    await route.fulfill({
      status: 200,
      json: { urls: [], total: "0" },
    })
  })
}

async function mockHistoryOneUrlResponse(
  page: Page,
  data: { url: string; shortCode: string }
) {
  await page.route("*/**/api/account/history", async (route) => {
    const request = route.request()
    expect(request.method()).toBe("POST")
    await route.fulfill({
      status: 200,
      json: {
        urls: [
          {
            id: "1",
            url: data.url,
            shortCode: data.shortCode,
            createdAt: "2024-11-06T15:26:11.314Z",
            updatedAt: "2024-11-06T15:56:41.514Z",
          },
        ],
        total: "1",
      },
    })
  })
}

async function mockHistoryMultiplePageUrlResponse(
  page: Page,
  itemsPerPage: number,
  data: Array<{ url: string; shortCode: string }>
) {
  const count = data.length
  const urls = data.map((d, index) => ({
    id: `${index + 1}`,
    url: d.url,
    shortCode: d.shortCode,
    createdAt: "2024-11-06T15:26:11.314Z",
    updatedAt: "2024-11-06T15:56:41.514Z",
  }))
  await page.route("*/**/api/account/history", async (route) => {
    const request = route.request()
    expect(request.method()).toBe("POST")
    const postData = request.postData() as string | null
    if (postData == null) {
      throw new Error(
        "Invalid post data given to mock endpoint for mockHistoryTwoPageUrlResponse"
      )
    }
    // request.postData() returns a json string
    const page = parseInt(JSON.parse(postData).page)
    const startIndex = Math.max(0, page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    await route.fulfill({
      status: 200,
      json: {
        urls: urls.slice(startIndex, endIndex),
        total: `${count}`,
      },
    })
  })
}

export {
  mockLoginRateLimitExceededEndpoint,
  mockCreateAccountSuccessEndpoint,
  mockLoginSuccessAuthResponse,
  mockLogoutSuccessResponse,
  mockHistoryEmptyResponse,
  mockHistoryOneUrlResponse,
  mockHistoryMultiplePageUrlResponse,
}
