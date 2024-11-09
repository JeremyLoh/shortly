import { test, expect, Page } from "@playwright/test"
import { HOMEPAGE_URL } from "./constants"

async function mockStatsResponse(page: Page, { shortCode, url, accessCount }) {
  await page.route(`*/**/api/shorten/${shortCode}/stats`, async (route) => {
    const request = route.request()
    expect(request.method()).toBe("GET")
    const responseJson = {
      id: "61",
      url: url,
      shortCode: shortCode,
      createdAt: "2024-10-19T09:49:24.027Z",
      updatedAt: null,
      accessCount: accessCount,
    }
    await route.fulfill({
      status: 200,
      json: responseJson,
      contentType: "application/json; charset=utf-8",
    })
  })
}

test("display existing short url statistic with zero access count using mocked backend API", async ({
  page,
}) => {
  const url = "https://example.com"
  const shortCode = "abcdef2"
  const accessCount = 0
  await mockStatsResponse(page, { url, shortCode, accessCount })
  await page.goto(HOMEPAGE_URL)
  await page.getByTestId("header-stats-link").click()
  await page
    .getByPlaceholder("Your Short Url...")
    .fill(`${HOMEPAGE_URL}/${shortCode}`)
  await page.getByTestId("short-url-stat-submit-btn").click()
  await expect(page.getByText(url)).toBeVisible()
  await expect(page.getByText(`${accessCount} engagement`)).toBeVisible()
  await expect(page.getByText("Created at")).toBeVisible()
  await expect(page.getByText("Never Updated")).toBeVisible()
})

test("display existing short url statistic with one access count using mocked backend API", async ({
  page,
}) => {
  const url = "https://example.com"
  const shortCode = "abcdef2"
  const accessCount = 1
  await mockStatsResponse(page, { url, shortCode, accessCount })
  await page.goto(HOMEPAGE_URL)
  await page.getByTestId("header-stats-link").click()
  await page
    .getByPlaceholder("Your Short Url...")
    .fill(`${HOMEPAGE_URL}/${shortCode}`)
  await page.getByTestId("short-url-stat-submit-btn").click()
  await expect(page.getByText(url)).toBeVisible()
  await expect(page.getByText(`${accessCount} engagement`)).toBeVisible()
  await expect(page.getByText("Created at")).toBeVisible()
  await expect(page.getByText("Never Updated")).toBeVisible()
})

test("display existing short url statistic with more than one access count using mocked backend API", async ({
  page,
}) => {
  const url = "https://example.com"
  const shortCode = "abcdef2"
  const accessCount = 2
  await mockStatsResponse(page, { url, shortCode, accessCount })
  await page.goto(HOMEPAGE_URL)
  await page.getByTestId("header-stats-link").click()
  await page
    .getByPlaceholder("Your Short Url...")
    .fill(`${HOMEPAGE_URL}/${shortCode}`)
  await page.getByTestId("short-url-stat-submit-btn").click()
  await expect(page.getByText(url)).toBeVisible()
  await expect(page.getByText(`${accessCount} engagements`)).toBeVisible()
  await expect(page.getByText("Created at")).toBeVisible()
  await expect(page.getByText("Never Updated")).toBeVisible()
})
