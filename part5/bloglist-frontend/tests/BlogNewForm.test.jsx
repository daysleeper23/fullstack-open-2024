import { render, screen } from '@testing-library/react'
import BlogNewForm from '../src/components/BlogNewForm'
import userEvent from '@testing-library/user-event'
import { describe } from 'vitest'

describe('<BlogNewForm />', () => {
  let container

  const createBlog = vi.fn()
  const toggleHandler = vi.fn()

  const user = userEvent.setup()

  beforeEach(() => {
    container = render(<BlogNewForm createNewBlogHandler={createBlog} toggleFormHandler={toggleHandler} />).container
  })

  test('updates parent state and calls onSubmit', async () => {
  
    const titleInput = container.querySelector('#title')
    const authorInput = container.querySelector('#author')
    const urlInput = container.querySelector('#url')
    const createButton = screen.getByText('create')
  
    await user.type(titleInput, 'Test Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'Test URL')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Test Title')
    expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
    expect(createBlog.mock.calls[0][0].url).toBe('Test URL')
  })
})

