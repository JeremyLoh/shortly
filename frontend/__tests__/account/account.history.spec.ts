import { test, expect, Page } from "@playwright/test"
import { HOMEPAGE_URL } from "../constants"
import { mockLoginSuccessAuthResponse } from "./accountMocks"

async function navigateToLoginPage(page) {
  await page.goto(HOMEPAGE_URL)
  await page.getByRole("link", { name: "Login" }).click()
}

async function login(page: Page, username: string) {
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
  await page.getByLabel("username").fill(username)
  await page.getByLabel("password").fill("test_password")
  await page.getByRole("button", { name: "Sign in" }).click()
}

// "/history" page feature - user created short urls
test.beforeEach(async ({ page, browser }) => {
  await navigateToLoginPage(page)
  const browserContext = await browser.newContext()
  await mockLoginSuccessAuthResponse(page, browserContext)
})

test("show history link and welcome message on homepage after login", async ({
  page,
}) => {
  await login(page, "test_username")
  await expect(page.getByRole("link", { name: "History" })).toBeVisible()
  await expect(
    page.getByText("👋 Welcome back test_username", { exact: true })
  ).toBeVisible()
})

test("navigate from homepage to history page on history link click", async ({
  page,
}) => {
  await login(page, "test_username")
  await page.getByRole("link", { name: "History" }).click()
  await expect(page.getByText("History", { exact: true })).toBeVisible()
  expect(page.url()).toContain("/history")
})

test("logged out user should see 404 error when accessing /history route", async ({
  page,
}) => {
  await page.goto(HOMEPAGE_URL + "/history")
  expect(page.url()).not.toContain("/history")
  expect(page.url()).toContain("/error")
})
