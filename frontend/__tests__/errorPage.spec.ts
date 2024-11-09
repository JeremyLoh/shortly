import { test, expect, Page } from "@playwright/test"
import { HOMEPAGE_URL } from "./constants"

function assertErrorPageShown(page: Page) {
  expect(page.getByText("Error - 404 Not Found")).toBeVisible()
  expect(page.getByText("An error has occured, to continue:")).toBeVisible()
  expect(page.getByText("Return to the homepage.")).toBeVisible()
  expect(page.getByText("Try again later.")).toBeVisible()
}

test("invalid route shows 404 error page", async ({ page }) => {
  const invalidRoute = HOMEPAGE_URL + "/12abc67/info"
  await page.goto(invalidRoute)
  expect(page.url()).toContain("/12abc67/info")
  assertErrorPageShown(page)
})

test("short code that does not exist shows 404 error page", async ({
  page,
}) => {
  const invalidShortCodeRoute = HOMEPAGE_URL + "/12abc67"
  await page.goto(invalidShortCodeRoute)
  expect(page.url()).toContain("/12abc67")
  assertErrorPageShown(page)
})

test("short code invalid length shows 404 error page", async ({ page }) => {
  const invalidLengthShortCodeRoute = HOMEPAGE_URL + "/ab123"
  await page.goto(invalidLengthShortCodeRoute)
  expect(page.url()).toContain("/ab123")
  assertErrorPageShown(page)
})
