import PropTypes from 'prop-types'

const TodoElement = ({ todo, onDelete, onComplete }) => {

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
      <span>
        {todo.text} 
      </span>
      <span>
        This todo is {todo.done ? 'done' : 'not done'}
      </span>
      <span>
        <button onClick={onDelete(todo)}> Delete </button>
        {todo.done 
          ? <></> 
          : <button onClick={onComplete(todo)}> Set as done </button>
        }
      </span>
    </div>
  )
}

TodoElement.propTypes = {
  todo: PropTypes.shape({
    text: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired
  }),
  onDelete: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired
}

export default TodoElement