import { useDispatch } from 'react-redux'
import { appendAnecdote } from '../reducers/anecdoteReducer'
import { removeNotification, setCreateNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecDoteForm = () => {
  const dispatch = useDispatch()

  const create = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    console.log('create', content)

    try {
      const savedAnecdote = await anecdoteService.create(content)
      console.log('saved:', savedAnecdote)
      if (savedAnecdote) {
        dispatch(appendAnecdote(savedAnecdote))
        dispatch(setCreateNotification(content))

        event.target.anecdote.value = ''
        setTimeout(() => {
          dispatch(removeNotification()) 
        }, 5000)
      }
    }
    catch (exception) {

    }
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