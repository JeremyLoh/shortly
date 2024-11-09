import { test, expect, Page } from "@playwright/test"
import { HOMEPAGE_URL } from "../constants"
import {
  mockLoginSuccessAuthResponse,
  mockLogoutSuccessResponse,
} from "./accountMocks"

async function navigateToLoginPage(page: Page) {
  await page.goto(HOMEPAGE_URL)
  await page.getByRole("link", { name: "Login" }).click()
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
  await mockLoginSuccessAuthResponse(page, browserContext)
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
  await mockLoginSuccessAuthResponse(page, browserContext)
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

test("should navigate to create new account page from login page", async ({
  page,
}) => {
  await navigateToLoginPage(page)
  expect(page.url()).toContain("/login")
  await page.getByRole("link", { name: "Register" }).click()
  expect(page.url()).toContain("/register")
})
