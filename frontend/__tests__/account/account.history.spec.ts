import { test, expect, Page } from "@playwright/test"
import { HOMEPAGE_URL } from "../constants"
import {
  mockHistoryEmptyResponse,
  mockHistoryOneUrlResponse,
  mockLoginSuccessAuthResponse,
} from "./accountMocks"

async function navigateToLoginPage(page: Page) {
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
  await mockHistoryEmptyResponse(page)
  await login(page, "test_username")
  await page.getByRole("link", { name: "History" }).click()
  await expect(page.getByText("History", { exact: true })).toBeVisible()
  expect(page.url()).toContain("/history")
})

test("logged out user should see 404 error when accessing /history route", async ({
  page,
}) => {
  await page.goto(HOMEPAGE_URL + "/history")
  await expect(page.getByText("Error - 404 Not Found")).toBeVisible()
  expect(page.url()).not.toContain("/history")
  expect(page.url()).toContain("/error")
})

test("shows empty history page when user has not created any short urls", async ({
  page,
}) => {
  await mockHistoryEmptyResponse(page)
  await login(page, "test_username")
  await page.getByRole("link", { name: "History" }).click()
  await expect(page.getByText("History", { exact: true })).toBeVisible()
  await expect(
    page.getByText("You have not created any short urls")
  ).toBeVisible()
})

test("shows history page with one created url", async ({ page }) => {
  const expectedData = { url: "https://github.com/", shortCode: "abcdef2" }
  await mockHistoryOneUrlResponse(page, expectedData)
  await login(page, "test_username")
  await page.getByRole("link", { name: "History" }).click()
  await expect(page.getByText("History", { exact: true })).toBeVisible()
  await expect(
    page.getByText("You have not created any short urls")
  ).not.toBeVisible()
  await expect(page.getByText(expectedData.url)).toBeVisible()
  await expect(page.getByText(expectedData.shortCode)).toBeVisible()
  await expect(page.getByText("Never Updated")).not.toBeVisible()
})
