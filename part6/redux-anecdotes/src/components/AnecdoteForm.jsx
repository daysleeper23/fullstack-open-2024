import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { removeNotification, setCreateNotification } from '../reducers/notificationReducer'

const AnecDoteForm = () => {
  const dispatch = useDispatch()

  const create = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    console.log('create', content)
    dispatch(createAnecdote(content))
    dispatch(setCreateNotification(content))

    event.target.anecdote.value = ''
    setTimeout(() => {
      dispatch(removeNotification()) 
    }, 5000)
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div><input name='anecdote' /></div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}
export default AnecDoteForm