import { test, expect } from "@playwright/test"

const HOMEPAGE_URL = "localhost:5173"

test("has title", async ({ page }) => {
  await page.goto(HOMEPAGE_URL)
  await expect(page).toHaveTitle(/URL Shortener/)
})

// test("navigate to stats page", async ({ page }) => {
//   await page.goto(HOMEPAGE_URL)
//   await expect(page.getByTestId("navbar-stats-link")).toHaveText("Stats")
// })

// test("get started link", async ({ page }) => {
//   await page.goto("https://playwright.dev/")

//   // Click the get started link.
//   await page.getByRole("link", { name: "Get started" }).click()

//   // Expects page to have a heading with the name of Installation.
//   await expect(
//     page.getByRole("heading", { name: "Installation" })
//   ).toBeVisible()
// })
