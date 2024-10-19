import { test, expect } from "@playwright/test"

const HOMEPAGE_URL = "localhost:5173"

test("has title", async ({ page }) => {
  await page.goto(HOMEPAGE_URL)
  await expect(page).toHaveTitle(/URL Shortener/)
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
