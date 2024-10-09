import TodoElement from './TodoElement'
import PropTypes from 'prop-types'

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
        return <TodoElement key={todo.text} todo={todo} onDelete={onClickDelete} onComplete={onClickComplete}/>
      })
      .reduce((acc, cur) => [...acc, <hr key={cur.text} />, cur], [])
      }
    </>
  )
}

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  completeTodo: PropTypes.func.isRequired
}

export default TodoList
