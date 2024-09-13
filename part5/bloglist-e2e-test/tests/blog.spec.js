const { describe, test, expect, beforeEach } = require('@playwright/test')
import { testInit, loginWith } from './helper'

describe('Blog App', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Groot',
        username: 'root',
        password: 'sekret'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // await page.goto('http://localhost:5173')

    const locator = await expect(page.getByText('log in to application')).toBeVisible()
    // await expect(locator).toBeVisible()
    // await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2023')).toBeVisible()
  })

  describe('Login', () => {
    test('User can log in with right credentials', async ({ page}) => {
      await loginWith(page, 'root', 'sekret')
      await expect(page.getByText('Groot logged in')).toBeVisible()
    })
  
    test('User cannot log in with wrong credentials', async ({ page}) => {
      await loginWith(page, 'root', '123')
      await expect(page.getByText('Groot logged in')).not.toBeVisible()
    })
    
    test('User sees error message when log in with wrong credentials', async ({ page}) => {
      await loginWith(page, 'root', '123')
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When Logged In', () => {
    beforeEach(async ({page}) => {
      await loginWith(page, 'root', 'sekret')
    }),

    test('blog list is shown', async ({ page }) => {
      await expect(page.getByText('logged in')).toBeVisible()
    })

    test('log out button is shown', async ({ page }) => {
      await expect(page.getByTestId('logout-button')).toBeVisible()
    })

    test('create new blog out button is shown', async ({ page }) => {
      await expect(page.getByText('create new blog')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByText('create new blog').click()
      await page.getByTestId('title').fill('New Blog')
      await page.getByTestId('author').fill('Mark Twain')
      await page.getByTestId('url').fill('https://google.com')
      await page.getByTestId('create').click()

      await expect(page.getByText('New Blog Mark Twain')).toBeVisible()
      await expect(page.getByText('show')).toBeVisible()
      await expect(page.getByText('https://google.com')).not.toBeVisible()
    })
  })

})
