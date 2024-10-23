import { test, expect } from "@playwright/test"
import { HOMEPAGE_URL } from "./constants"

async function navigateToLoginPage(page) {
  await page.goto(HOMEPAGE_URL)
  await page.getByRole("link", { name: "Login" }).click()
}

async function mockLoginAuthResponse(page, browserContext) {
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

async function mockLogoutSuccessResponse(page) {
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

test.beforeEach(async ({ page }) => {
  await navigateToLoginPage(page)
})

test("navigate from homepage to login page and view login form", async ({
  page,
}) => {
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
  await expect(page.getByLabel("username")).toBeVisible()
  await expect(page.getByLabel("username")).toHaveAttribute("type", "text")
  await expect(page.getByLabel("password")).toHaveAttribute("type", "password")
  await expect(page.getByText("Don't have an account? Register")).toBeVisible()
})

test("login username cannot be empty during form submit", async ({ page }) => {
  await page.getByLabel("username").clear()
  await page.getByLabel("password").fill("test_password")
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page.getByText("Username is required")).toBeVisible()
})

test("login username cannot be longer than 255 characters during form submit", async ({
  page,
}) => {
  await page.getByLabel("username").fill("a".repeat(256))
  await page.getByLabel("password").clear()
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(
    page.getByText("Username cannot be longer than 255 characters")
  ).toBeVisible()

  await page.getByLabel("username").clear()
  await page.getByLabel("username").fill("a".repeat(255))
  await expect(
    page.getByText("Username cannot be longer than 255 characters")
  ).not.toBeVisible()
})

test("login password cannot be empty during form submit", async ({ page }) => {
  await page.getByLabel("password").clear()
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page.getByText("Password is required")).toBeVisible()
})

test("login to existing account, redirect to homepage and header login link should change to logout", async ({
  page,
  browser,
}) => {
  const browserContext = await browser.newContext()
  await mockLoginAuthResponse(page, browserContext)
  expect(page.url()).toContain("/login")
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
  await page.getByLabel("username").fill("test_username")
  await page.getByLabel("password").fill("test_password")
  await page.getByRole("button", { name: "Sign in" }).click()

  await expect(page.getByRole("heading", { name: "Login" })).not.toBeVisible()
  expect(page.url()).not.toContain("/login")
  await expect(page.getByRole("link", { name: "Login" })).not.toBeVisible()
  await expect(page.getByRole("link", { name: "Logout" })).toBeVisible()
})

test("click logout header link redirects to logout page", async ({
  page,
  browser,
}) => {
  const browserContext = await browser.newContext()
  await mockLoginAuthResponse(page, browserContext)
  await mockLogoutSuccessResponse(page)

  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
  await page.getByLabel("username").fill("test_username")
  await page.getByLabel("password").fill("test_password")
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page.getByRole("link", { name: "Logout" })).toBeVisible()
  await page.getByRole("link", { name: "Logout" }).click()
  expect(page.url()).toContain("/logout")
  await expect(page.getByRole("heading", { name: "Logged out" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Logout" })).not.toBeVisible()
  await expect(page.getByText("Logged out")).toBeVisible()
})

test("login with invalid account credentials shows error message", async ({
  page,
}) => {
  await page.route("*/**/api/auth/login", async (route) => {
    const request = route.request()
    expect(request.method()).toBe("POST")
    await route.fulfill({
      status: 401,
      body: "Unauthorized",
    })
  })
  expect(page.url()).toContain("/login")
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
  await page.getByLabel("username").fill("test_username")
  await page.getByLabel("password").fill("test_password")
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(
    page.getByText(
      "Could not check login credentials. Invalid username / password"
    )
  ).toBeVisible()
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
})

test("login with rate limit exceeded shows error message", async ({ page }) => {
  const retryAfterSeconds = "59"
  await page.route("*/**/api/auth/login", async (route) => {
    const request = route.request()
    expect(request.method()).toBe("POST")
    await route.fulfill({
      status: 429,
      body: "Too many requests, please try again later.",
      headers: {
        "retry-after": retryAfterSeconds,
      },
    })
  })
  expect(page.url()).toContain("/login")
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
  await page.getByLabel("username").fill("test_username")
  await page.getByLabel("password").fill("test_password")
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(
    page.getByText(
      `Could not check login credentials. Rate Limit Exceeded, please try again after ${retryAfterSeconds} seconds`
    )
  ).toBeVisible()
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
})

// test("should create a new account", async ({ page }) => {
//  await navigateToLoginPage(page)
//   // TODO create new account, login page => create new account link => submit form => redirect to login page
// })
