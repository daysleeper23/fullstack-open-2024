import { render, screen } from '@testing-library/react'
import Blog from '../src/components/Blog'
import { beforeEach, expect } from 'vitest'

describe('<Blog />', () => {
  let container 

  const blog = {
    title: 'Blog Title',
    author: 'Blog Author',
    url: 'Blog URL',
    likes: 3,
    user: {
      id: '1',
      username: 'test',
      name: 'testuser'
    }
  }

  const mockLikeHandler = vi.fn()
  const mockRemoveHandler = vi.fn()

  beforeEach(() => {
    container = render(<Blog blog={blog} onLikeClick={mockLikeHandler} onRemoveClick={mockRemoveHandler} username='test'/>).container
  })

  test('renders its title and author at default', () => {
    const div = container.querySelector('#blog')
    expect(div).toHaveTextContent('Blog Title Blog Author')
  })

  test('does not render its likes and url at default', () => {
    const div = container.querySelector('#toggable')
    expect(div).toBeUndefined
  })

  test('renders its toggable content correctly after clicking the show button'), async () => {
    const user = userEvent.setup()
    const button = container.querySelector('#showButton')
    await user.click(button)

    const toggable = container.querySelector('#toggable')
    expect(toggable).toBeDefined

    const likes = container.querySelector('#likes')
    expect(likes).toHaveTextContent('likes 3')

    const url = container.querySelector('#url')
    expect(url).toHaveTextContent('Blog URL')

    const username = container.querySelector('#name')
    expect(url).toHaveTextContent('testuser')
  }

  test('does not render its toggable content after clicking the hide button'), async () => {
    const user = userEvent.setup()
    const button = container.querySelector('#showButton')
    await user.click(button)

    await user.click(button)
    const div = container.querySelector('#toggable')
    expect(div).toBeUndefined
  }

  test('has the event handler called twice if the like button is clicked twice'), async () => {
    const user = userEvent.setup()
    const button = container.querySelector('#showButton')
    await user.click(button)

    const likeButton = screen.getByText(like)
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  }
})