import { test, expect } from "@playwright/test"
import { HOMEPAGE_URL } from "./constants"

async function navigateToLoginPage(page) {
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
})
