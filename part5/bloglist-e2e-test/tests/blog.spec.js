const { describe, test, expect, beforeEach } = require('@playwright/test')
import { userInit, loginWith, blogsInit } from './helper'

const oneBlog = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
  }
]

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  },
  {
    title: 'Type wars II',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWarsII.html',
  }
]

describe('Blog App', () => {
  beforeEach(async ({ page, request }) => {
    await userInit(request)
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
    beforeEach(async ({ page, request }) => {
      await blogsInit(request, initialBlogs)
      await loginWith(page, 'root', 'sekret')
    })

    test('blog list is shown', async ({ page }) => {
      await expect(page.getByText('logged in')).toBeVisible()
    })

    test('log out button is shown', async ({ page }) => {
      await expect(page.getByTestId('logout-button')).toBeVisible()
    })

    test('create new blog button is shown', async ({ page }) => {
      await expect(page.getByText('create new blog')).toBeVisible()
    })

    describe('Creating a blog', () => {
      test('with essential information is possible', async ({ page }) => {
        await page.getByText('create new blog').click()
        await page.getByTestId('title').fill('New Blog')
        await page.getByTestId('author').fill('Mark Twain')
        await page.getByTestId('url').fill('https://google.com')
        await page.getByTestId('create').click()
  
        await expect(page.getByText('New Blog Mark Twain')).toBeVisible()
        await expect(page.getByText('https://google.com')).not.toBeVisible()
      })
    })
  })

  describe('Single Blog Function', () => {
    beforeEach(async ({ page, request }) => {
      await blogsInit(request, oneBlog)
      await loginWith(page, 'root', 'sekret')
    })

    test('blogs can be liked', async ({ page }) => {
      // const blog = await page.locator('div', { hasText: 'React patterns Michael Chan' })
      
      await page.getByText('show').click()
      await page.getByTestId('likeButton').click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })
  })
})
