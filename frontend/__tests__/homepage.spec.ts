import { test, expect } from "@playwright/test"
import { HOMEPAGE_URL } from "./constants"

test("has title", async ({ page }) => {
  await page.goto(HOMEPAGE_URL)
  await expect(page).toHaveTitle(/URL Shortener/)
})

test("displays feature section on homepage", async ({ page }) => {
  await page.goto(HOMEPAGE_URL)
  await expect(page.getByText("Easy to use")).toBeVisible()
  await expect(
    page.getByText("Just enter your long link and create your shortened link!")
  ).toBeVisible()

  // E.g TODO https://www.shorturl.at/
  await expect(page.getByText("Safe")).toBeVisible()
  await expect(
    page.getByText("Stop malicious links from being shortened")
  ).toBeVisible()

  await expect(page.getByText("History")).toBeVisible()
  await expect(
    page.getByText("Create an account to view created short urls")
  ).toBeVisible()
})

test("navigate to stats page", async ({ page }) => {
  await page.goto(HOMEPAGE_URL)
  await expect(page.getByTestId("header-stats-link")).toHaveText("Stats")
  await page.getByTestId("header-stats-link").click()
  await expect(
    page.getByRole("heading", { name: "Link Statistics" })
  ).toBeVisible()
  expect(page.url()).toContain("/stats")
})

test("navigate back to home page from stats page", async ({ page }) => {
  await page.goto(HOMEPAGE_URL)
  await page.getByTestId("header-stats-link").click()
  expect(page.url()).toContain("/stats")
  await page.getByTestId("header-homepage-link").click()
  expect(page.url()).not.toContain("/stats")
})

test("create new short url with mocked backend API", async ({ page }) => {
  const url = "https://example.com"
  const shortCode = "abcdef2"
  await page.route("*/**/api/shorten", async (route) => {
    const request = route.request()
    expect(request.method()).toBe("POST")
    const json = {
      id: "1",
      url: url,
      shortCode: shortCode,
      createdAt: "2024-10-19T09:49:24.027Z",
      updatedAt: null,
    }
    await route.fulfill({
      status: 201,
      json: json,
      contentType: "application/json; charset=utf-8",
    })
  })
  await page.goto(HOMEPAGE_URL)
  await page.getByTestId("create-new-url-input").fill(url)
  await page.getByTestId("create-new-url-submit-btn").click()
  await expect(page.getByText("Your New Short Url")).toBeVisible()
  await expect(page.getByText("/" + shortCode)).toBeVisible()
  await expect(page.getByText(`Redirect Url ${url}`)).toBeVisible()
  await expect(page.getByText("Created At")).toBeVisible()
  await expect(page.getByTestId("create-new-url-input")).toHaveValue("")
})

test("create new short url displays QR Code", async ({ page }) => {
  const url = "https://example.com"
  const shortCode = "abcdef2"
  await page.route("*/**/api/shorten", async (route) => {
    const request = route.request()
    expect(request.method()).toBe("POST")
    const json = {
      id: "1",
      url: url,
      shortCode: shortCode,
      createdAt: "2024-10-19T09:49:24.027Z",
      updatedAt: null,
    }
    await route.fulfill({
      status: 201,
      json: json,
      contentType: "application/json; charset=utf-8",
    })
  })
  await page.goto(HOMEPAGE_URL)
  await page.getByTestId("create-new-url-input").fill(url)
  await page.getByTestId("create-new-url-submit-btn").click()
  await expect(page.getByTestId("qr-code-container")).toBeVisible()

  const downloadPromise = page.waitForEvent("download")
  await page.getByTestId("download-qr-code").click()
  const download = await downloadPromise
  await download.saveAs(
    "./playwright-report/test_" + download.suggestedFilename()
  )
})

test("prevent url shorten that contains application url", async ({ page }) => {
  const invalidUrl = "http://" + HOMEPAGE_URL
  const expectedErrorMessage =
    "Could not create short url. You cannot shorten a url that contains the application url"
  await page.goto(HOMEPAGE_URL)
  await page.getByTestId("create-new-url-input").fill(invalidUrl)
  await page.getByTestId("create-new-url-submit-btn").click()
  await expect(
    page.getByText(expectedErrorMessage, { exact: true })
  ).toBeVisible()

  await page.getByTestId("create-new-url-input").fill(invalidUrl + "/test")
  await page.getByTestId("create-new-url-submit-btn").click()
  await expect(
    page.getByText(expectedErrorMessage, { exact: true })
  ).toBeVisible()
})
