const userInit = async (request) => {
  await request.post('http://localhost:3003/api/testing/reset')
  await request.post('http://localhost:3003/api/users', {
    data: {
      name: 'Groot',
      username: 'root',
      password: 'sekret'
    }
  })
}

const loginWith = async (page, username, password) => {
  await page.goto('http://localhost:5173')
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByTestId('login-button').click()
}

const blogsInit = async (request, blogs) => {
  blogs.forEach(async (blog) => {
    await request.post('http://localhost:3003/api/testing/create', {
      data: {
        title: blog.title,
        author: blog.author,
        url: blog.url
      }
    })
  })
}

export { userInit, loginWith, blogsInit }