import { test, expect, Page } from "@playwright/test"
import { HOMEPAGE_URL } from "./constants"

async function mockLoginEndpoint(page: Page) {
  await page.route("*/**/api/auth/users", async (route) => {
    const request = route.request()
    expect(request.method()).toBe("POST")
    await route.fulfill({
      status: 201,
      json: "Created",
    })
  })
}

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

test.beforeEach(async ({ page }) => {
  await page.goto(HOMEPAGE_URL + "/register")
  expect(page.url()).toContain("/register")
})

test("should create new account", async ({ page }) => {
  await mockLoginEndpoint(page)

  await expect(
    page.getByRole("heading", { name: "Create a new account" })
  ).toBeVisible()
  await expect(page.getByLabel("Username")).toBeVisible()
  await expect(page.getByLabel("Username")).toHaveAttribute("type", "text")
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible()
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "password"
  )
  await expect(page.getByLabel("Confirm Password")).toBeVisible()
  await expect(page.getByLabel("Confirm Password")).toHaveAttribute(
    "type",
    "password"
  )

  await page.getByLabel("Username").fill("test_username")
  await page.getByLabel("Password", { exact: true }).fill("test_password")
  await page.getByLabel("Confirm Password").fill("test_password")
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(
    page.getByRole("heading", { name: "Login", exact: true })
  ).toBeVisible()
  expect(page.url()).toContain("/login")
})

test("should display error when username is blank", async ({ page }) => {
  await page.getByLabel("Username").clear()
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(page.getByText("Username is required")).toBeVisible()
})

test("should display error when username is more than 255 characters", async ({
  page,
}) => {
  const username = "a".repeat(256)
  await page.getByLabel("Username").fill(username)
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(
    page.getByText("Username cannot be longer than 255 characters")
  ).toBeVisible()

  await page.getByLabel("Username").clear()
  await page.getByLabel("Username").fill("b".repeat(255))
  await expect(
    page.getByText("Username cannot be longer than 255 characters")
  ).not.toBeVisible()
})

test("should display root error message when submission fails with rate limit exception", async ({
  page,
}) => {
  const timeoutInSeconds = 30
  await mockLoginRateLimitExceededEndpoint(page, timeoutInSeconds)

  await page.getByLabel("Username").fill("test_username")
  await page.getByLabel("Password", { exact: true }).fill("test_password")
  await page.getByLabel("Confirm Password").fill("test_password")
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(
    page.getByText(
      `Rate Limit Exceeded, please try again after ${timeoutInSeconds} seconds`
    )
  ).toBeVisible()
})
