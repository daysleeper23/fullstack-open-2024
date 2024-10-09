import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import TodoElement from '../Todos/TodoElement'
import { expect } from 'vitest'

test('renders content', async () => {
  const todo = {
    text: 'Component testing is done with react-testing-library',
    done: false
  }
  const mockComplete = vi.fn();
  const mockDelete = vi.fn();

  render(<TodoElement todo={todo} onComplete={mockComplete} onDelete={mockDelete} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined();

  const status = screen.getByText('This todo is not done');
  expect(status).toBeDefined();

  // Get the buttons
  const completeButton = screen.getByText('Set as done');
  const deleteButton = screen.getByText('Delete');

  const user = userEvent.setup();

  // Act: Simulate user clicking the buttons
  await user.click(completeButton);
  await user.click(deleteButton);

  // Assert: Verify the mock functions were called
  expect(mockComplete.mock.calls).toHaveLength(1)
  expect(mockDelete.mock.calls).toHaveLength(1)
})