const { describe, test, expect, beforeEach } = require('@playwright/test')

describe('Blog App', () =>
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  }),

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173')

    const locator = await expect(page.getByText('log in to application')).toBeVisible()
    // await expect(locator).toBeVisible()
    // await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2023')).toBeVisible()
  })
)
