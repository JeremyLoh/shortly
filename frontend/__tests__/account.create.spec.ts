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
