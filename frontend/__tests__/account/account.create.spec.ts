import { test, expect } from "@playwright/test"
import { HOMEPAGE_URL } from "../constants"
import {
  mockCreateAccountSuccessEndpoint,
  mockLoginRateLimitExceededEndpoint,
} from "./accountMocks"

test.beforeEach(async ({ page }) => {
  await page.goto(HOMEPAGE_URL + "/register")
  expect(page.url()).toContain("/register")
})

test("should create new account", async ({ page }) => {
  await mockCreateAccountSuccessEndpoint(page)

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

test("username is blank should display error", async ({ page }) => {
  await page.getByLabel("Username").clear()
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(page.getByText("Username is required")).toBeVisible()
})

test("username is more than 255 characters should display error", async ({
  page,
}) => {
  const username = "a".repeat(256)
  await page.getByLabel("Username").fill(username)
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(
    page.getByText("Username cannot be longer than 255 characters")
  ).toBeVisible()

  await page.getByLabel("Username").clear()
  await page.getByLabel("Username").fill("b".repeat(255))
  await expect(
    page.getByText("Username cannot be longer than 255 characters")
  ).not.toBeVisible()
})

test("submission fails with rate limit exception should display root error message", async ({
  page,
}) => {
  const timeoutInSeconds = 30
  await mockLoginRateLimitExceededEndpoint(page, timeoutInSeconds)

  await page.getByLabel("Username").fill("test_username")
  await page.getByLabel("Password", { exact: true }).fill("test_password")
  await page.getByLabel("Confirm Password").fill("test_password")
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(
    page.getByText(
      `Rate Limit Exceeded, please try again after ${timeoutInSeconds} seconds`
    )
  ).toBeVisible()
})

test("password is blank should display password error", async ({ page }) => {
  await page.getByLabel("Password", { exact: true }).clear()
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(
    page.getByText("Password is required", { exact: true })
  ).toBeVisible()
})

test("invalid password min length should display password error", async ({
  page,
}) => {
  const password = "1234567"
  await page.getByLabel("Password", { exact: true }).fill(password)
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(
    page.getByText("Password needs to have min length of 8 characters")
  ).toBeVisible()

  await page.getByLabel("Password", { exact: true }).clear()
  await page.getByLabel("Password", { exact: true }).fill("12345678")
  await expect(
    page.getByText("Password needs to have min length of 8 characters")
  ).not.toBeVisible()
})

test("confirm password is blank should display confirm password error", async ({
  page,
}) => {
  await page.getByLabel("Confirm Password").clear()
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(page.getByText("Confirm Password is required")).toBeVisible()
})

test("confirm password that does not match password displays error", async ({
  page,
}) => {
  await page
    .getByLabel("Confirm Password", { exact: true })
    .fill("test_password")
  await page.getByLabel("Password", { exact: true }).fill("12345678")
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(
    page.getByText("Password and Confirm Password needs to match", {
      exact: true,
    })
  ).toBeVisible()

  await page.getByLabel("Confirm Password", { exact: true }).fill("test12345")
  await page.getByLabel("Password", { exact: true }).fill("test12345")
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(
    page.getByText("Password and Confirm Password needs to match", {
      exact: true,
    })
  ).not.toBeVisible()
})
