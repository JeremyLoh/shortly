import { test, expect } from "@playwright/test"
import { HOMEPAGE_URL } from "../constants"
import { mockLoginSuccessAuthResponse } from "./accountMocks"

async function navigateToLoginPage(page) {
  await page.goto(HOMEPAGE_URL)
  await page.getByRole("link", { name: "Login" }).click()
}

// "/history" page feature - user created short urls
test.beforeEach(async ({ page }) => {
  await navigateToLoginPage(page)
})

test("show history link and welcome message on homepage after login", async ({
  page,
  browser,
}) => {
  const browserContext = await browser.newContext()
  await mockLoginSuccessAuthResponse(page, browserContext)
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible()
  await page.getByLabel("username").fill("test_username")
  await page.getByLabel("password").fill("test_password")
  await page.getByRole("button", { name: "Sign in" }).click()

  await expect(page.getByRole("link", { name: "History" })).toBeVisible()
  await expect(
    page.getByText("👋 Welcome back test_username", { exact: true })
  ).toBeVisible()
})
