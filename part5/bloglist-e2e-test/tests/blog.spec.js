const { describe, test, expect, beforeEach } = require('@playwright/test')
import { userInit, loginWith, blogsInit } from './helper'

let userId

const oneBlog = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 0
  }
]

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 6
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 5
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 4
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 3
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2
  },
  {
    title: 'Type wars II',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWarsII.html',
    likes: 1
  }
]

describe('Blog App', () => {
  beforeEach(async ({ page, request }) => {
    userId = await userInit(request)
    // console.log('root id:', userId)
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
      await blogsInit(request, initialBlogs, 'root')
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

    describe('Blogs Sorting Order', () => {
      test('initial order is correct', async ({ page }) => {
        const blogs = await page.getByTestId('blog')
        const iniTitles = initialBlogs.map(blog => blog.title + ' ' + blog.author + 'show')

        for (let i = 0; i < 7; ++i)
        {
          console.log('title', i, await blogs.nth(i).textContent())
          expect(await blogs.nth(i).textContent()).toStrictEqual(iniTitles[i])
        }
      })

      test('position of blogs with equal likes remain unchanged after actions', async ({ page }) => {
        const blog = await page.locator('[data-testid="blog"]', { hasText: 'Go To Statement Considered Harmful Edsger W. Dijkstra' })
        await blog.getByText('show').click()
        await blog.getByTestId('likeButton').click()
        await expect(blog.getByText('likes 7')).toBeVisible()

        const blogs = await page.getByTestId('blog')
        const iniTitles = initialBlogs.map(blog => blog.title + ' ' + blog.author + 'show')
        await blog.getByText('hide').click()

        for (let i = 0; i < 7; ++i)
        {
          // console.log('title', i, await blogs.nth(i).textContent())
          expect(await blogs.nth(i).textContent()).toStrictEqual(iniTitles[i])
        }
      })

      test('liking multiple blogs', async ({ page }) => {
        const blog = await page.locator('[data-testid="blog"]', { hasText: 'Go To Statement Considered Harmful Edsger W. Dijkstra' })
        await blog.getByText('show').click()
        await blog.getByTestId('likeButton').click()
        await blog.getByTestId('likeButton').click()
        await blog.getByTestId('likeButton').click()
        await expect(blog.getByText('likes 9')).toBeVisible()
        await blog.getByText('hide').click()

        const blog1 = await page.locator('[data-testid="blog"]', { hasText: 'Canonical string reduction Edsger W. Dijkstra' })
        await blog1.getByText('show').click()
        await blog1.getByTestId('likeButton').click()
        await blog1.getByTestId('likeButton').click()
        await blog1.getByTestId('likeButton').click()
        await expect(blog1.getByText('likes 8')).toBeVisible()
        await blog1.getByText('hide').click()
        
        const blog2 = await page.locator('[data-testid="blog"]', { hasText: 'Type wars Robert C. Martin' })
        await blog2.getByText('show').click()
        await blog2.getByTestId('likeButton').click()
        await blog2.getByTestId('likeButton').click()
        await blog2.getByTestId('likeButton').click()
        await expect(blog2.getByText('likes 5')).toBeVisible()
        await blog2.getByText('hide').click()

        const afterTitles = [
          'Go To Statement Considered Harmful Edsger W. Dijkstrashow',
          'Canonical string reduction Edsger W. Dijkstrashow',
          'React patterns Michael Chanshow',
          'Type wars Robert C. Martinshow',
          'First class tests Robert C. Martinshow',
          'TDD harms architecture Robert C. Martinshow',
          'Type wars II Robert C. Martinshow'
        ]

        const blogs = await page.getByTestId('blog')

        for (let i = 0; i < 7; ++i)
        {
          // console.log('title', i, await blogs.nth(i).textContent())
          expect(await blogs.nth(i).textContent()).toStrictEqual(afterTitles[i])
        }
      })

      test('blog with lowest like moves up to the correct place', async ({ page }) => {
        const blog = await page.locator('[data-testid="blog"]', { hasText: 'Type wars II Robert C. Martin' })
        await blog.getByText('show').click()
        await blog.getByTestId('likeButton').click()
        await blog.getByTestId('likeButton').click()
        await blog.getByTestId('likeButton').click()
        await expect(blog.getByText('likes 4')).toBeVisible()

        const afterTitles = [
          'React patterns Michael Chanshow',
          'Go To Statement Considered Harmful Edsger W. Dijkstrashow',
          'Canonical string reduction Edsger W. Dijkstrashow',
          'First class tests Robert C. Martinshow',
          'Type wars II Robert C. Martinshow',
          'TDD harms architecture Robert C. Martinshow',
          'Type wars Robert C. Martinshow'
        ]

        const blogs = await page.getByTestId('blog')
        await blog.getByText('hide').click()

        for (let i = 0; i < 7; ++i)
        {
          // console.log('title', i, await blogs.nth(i).textContent())
          expect(await blogs.nth(i).textContent()).toStrictEqual(afterTitles[i])
        }
      })
    })
  })

  describe('Single Blog Function', () => {
    beforeEach(async ({ page, request }) => {
      await blogsInit(request, oneBlog, 'root')
      await loginWith(page, 'root', 'sekret')
    })

    test('blogs can be liked', async ({ page }) => {
      // const blog = await page.locator('div', { hasText: 'React patterns Michael Chan' })
      
      await page.getByText('show').click()
      await page.getByTestId('likeButton').click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('remove button is shown on blogs added by the current user', async ({ page }) => {
      await page.getByText('show').click()
      await expect(page.getByTestId('removeButton')).toBeVisible()
    })

    test('confirmation dialog is shown correctly after clicking remove button', async ({ page }) => {
      await page.getByText('show').click()
      page.getByTestId('removeButton').click()
      
      const [dialog] = await Promise.all([
        page.waitForEvent('dialog')
      ])

      await expect(dialog.message()).toBe('Remove blog React patterns by Michael Chan ?')
      await dialog.dismiss();
    })

    test('blog list remained unchanged if user clicked Cancel button on the Dialog', async ({ page }) => {
      await page.getByText('show').click()
      page.getByTestId('removeButton').click()
      
      const [dialog] = await Promise.all([
        page.waitForEvent('dialog')
      ])

      await expect(dialog.message()).toBe('Remove blog React patterns by Michael Chan ?')
      await dialog.dismiss();
      await expect(page.getByText('React patterns Michael Chan')).toBeVisible()
    })

    test('blog can be removed by user who added it', async ({ page }) => {
      await page.getByText('show').click()
      page.getByTestId('removeButton').click()

      const [dialog] = await Promise.all([
        page.waitForEvent('dialog')  
      ])
      
      await expect(dialog.message()).toBe('Remove blog React patterns by Michael Chan ?')
      await dialog.accept()
      await expect(page.getByText('React patterns Michael Chan')).not.toBeVisible()
    })

    test ('remove button is not shown for user who did not add the blog', async ({ page, request }) => {
      //add a new blog which is created by a fake user
      await blogsInit(request, [initialBlogs[3]], '1')

      //validate that the blog is visible
      await expect(page.getByText('First class tests Robert C. Martin')).toBeVisible()

      //validate that the Remove Button is not visible to the current user
      const blog = await page.locator('[data-testid="blog"]', { hasText: 'First class tests Robert C. Martin' })
      await blog.getByText('show').click()
      await expect(page.getByTestId('removeButton')).not.toBeVisible()
    })
  })
})