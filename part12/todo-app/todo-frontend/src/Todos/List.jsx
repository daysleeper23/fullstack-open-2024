import React from 'react'
import TodoElement from './TodoElement'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  const onClickDelete = (todo) => () => {
    deleteTodo(todo)
  }

  const onClickComplete = (todo) => () => {
    completeTodo(todo)
  }

  return (
    <>
      {todos.map(todo => {
        return <TodoElement todo={todo} onDelete={onClickDelete} onComplete={onClickComplete}/>
      })
      .reduce((acc, cur) => [...acc, <hr />, cur], [])
      }
    </>
  )
}

export default TodoList
